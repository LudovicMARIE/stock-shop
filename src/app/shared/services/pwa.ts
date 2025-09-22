import { Injectable, signal, computed, inject } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { ErrorService } from './error';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private swUpdate = inject(SwUpdate);
  private errorService = inject(ErrorService);

  // Signals for PWA state
  private deferredPrompt = signal<BeforeInstallPromptEvent | null>(null);
  private isInstalled = signal<boolean>(false);
  private isOnline = signal<boolean>(navigator.onLine);
  private updateAvailable = signal<boolean>(false);

  // Computed for installation state
  canInstall = computed(() => !!this.deferredPrompt() && !this.isInstalled());

  // public state readonly
  readonly installPrompt = this.deferredPrompt.asReadonly();
  readonly installed = this.isInstalled.asReadonly();
  readonly online = this.isOnline.asReadonly();
  readonly hasUpdate = this.updateAvailable.asReadonly();

  constructor() {
    this.initializePwa();
    this.setupNetworkListener();
    this.setupUpdateListener();
  }

  /**
   * init PWA events
   */
  private initializePwa(): void {
    // Event install detection
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      console.warn('[PWA] Installation prompt available');
      event.preventDefault();
      this.deferredPrompt.set(event as BeforeInstallPromptEvent);
    });

    // detection if app is installed
    window.addEventListener('appinstalled', () => {
      console.warn('[PWA] App installed successfully');
      this.isInstalled.set(true);
      this.deferredPrompt.set(null);
      this.errorService.showInfo('Application installée avec succès !');
    });

    // check if app is in standalone mode
    this.checkIfInstalled();
  }

  /**
   * Verify if app is installed (standalone mode)
   */
  private checkIfInstalled(): void {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (isStandalone) {
      this.isInstalled.set(true);
      console.warn('[PWA] App is running in standalone mode');
    }
  }

  /**
   * Configure network state listeners
   */
  private setupNetworkListener(): void {
    window.addEventListener('online', () => {
      this.isOnline.set(true);
      console.warn('[PWA] Network: Online');
      this.errorService.showInfo('Connexion rétablie');
    });

    window.addEventListener('offline', () => {
      this.isOnline.set(false);
      console.warn('[PWA] Network: Offline');
      this.errorService.showWarning('Mode hors ligne activé');
    });
  }

  /**
   * Configure service worker update listeners
   */
  private setupUpdateListener(): void {
    if (this.swUpdate.isEnabled) {
      // check update
      this.swUpdate.versionUpdates
        .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
        .subscribe(() => {
          console.warn('[PWA] New version available');
          this.updateAvailable.set(true);
          this.errorService.showInfo('Nouvelle version disponible !');
        });

      // Periodic verification for updates
      setInterval(
        () => {
          this.swUpdate
            .checkForUpdate()
            .then((hasUpdate) => {
              if (hasUpdate) {
                console.warn('[PWA] Update check: New version found');
              }
            })
            .catch((error) => {
              console.error('[PWA] Update check failed:', error);
            });
        },
        6 * 60 * 60 * 1000,
      ); // 6 hours
    }
  }

  /**
   * Propose app installation
   */
  async installApp(): Promise<boolean> {
    const prompt = this.deferredPrompt();
    if (!prompt) {
      console.warn('[PWA] No install prompt available');
      return false;
    }

    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;

      console.warn(`[PWA] Install prompt result: ${outcome}`);

      if (outcome === 'accepted') {
        this.errorService.showInfo('Installation en cours...');
        return true;
      } else {
        this.errorService.showInfo('Installation annulée');
        return false;
      }
    } catch (error) {
      console.error('[PWA] Install error:', error);
      this.errorService.showError("Erreur lors de l'installation");
      return false;
    }
  }

  /**
   * Activate service worker update
   */
  async activateUpdate(): Promise<void> {
    if (!this.swUpdate.isEnabled || !this.updateAvailable()) {
      return;
    }

    try {
      await this.swUpdate.activateUpdate();
      this.updateAvailable.set(false);
      this.errorService.showInfo('Mise à jour appliquée, rechargement...');

      // Reload after short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('[PWA] Update activation failed:', error);
      this.errorService.showError('Erreur lors de la mise à jour');
    }
  }

  /**
   * Content sharing via Web Share API
   */
  async shareContent(data: { title?: string; text?: string; url?: string }): Promise<boolean> {
    if (!navigator.share) {
      console.warn('[PWA] Web Share API not supported');
      return false;
    }

    try {
      await navigator.share(data);
      console.warn('[PWA] Content shared successfully');
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('[PWA] Share failed:', error);
        this.errorService.showError('Erreur lors du partage');
      }
      return false;
    }
  }

  /**
   * Gather PWA stats
   */
  getStats() {
    return {
      isInstalled: this.isInstalled(),
      canInstall: this.canInstall(),
      isOnline: this.isOnline(),
      hasUpdate: this.updateAvailable(),
      swEnabled: this.swUpdate.isEnabled,
      shareSupported: !!navigator.share,
    };
  }
}
