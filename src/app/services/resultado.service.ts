import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultadoService {
  private apiUrl = 'http://localhost:8080/resultado';

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

  create(resultado: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, resultado);
  }

  update(id: number, resultado: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, resultado);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}