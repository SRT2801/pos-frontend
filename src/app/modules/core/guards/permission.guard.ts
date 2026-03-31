import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { Permission } from '../enums/permission.enum';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedPermissions = route.data['permissions'] as Permission[] | Permission;

  if (!authService.isLoggedIn()) {
    return router.parseUrl('/login');
  }

  if (expectedPermissions && !authService.hasPermission(expectedPermissions)) {
    return router.parseUrl('/home');
  }

  return true;
};
