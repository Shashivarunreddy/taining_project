import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { UserRole } from '../models/model';
export const roleGuard = (route: ActivatedRouteSnapshot): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/signin']);
  }

  const allowed: UserRole[] = (route.data['roles'] as UserRole[]) || [];
  const role = auth.getUserRole();

  if (!allowed.length || (role && allowed.includes(role))) {
    return true;
  }
  return router.createUrlTree(['/unauthorized']);
};

