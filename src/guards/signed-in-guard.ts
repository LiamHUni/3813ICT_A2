import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const signedInGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const signedIn = localStorage.getItem('userInfo');

  if(!signedIn){
    return router.parseUrl('');
  }

  return true;
};
