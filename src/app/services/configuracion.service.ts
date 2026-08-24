import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuracion } from '../interfaces/configuracion-interface';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  private apiUrl = `${environment.apiUrl}/configuracion`;

  constructor(private http: HttpClient) { }

  getConfiguracion(): Observable<Configuracion> {
    return this.http.get<Configuracion>(this.apiUrl);
  }

  updateConfiguracion(configuracion: Configuracion): Observable<Configuracion> {
    return this.http.put<Configuracion>(`${this.apiUrl}/${configuracion.idConfiguracion}`, configuracion);
  } 

}
