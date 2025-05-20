import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultadoDto } from '../interfaces/resultado-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultadoService {
  private apiUrl = `${environment.apiUrl}/resultado`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getByEstudianteId(estudianteId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/estudiante/${estudianteId}`);
  }

  create(resultado: ResultadoDto): Observable<ResultadoDto> {
    return this.http.post<ResultadoDto>(this.apiUrl, resultado);
  }

  update(id: number, resultado: ResultadoDto): Observable<ResultadoDto> {
    return this.http.put<ResultadoDto>(`${this.apiUrl}/${id}`, resultado);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}