import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;
  const isUserType = user?.role;

  if (state.url.startsWith('/login')) {
    if (!user) return true;

    return isUserType === 'customer' ? router.createUrlTree(['/customer']) : router.createUrlTree(['/admin']);
  }

  if (state.url.startsWith('/registration')) {
    if (!user) return true;

    return isUserType === 'customer' ? router.createUrlTree(['/customer']) : router.createUrlTree(['/admin']);
  }

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  if (state.url.startsWith('/customer')) {
    return isUserType === 'customer' ? true : router.createUrlTree(['/admin']);
  }

  if (state.url.startsWith('/admin')) {
    return isUserType === 'admin' ? true : router.createUrlTree(['/customer']);
  }

  return true;
};
