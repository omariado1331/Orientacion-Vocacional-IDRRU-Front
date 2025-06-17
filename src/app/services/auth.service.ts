import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { LoginRequest, LoginResponse } from '../interfaces/auth.interface';
import { environment } from '../../environments/environment';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import { NotificacionService } from './notificacion.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly urlApi = `${environment.apiUrl}/auth`;
  private readonly CLAVE_TOKEN = 'token_autenticacion';
  private readonly DATOS_USUARIO = 'datos_usuario';
  private esNavegador: boolean;
  private estadoAutenticacion = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object,
    private notificacionService: NotificacionService
  ) {
    this.esNavegador = isPlatformBrowser(platformId);
    this.inicializarEstadoAutenticacion();
  }

  private inicializarEstadoAutenticacion(): void {
    const estaAutenticado = this.estaAutenticado();
    this.estadoAutenticacion.next(estaAutenticado);
  }

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

  estaAutenticado(): boolean {
    if (!this.esNavegador) return false;
    const token = this.obtenerToken();
    if (!token) return false;

    try {
      const tokenDecodificado: any = jwt_decode(token);
      const ahora = Math.floor(Date.now() / 1000);
      const tokenValido = tokenDecodificado.exp > ahora;
      if (!tokenValido) {
        this.limpiarDatosExpiredToken();
        this.notificacionService.mostrar('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'warning');
      }
      
      return tokenValido;
    } catch {
      this.limpiarDatosExpiredToken();
      return false;
    }
  }
  private limpiarDatosExpiredToken(): void {
    if (this.esNavegador) {
      localStorage.removeItem(this.CLAVE_TOKEN);
      localStorage.removeItem(this.DATOS_USUARIO);
    }
    this.estadoAutenticacion.next(false);
  }

  obtenerToken(): string | null {
    return this.esNavegador ? localStorage.getItem(this.CLAVE_TOKEN) : null;
  }

  obtenerDatosUsuario(): any {
    if (!this.esNavegador) return null;
    const datosUsuario = localStorage.getItem(this.DATOS_USUARIO);
    return datosUsuario ? JSON.parse(datosUsuario) : null;
  }

  obtenerEstadoAutenticacion(): Observable<boolean> {
    return this.estadoAutenticacion.asObservable();
  }

  establecerEstadoAutenticacion(estado: boolean): void {
    this.estadoAutenticacion.next(estado);
  }

  verificarYActualizarEstado(): void {
    const estaAutenticado = this.estaAutenticado();
    this.estadoAutenticacion.next(estaAutenticado);
  }
}