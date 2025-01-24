import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { StateService } from '../../../storage/state.service';
import { AuthService } from '../service/auth.service';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  //const stateService = inject(StateService);
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.token() != '') {
    //console.log('Autenticado: ', authService.token());
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
