import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Facultad {
  idFacultad: number;
  nombre: string;
  codigo: string;
  chaside: number;
  url: string;
  imgLogo: string;
  carreras: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FacultadService {
  private apiUrl = `${environment.apiUrl}/facultad`;
  constructor(private http: HttpClient) { }

  getAll(): Observable<Facultad[]> {
      return this.http.get<Facultad[]>(`${this.apiUrl}`);
  }

  getById(id: number): Observable<Facultad> {
      return this.http.get<Facultad>(`${this.apiUrl}/${id}`);
  }
}