// holland.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HOLLAND_OFFLINE } from '../data/static-data';

@Injectable({
  providedIn: 'root'
})
export class HollandService {
  private apiUrl = `${environment.apiUrl}/holland`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      catchError(error => {
        console.warn('Error al obtener holland. Usando datos offline...', error);
        return of(HOLLAND_OFFLINE);
      })
    );
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const found = HOLLAND_OFFLINE.find(h => h.idHolland === id);
        if (found) return of(found);
        throw new Error('Holland no encontrado offline');
      })
    );
  }
}