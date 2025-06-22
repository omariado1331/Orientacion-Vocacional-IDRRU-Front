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
  const router = inject(Router);

  const parsedUrl = new URL(req.url);
  const path = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  const urlsProtegidas = [
    '/auth/logout',
    '/holland',
    '/chaside',
    '/estudiante',
    '/resultado/', 
  ];
  const esPostLibre = method === 'POST' && (path.startsWith('/estudiante') || path.startsWith('/resultado'));
  const esBusquedaProvincia = path.startsWith('/resultado/busqueda-provincia');
  const esResultadoFecha = path === '/resultado/fecha';
  const necesitaToken = !esPostLibre && !esBusquedaProvincia && !esResultadoFecha && urlsProtegidas.some(url => path.startsWith(url));

  if (necesitaToken) {
    const token = authService.obtenerToken();
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next(authReq);
    } else {
      console.warn('Acceso denegado: Token no encontrado para ruta protegida.');
      router.navigate(['/control-orientacion']);
      return EMPTY;
    }
  }

  return next(req);
};