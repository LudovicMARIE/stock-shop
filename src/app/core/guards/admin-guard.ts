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
    return true; // Autorized
  } else {
    // Redirect to home page
    router.navigate(['/']);
    return false; // Refused
  }
};
