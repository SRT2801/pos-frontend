import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { API_BASE_URL } from '../../../../app.config';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiBase = inject(API_BASE_URL);
  const platformId = inject(PLATFORM_ID);

  if (!req.url.startsWith(apiBase)) {
    return next(req);
  }

  // NO agregar Authorization en rutas públicas
  if (
    req.url.endsWith('/auth/signup') ||
    req.url.endsWith('/auth/signin') ||
    req.url.endsWith('/auth/register-store')
  ) {
    return next(req);
  }

  const token = isPlatformBrowser(platformId) ? localStorage.getItem('token') : null;

  if (!token) {
    return next(req);
  }

  const requWithToken = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(requWithToken);
};
