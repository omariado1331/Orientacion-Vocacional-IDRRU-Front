// estudiante.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { EstudianteI } from '../interfaces/estudiante-interface';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = `${environment.apiUrl}/estudiante`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<EstudianteI[]> {
    return this.http.get<EstudianteI[]>(this.apiUrl);
  }

  getById(id: number): Observable<EstudianteI> {
    return this.http.get<EstudianteI>(`${this.apiUrl}/${id}`);
  }

  create(estudiante: EstudianteI): Observable<EstudianteI> {
    const payload = { ...estudiante, id_municipio: estudiante.idMunicipio };
    return this.http.post<EstudianteI>(`${this.apiUrl}/`, payload);
  }

  update(id: number, estudiante: EstudianteI): Observable<EstudianteI> {
    const payload = { ...estudiante, id_municipio: estudiante.idMunicipio };
    return this.http.put<EstudianteI>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
