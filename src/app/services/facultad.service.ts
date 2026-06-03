import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { FACULTADES_OFFLINE } from '../data/static-data';

export interface Facultad {
  idFacultad: number;
  nombre: string;
  codigo: string;
  chaside: number;
  url: string;
  imgLogo: string;
  carreras: string[];
  idChaside?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FacultadService {
  private apiUrl = `${environment.apiUrl}/facultad`;
  constructor(private http: HttpClient) { }

  getAll(): Observable<Facultad[]> {
    return this.http.get<Facultad[]>(this.apiUrl).pipe(
      catchError(error => {
        console.warn('Error al obtener facultades. Usando datos offline...', error);
        return of(FACULTADES_OFFLINE.map(f => ({
          ...f,
          chaside: f.idChaside,
          carreras: typeof f.carreras === 'string' ? JSON.parse(f.carreras) as string[] : f.carreras
        })));
      })
    );
  }

  getById(id: number): Observable<Facultad> {
    return this.http.get<Facultad>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const found = FACULTADES_OFFLINE.find(f => f.idFacultad === id);
        if (found) {
          return of({
            ...found,
            chaside: found.idChaside,
            carreras: typeof found.carreras === 'string' ? JSON.parse(found.carreras) as string[] : found.carreras
          });
        }
        throw new Error('Facultad no encontrada offline');
      })
    );
  }
}