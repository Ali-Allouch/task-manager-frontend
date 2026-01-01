import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  if (token) {
    return true;
  } else {
    console.warn('Access denied, you have to login first.');
    router.navigate(['/login']);
    return false;
  }
};