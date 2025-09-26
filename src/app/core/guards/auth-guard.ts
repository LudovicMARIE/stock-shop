import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from 'src/app/features/auth/services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();

  if (currentUser) {
    return true; // Autorized
  } else {
    // Redirect to login page with the return url

    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false; // Refused
  }
};
