import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EvaluacionRequest } from '../interfaces/evaluacion-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {

  private apiUrl = `${environment.apiUrl}/evaluacion`;

  constructor(
    private http: HttpClient
  ) {  }

  guardarEvaluacion(evaluacion: EvaluacionRequest): Observable<any>{
    return this.http.post<any>(this.apiUrl, evaluacion);
  }

}
