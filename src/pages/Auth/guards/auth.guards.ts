import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  if (token !== null && token !== '') {
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
