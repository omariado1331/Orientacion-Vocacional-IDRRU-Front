import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Provincia } from '../interfaces/provincia-interface';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PROVINCIAS_OFFLINE } from '../data/static-data';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {

  private baseUrl = `${environment.apiUrl}/provincia`;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getProvincias(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(`${this.baseUrl}`).pipe(
      tap(data => {
        if (this.isBrowser) {
          localStorage.setItem('provincias_cache', JSON.stringify(data));
        }
      }),
      catchError(error => {
        console.warn('Error al obtener provincias. Usando datos offline...', error);
        
        let cachedData: Provincia[] | null = null;
        if (this.isBrowser) {
          const cache = localStorage.getItem('provincias_cache');
          if (cache) {
            try {
              cachedData = JSON.parse(cache);
            } catch (e) {
              console.error('Error parseando caché', e);
            }
          }
        }
        return of(cachedData || PROVINCIAS_OFFLINE);
      })
    );
  }

  /** Obtiene una provincia por su ID desde el servidor o fallback. */
  getById(id: number): Observable<Provincia> {
    return this.http.get<Provincia>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => {
        const fallbackList = PROVINCIAS_OFFLINE;
        const found = fallbackList.find(p => p.idProvincia === id);
        if (found) return of(found);
        throw new Error('Provincia no encontrada offline');
      })
    );
  }
}
