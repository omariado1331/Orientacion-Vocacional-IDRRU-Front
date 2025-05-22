import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultadoService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8080/resultado'; 

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
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
