import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { EMPTY } from 'rxjs';
import { Router } from '@angular/router';
/**
 * Interceptor HTTP para añadir el token de autenticacion a las peticiones.
 * Solo agrega el header 'Authorization' a URLs especificas.
 * @param req La peticion HTTP saliente.
 * @param next El siguiente manejador en la cadena de interceptores.
 * @returns Un Observable del evento HTTP.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const urlsProtegidas = [
    '/auth/logout',
    '/estudiante',
    '/provincia',
  ];

  const necesitaToken = urlsProtegidas.some(url => req.url.includes(url));
  const router = inject(Router);

  if (necesitaToken) { 
    const token = authService.getToken();
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(authReq);
    }else {
      console.warn('Acceso denegado: Token no encontrado para ruta protegida.');
      router.navigate(['/control-orientacion']); 
      return EMPTY; 
    }
  }
  return next(req);
};