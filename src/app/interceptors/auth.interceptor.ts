import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor HTTP para añadir el token JWT a las peticiones protegidas.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Al proveer 'http://localhost' como base, evitamos errores si req.url es una ruta relativa
  const parsedUrl = new URL(req.url, 'http://localhost');
  const path = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // ── Rutas 100% públicas (coinciden con el SecurityConfig del backend) ──────
  const esRutaPublica =
    // Login y Registro
    path === '/auth/login' ||
    path === '/auth/register' ||
    
    // GETs públicos de catálogos
    (method === 'GET' && path.startsWith('/municipio')) ||
    (method === 'GET' && path.startsWith('/provincia')) ||
    (method === 'GET' && path.startsWith('/chaside')) ||
    (method === 'GET' && path.startsWith('/holland')) ||
    (method === 'GET' && path.startsWith('/facultad')) ||
    (method === 'GET' && (path === '/colegio' || path.startsWith('/colegio/municipio'))) ||
    
    // Resultados públicos
    (method === 'GET' && path.startsWith('/resultado/busqueda-provincia')) ||
    (method === 'GET' && path.startsWith('/resultado/fecha')) || // <-- Cambiado a startsWith
    
    // Configuración (Faltaban estas dos)
    (method === 'GET' && path === '/configuracion') ||
    (method === 'PUT' && path.startsWith('/configuracion')) ||
    
    // POSTs públicos
    (method === 'POST' && path === '/evaluacion') ||
    (method === 'POST' && path.startsWith('/estudiante')) ||
    (method === 'POST' && path.startsWith('/resultado'));

  // Si la ruta es pública, no añadir token
  if (esRutaPublica) {
    return next(req);
  }

  // Para todas las demás rutas, intentar adjuntar el token JWT
  const token = authService.obtenerToken();
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  // Sin token para ruta protegida — dejar pasar (el backend responderá 401/403)
  return next(req);
};