import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Colegio } from '../interfaces/colegio-interface';


@Injectable({
  providedIn: 'root'
})
export class ColegioService {
  private apiUrl = `${environment.apiUrl}/colegio`;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platFormId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platFormId);
   }

   getAllColegios(): Observable<Colegio[]> {
    return this.http.get<Colegio[]>(this.apiUrl).pipe(
      tap(data => {
        if (this.isBrowser){
          localStorage.setItem('colegios_cache', JSON.stringify(data));
        }
      }), 
      catchError ( error => {
        console.warn("error al obtener los colegios...", error);
        let cachedData: Colegio[] | null = null;
        if (this.isBrowser) {
          const cache = localStorage.getItem('colegios_cache');
          if (cache) {
            try{
              cachedData = JSON.parse(cache);
            } catch (e) {
              console.error("error al parsear los datos", e);
            }
          }
        }
        return of (cachedData || [])
      })
    );
   }

   getColegiosPorMunicipioHttp(idMunicipio: number): Observable<Colegio[]> {
    return this.http.get<Colegio[]>(`${this.apiUrl}/municipio/${idMunicipio}`).pipe(
      catchError(() => {
        const localList = this.getOfflineColegios();
        const filtered = localList.filter( m => m.idMunicipio === idMunicipio);
        return of(filtered);
      })
    )
   }

   private getOfflineColegios(): Colegio[] {
    let cachedData: Colegio[] | null = null;
    if (this.isBrowser) {
      const cache = localStorage.getItem('colegios_cache');
      if (cache) {
        try {
          cachedData = JSON.parse(cache);
        } catch (e) {
          console.error("error al parsear los datos", e);
        }
      }
    }
    return cachedData || [];
   }

  create(colegio: Colegio): Observable<Colegio> {
    return this.http.post<Colegio>(this.apiUrl, colegio);
  } 
   
  update(id: number, colegio: Colegio): Observable<Colegio> {
    return this.http.put<Colegio>(`${this.apiUrl}/${id}`, colegio);
  } 
   
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}
