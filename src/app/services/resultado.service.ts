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
    idProvincia?: number, // recibe 3 parametros ? opcional
    idMunicipio?: number,
    year?: string
  ): Observable<ResultadoDtoResponse[]> { //Es un flujo que emitira un objeto o arreglo del tipo de dato, devuelve datos asíncronos.
    let params = new HttpParams();  //crea un contenedor vacío para query params.
    if (idProvincia !== undefined) {  // undefined Variable declarada pero sin valor // null Valor explícito "vacío"
      params = params.set('idProvincia', idProvincia.toString());
    }
    if (idMunicipio !== undefined) {
      params = params.set('idMunicipio', idMunicipio.toString());
    }
    if (year !== undefined) {
      params = params.set('year', year);
    }
    return this.http.get<ResultadoDtoResponse[]>(`${this.apiUrl}/busqueda-provincia`, { params }); // params Son los parámetros de consulta que se agregan a la URL (por ejemplo: ?idProvincia=5&year=2023).
  }
}