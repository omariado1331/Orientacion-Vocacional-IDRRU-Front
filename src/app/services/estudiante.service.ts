import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable} from 'rxjs';
import { EstudianteI } from '../interfaces/estudiante-interface';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = `${environment.apiUrl}/estudiante`; 

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(estudiante: EstudianteI): Observable<EstudianteI> {
    return this.http.post<EstudianteI>(`${this.apiUrl}/`, estudiante);
  }

  update(id: number, estudiante: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, estudiante);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

}
