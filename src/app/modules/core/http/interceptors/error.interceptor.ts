import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        // Token expirado o inválido → redirigir a login
        // Ejemplo: inject(Router).navigate(['/login']);
        console.error('No autorizado. Redirigir a login.');
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
    })
  );
};
