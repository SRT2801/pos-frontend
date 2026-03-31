import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { Role } from '../enums/role.enum';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as Role[] | Role;

  if (!authService.isLoggedIn()) {
    return router.parseUrl('/login');
  }

  if (expectedRoles && !authService.hasRole(expectedRoles)) {
    return router.parseUrl('/home');
  }

  return true;
};
