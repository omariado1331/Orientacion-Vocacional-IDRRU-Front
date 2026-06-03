import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Municipio } from '../interfaces/municipio-interface';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { MUNICIPIOS_OFFLINE } from '../data/static-data';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {
  private apiUrl = `${environment.apiUrl}/municipio`;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getAllMunicipios(): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(this.apiUrl).pipe(
      tap(data => {
        if (this.isBrowser) {
          localStorage.setItem('municipios_cache', JSON.stringify(data));
        }
      }),
      catchError(error => {
        console.warn('Error al obtener municipios. Usando datos offline...', error);
        
        let cachedData: Municipio[] | null = null;
        if (this.isBrowser) {
          const cache = localStorage.getItem('municipios_cache');
          if (cache) {
            try {
              cachedData = JSON.parse(cache);
            } catch (e) {
              console.error('Error parseando caché', e);
            }
          }
        }
        return of(cachedData || MUNICIPIOS_OFFLINE);
      })
    );
  }

  getById(id: number): Observable<Municipio> {
    return this.http.get<Municipio>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const found = MUNICIPIOS_OFFLINE.find(m => m.idMunicipio === id);
        if (found) return of(found);
        throw new Error('Municipio no encontrado offline');
      })
    );
  }

  getMunicipiosPorProvinciaHttp(idProvincia: number): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(`${this.apiUrl}/provincia/${idProvincia}`).pipe(
      catchError(() => {
        const localList = this.getOfflineMunicipios();
        const filtered = localList.filter(m => m.idProvincia === idProvincia);
        return of(filtered);
      })
    );
  }

  private getOfflineMunicipios(): Municipio[] {
    let cachedData: Municipio[] | null = null;
    if (this.isBrowser) {
      const cache = localStorage.getItem('municipios_cache');
      if (cache) {
        try {
          cachedData = JSON.parse(cache);
        } catch (e) {
          console.error('Error parseando caché', e);
        }
      }
    }
    return cachedData || MUNICIPIOS_OFFLINE;
  }
}
