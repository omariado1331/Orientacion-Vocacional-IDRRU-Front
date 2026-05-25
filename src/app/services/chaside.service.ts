// chaside.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CHASIDE_OFFLINE } from '../data/static-data';

@Injectable({
  providedIn: 'root'
})
export class ChasideService {
  private apiUrl = `${environment.apiUrl}/chaside`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      catchError(error => {
        console.warn('Error al obtener chaside. Usando datos offline...', error);
        return of(CHASIDE_OFFLINE);
      })
    );
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const found = CHASIDE_OFFLINE.find(c => c.idChaside === id);
        if (found) return of(found);
        throw new Error('Chaside no encontrado offline');
      })
    );
  }
}