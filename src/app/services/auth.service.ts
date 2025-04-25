// auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { LoginRequest, LoginResponse } from '../interfaces/auth.interface';

/**
 * Servicio para manejar la autenticacion, compatible con SSR.
 * Usa localStorage solo en entorno de navegador.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_DATA = 'user_data';
  private isBrowser: boolean;

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
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Realiza una solicitud de inicio de sesion.
   * Guarda el token y datos del usuario en localStorage solo si es en navegador.
   * @param credentials Las credenciales del usuario.
   * @returns Un Observable con la respuesta de login.
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (this.isBrowser) {
            localStorage.setItem(this.TOKEN_KEY, response.token);
            localStorage.setItem(this.USER_DATA, JSON.stringify({
              username: response.username,
              nombre: response.nombre,
              rol: response.rol
            }));
          }
        }),
        catchError(error => {
          console.error('Error al iniciar sesion:', error);
          return throwError(() => new Error('Credenciales invalidas o error de servidor'));
        })
      );
  }

  /**
   * Cierra la sesion eliminando datos de localStorage (solo en navegador).
   */
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_DATA);
    }
  }

  /**
   * Verifica si el usuario esta autenticado (si existe el token).
   * Retorna false si no esta en navegador.
   * @returns True si el token existe y esta en navegador, False en caso contrario.
   */
  isAuthenticated(): boolean {
    return this.isBrowser ? !!this.getToken() : false;
  }

  /**
   * Obtiene el token de autenticacion de localStorage.
   * Retorna null si no esta en navegador.
   * @returns El token o null.
   */
  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null;
  }

  /**
   * Obtiene los datos del usuario de localStorage.
   * Retorna null si no esta en navegador o no hay datos.
   * @returns Un objeto con los datos del usuario o null.
   */
  getUserData(): any {
    if (!this.isBrowser) return null;

    const userData = localStorage.getItem(this.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }
}