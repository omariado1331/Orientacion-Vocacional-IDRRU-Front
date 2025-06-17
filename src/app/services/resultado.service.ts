import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resultado, ResultadoDto } from '../interfaces/resultado-interface';
import { environment } from '../../environments/environment';

import { ResultadoDtoResponse } from '../interfaces/resultado-dto-response';

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
    return this.http.post<ResultadoDto>(`${this.apiUrl}/`, resultado);
  }
  createR(resultado: Resultado): Observable<Resultado> {
    return this.http.post<Resultado>(`${this.apiUrl}/`, resultado);
  }

  update(id: number, resultado: ResultadoDto): Observable<ResultadoDto> {
    return this.http.put<ResultadoDto>(`${this.apiUrl}/${id}`, resultado);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  busquedaProvincia(

    idProvincia?: number,
    idMunicipio?: number,
    fechaInicio?: string,
    fechaFin?: string

  ): Observable<ResultadoDtoResponse[]> {

    let params = new HttpParams();

    if (typeof idProvincia === 'number' && !isNaN(idProvincia)) {
      params = params.set('idProvincia', idProvincia.toString());
    }

    if (typeof idMunicipio === 'number' && !isNaN(idMunicipio)) {
      params = params.set('idMunicipio', idMunicipio.toString());
    }

    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }


    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }

    return this.http.get<ResultadoDtoResponse[]>(`${this.apiUrl}/busqueda-provincia`, { params });
  }
  
  obtenerAniosDisponibles(idProvincia?: number, idMunicipio?: number): Observable<string[]> {
    let params = new HttpParams();
    if (idProvincia != null) {
      params = params.set('idProvincia', idProvincia.toString());
    }
    if (idMunicipio != null) {
      params = params.set('idMunicipio', idMunicipio.toString());
    }
    return this.http.get<string[]>(`${this.apiUrl}/fecha`, { params });
  }


}