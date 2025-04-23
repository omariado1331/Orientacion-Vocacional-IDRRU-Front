// facultad.service.ts - Servicio para gestionar la obtención y caché de datos de facultades
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap, shareReplay } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Facultad } from '../interfaces/facultad.interface';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class FacultadService {
  private readonly apiUrl = 'http://localhost:8080';
  private readonly CACHE_KEY = 'facultades_cache';
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutos en milisegundos
  
  private facultadesSubject = new BehaviorSubject<Facultad[]>([]);
  facultades$ = this.facultadesSubject.asObservable();
  
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      this.loadFromCache();
    }
  }

  /**
   * Carga facultades desde la API o caché si la API falla
   * @returns Observable con el array de facultades
   */
  cargarFacultades(): Observable<Facultad[]> {
    return this.http.get<Facultad[]>(`${this.apiUrl}/facultad`).pipe(
      tap(facultades => {
        this.facultadesSubject.next(facultades);
        if (this.isBrowser) {
          this.saveToCache(facultades);
        }
      }),
      catchError(error => {
        console.error('Error al cargar facultades:', error);
        // Si hay error, intentar recuperar de caché
        if (this.isBrowser) {
          const cachedData = this.loadFromCache();
          if (cachedData.length > 0) {
            return of(cachedData);
          }
        }
        return of([]);
      }),
      shareReplay(1)
    );
  }

  /**
   * Obtiene las carreras de una facultad específica
   * @param codigoFacultad - Código identificador de la facultad
   * @returns Observable con el array de nombres de carreras
   */
  getCarrerasByFacultad(codigoFacultad: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/facultad/${codigoFacultad}/carrera`)
      .pipe(
        catchError(error => {
          console.error(`Error al obtener carreras para facultad ${codigoFacultad}:`, error);
          return of([]);
        }),
        shareReplay(1)
      );
  }

  /**
   * Guarda los datos en el localStorage
   * @param facultades - Array de facultades para guardar en caché
   */
  private saveToCache(facultades: Facultad[]): void {
    if (!this.isBrowser) return;
    
    try {
      const cacheItem: CacheItem<Facultad[]> = {
        data: facultades,
        timestamp: new Date().getTime()
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheItem));
    } catch (e) {
      console.error('Error al guardar en cache:', e);
    }
  }

  /**
   * Recupera datos de facultades desde localStorage si están disponibles
   * y no han expirado
   * @returns Array de facultades recuperadas de caché o array vacío
   */
  private loadFromCache(): Facultad[] {
    if (!this.isBrowser) return [];
    
    try {
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        const cache: CacheItem<Facultad[]> = JSON.parse(cachedData);
        const now = new Date().getTime();
        
        if (now - cache.timestamp < this.CACHE_DURATION) {
          this.facultadesSubject.next(cache.data);
          return cache.data;
        }
      }
    } catch (e) {
      console.error('Error al recuperar cache:', e);
    }
    return [];
  }
}