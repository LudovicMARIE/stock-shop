import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from 'src/app/features/auth/services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();

  if (currentUser) {
    return true; // Accès autorisé
  } else {
    // Rediriger vers login avec l'URL de retour

    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false; // Accès refusé
  }
};
