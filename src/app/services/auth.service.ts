// auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { LoginRequest, LoginResponse } from '../interfaces/auth.interface';
import { environment } from '../../environments/environment';
import { jwtDecode as jwt_decode } from 'jwt-decode';

/**
 * Servicio para manejar la autenticación, compatible con SSR.
 * Usa localStorage solo en entorno de navegador.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly urlApi = `${environment.apiUrl}/auth`;
  private readonly CLAVE_TOKEN = 'token_autenticacion';
  private readonly DATOS_USUARIO = 'datos_usuario';
  private esNavegador: boolean;
  private estadoAutenticacion = new BehaviorSubject<boolean>(false);

  /**
   * Constructor del servicio.
   * Inyecta HttpClient y verifica la plataforma (navegador/servidor).
   * @param http Cliente HTTP de Angular.
   * @param platformId Identificador de la plataforma.
   */
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.esNavegador = isPlatformBrowser(platformId);
    this.inicializarEstadoAutenticacion();
  }

  /**
   * Inicializa el estado de autenticación verificando el token existente
   */
  private inicializarEstadoAutenticacion(): void {
    const estaAutenticado = this.estaAutenticado();
    this.estadoAutenticacion.next(estaAutenticado);
  }

  /**
   * Realiza una solicitud de inicio de sesión.
   * Guarda el token y datos del usuario en localStorage solo si es en navegador.
   * @param credenciales Las credenciales del usuario.
   * @returns Un Observable con la respuesta de login.
   */
  iniciarSesion(credenciales: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.urlApi}/login`, credenciales)
      .pipe(
        tap(respuesta => {
          if (this.esNavegador) {
            localStorage.setItem(this.CLAVE_TOKEN, respuesta.token);
            localStorage.setItem(this.DATOS_USUARIO, JSON.stringify({
              username: respuesta.username,
              nombre: respuesta.nombre
            }));
          }
          this.estadoAutenticacion.next(true);
        }),
        catchError(error => {
          console.error('Error al iniciar sesión:', error);
          return throwError(() => new Error('Credenciales inválidas o error de servidor'));
        })
      );
  }

  /**
   * Cierra la sesión eliminando datos de localStorage.
   */
  cerrarSesion(): Observable<any> {
    if (this.esNavegador) {
      localStorage.removeItem(this.CLAVE_TOKEN);
      localStorage.removeItem(this.DATOS_USUARIO);
    }
    this.estadoAutenticacion.next(false);
    return this.http.post<any>(`${this.urlApi}/logout`, {})
      .pipe(catchError(() => {
        return throwError(() => new Error('Error al cerrar sesión'));
      }));
  }

  /**
   * Verifica si el usuario está autenticado (si existe el token válido).
   * Retorna false si no está en navegador.
   * @returns True si el token existe, es válido y está en navegador, False en caso contrario.
   */
  estaAutenticado(): boolean {
    if (!this.esNavegador) return false;
    const token = this.obtenerToken();
    if (!token) return false;

    try {
      const tokenDecodificado: any = jwt_decode(token);
      const ahora = Math.floor(Date.now() / 1000);
      const tokenValido = tokenDecodificado.exp > ahora;
      
      // Si el token expiró, limpiar localStorage
      if (!tokenValido) {
        this.limpiarDatosExpiredToken();
      }
      
      return tokenValido;
    } catch {
      // Si hay error al decodificar, limpiar localStorage
      this.limpiarDatosExpiredToken();
      return false;
    }
  }

  /**
   * Limpia los datos cuando el token ha expirado o es inválido
   */
  private limpiarDatosExpiredToken(): void {
    if (this.esNavegador) {
      localStorage.removeItem(this.CLAVE_TOKEN);
      localStorage.removeItem(this.DATOS_USUARIO);
    }
    this.estadoAutenticacion.next(false);
  }

  /**
   * Obtiene el token de autenticación de localStorage.
   * Retorna null si no está en navegador.
   * @returns El token o null.
   */
  obtenerToken(): string | null {
    return this.esNavegador ? localStorage.getItem(this.CLAVE_TOKEN) : null;
  }

  /**
   * Obtiene los datos del usuario de localStorage.
   * Retorna null si no está en navegador o no hay datos.
   * @returns Un objeto con los datos del usuario o null.
   */
  obtenerDatosUsuario(): any {
    if (!this.esNavegador) return null;
    const datosUsuario = localStorage.getItem(this.DATOS_USUARIO);
    return datosUsuario ? JSON.parse(datosUsuario) : null;
  }

  /**
   * Obtiene el estado de autenticación como Observable
   * @returns Observable del estado de autenticación
   */
  obtenerEstadoAutenticacion(): Observable<boolean> {
    return this.estadoAutenticacion.asObservable();
  }

  /**
   * Establece manualmente el estado de autenticación
   * @param estado El nuevo estado de autenticación
   */
  establecerEstadoAutenticacion(estado: boolean): void {
    this.estadoAutenticacion.next(estado);
  }

  /**
   * Verifica y actualiza el estado de autenticación
   * Útil para llamar después de recargar la página
   */
  verificarYActualizarEstado(): void {
    const estaAutenticado = this.estaAutenticado();
    this.estadoAutenticacion.next(estaAutenticado);
  }
}