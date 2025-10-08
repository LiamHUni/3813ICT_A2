import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

/*
* Guard to check if user is signed in
*/

export const signedInGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const signedIn = localStorage.getItem('userInfo');

  if(!signedIn){
    return router.parseUrl('');
  }

  return true;
};
