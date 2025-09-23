import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../features/auth/services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  route.toString();
  state.toString();
  const authService = inject(Auth);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();

  if (currentUser && currentUser.role === 'admin') {
    return true; // Accès admin autorisé
  } else {
    // Rediriger vers la page d'accueil
    router.navigate(['/']);
    return false; // Accès refusé
  }
};
