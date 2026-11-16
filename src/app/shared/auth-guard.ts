import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;
  const isUserType = user?.role;

  if (state.url.startsWith('/login') || state.url.startsWith('/registration')) {
    localStorage.removeItem('user');
    return true;
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
