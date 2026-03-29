import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_BASE_URL } from '../../../../app.config'; 

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiBase = inject(API_BASE_URL);

  // Si la petición es externa a nuestra API, la dejamos pasar sin modificar
  if (!req.url.startsWith(apiBase)) {
    return next(req);
  }

  // Rutas públicas que NO necesitan que mandemos cookies o credenciales
  if (
    req.url.endsWith('/auth/signup') ||
    req.url.endsWith('/auth/signin') ||
    req.url.endsWith('/auth/register-store')
  ) {
    return next(req);
  }

  // El CAMBIO: En lugar de usar localStorage y un header Bearer manual, 
  // solo le decimos a Axios/Fetch de Angular que envíe las cookies seguras.
  const reqWithCookies = req.clone({
    withCredentials: true 
  });

  return next(reqWithCookies);
};
