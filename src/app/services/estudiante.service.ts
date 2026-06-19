// estudiante.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Estudiante } from '../interfaces/estudiante-interface';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = `${environment.apiUrl}/estudiante`;

  constructor(private http: HttpClient) { }

  private toBackendFormat(estudiante: Estudiante): any {
    return {
      ...estudiante,
      id_estudiante: estudiante.idEstudiante,
      ci_estudiante: estudiante.ciEstudiante,
      ap_paterno: estudiante.apPaterno,
      ap_materno: estudiante.apMaterno,
      id_municipio: estudiante.idMunicipio,
      id_colegio: estudiante.idColegio,
      created_at: estudiante.createdAt
    };
  }

  private toFrontendFormat(data: any): Estudiante {
    return {
      ...data, 
      idEstudiante: data.id_estudiante ?? data.idEstudiante,
      ciEstudiante: data.ci_estudiante ?? data.ciEstudiante,
      apPaterno: data.ap_paterno ?? data.apPaterno,
      apMaterno: data.ap_materno ?? data.apMaterno,
      idMunicipio: data.id_municipio ?? data.idMunicipio,
      idColegio: data.id_colegio ?? data.idColegio,
      createdAt: data.created_at ?? data.createdAt,
      colegio: data.nombreColegio ?? data.colegio ?? null
    };
  }

  getAll(): Observable<Estudiante[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => data.map(item => this.toFrontendFormat(item)))
    );
  }

  getById(id: number): Observable<Estudiante> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(data => this.toFrontendFormat(data))
    );
  }

  create(estudiante: Estudiante): Observable<Estudiante> {
    const payload = this.toBackendFormat(estudiante);
    return this.http.post<any>(`${this.apiUrl}/`, payload).pipe(
      map(data => this.toFrontendFormat(data))
    );
  }

  update(id: number, estudiante: Estudiante): Observable<Estudiante> {
    const payload = this.toBackendFormat(estudiante);
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload).pipe(
      map(data => this.toFrontendFormat(data))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
