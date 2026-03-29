import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';


const AUTH_ENDPOINTS = [
  '/auth/refresh',
  '/auth/signin',
  '/auth/signup',
  '/auth/signout',
  '/auth/register-store',
];

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        
        const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) => req.url.includes(ep));
        if (isAuthEndpoint) {
          router.navigate(['/login']);
          return throwError(() => error);
        }

        
        return http
          .post(`${environment.apiUrl}/auth/refresh`, {}, { withCredentials: true })
          .pipe(
            switchMap(() => next(req)),
            catchError(() => {
              router.navigate(['/login']);
              return throwError(() => error);
            }),
          );
      }

      if (error.status === 403) {
        console.error('Acceso prohibido.');
      }

      if (error.status === 0) {
        console.error('Sin conexión al servidor.');
      }

      if (error.status >= 500) {
        console.error('Error interno del servidor.');
      }

      return throwError(() => error);
    }),
  );
};
