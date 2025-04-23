// auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs'; 
import { tap, catchError, map } from 'rxjs/operators';
import { Usuario, LoginRequest, LoginResponse } from '../interfaces/auth.interface';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private isBrowser: boolean;

  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser$: Observable<Usuario | null>;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    let initialUser: Usuario | null = null;
    if (this.isBrowser) {
      initialUser = this.getUserFromStorage();
    }
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(initialUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          const user: Usuario = {
            username: response.username,
            nombre: response.nombre,
            rol: response.rol
          };
          this.setSession(response.token, user);
          this.currentUserSubject.next(user);
        }),
        catchError(error => {
          console.error('Error al iniciar sesión:', error);
          this.clearSession();
          return throwError(() => new Error('Credenciales inválidas o error de servidor'));
        })
      );
  }

  logout(): void {
     this.clearSession();
  }

  private clearSession(): void {
     if (this.isBrowser) {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
     }
     this.currentUserSubject.next(null); 
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser) {
      return false; 
    }
    return !!this.getToken();
  }

  getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }
  private setSession(token: string, user: Usuario): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  private getUserFromStorage(): Usuario | null {
    if (!this.isBrowser) {
      return null;
    }
    const userData = localStorage.getItem(this.USER_KEY);
    try {
        return userData ? JSON.parse(userData) : null;
    } catch (e) {
        console.error("Error parsing user data from localStorage", e);
        localStorage.removeItem(this.USER_KEY); 
        return null;
    }
  }

  public getCurrentUserValue(): Usuario | null {
     return this.currentUserSubject.value;
  }
}