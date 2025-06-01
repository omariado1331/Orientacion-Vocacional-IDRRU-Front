import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProvinciaI } from '../interfaces/provincia-interface';
import { Provincia } from '../interfaces/provincia-interface';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {

  private apiUrl = `${environment.apiUrl}/provincia`;
  constructor(private http: HttpClient) { }

  getProvincias(): Observable<ProvinciaI[]> {
      return this.http.get<ProvinciaI[]>(`${this.apiUrl}`);
  }

  getById(id: number): Observable<ProvinciaI> {
      return this.http.get<ProvinciaI>(`${this.apiUrl}/${id}`);
  }

  provincias: Provincia[] = [
    new Provincia(1, 'ABEL ITURRALDE'),
    new Provincia(2, 'AROMA'),
    new Provincia(3, 'BAUTISTA SAAVEDRA'),
    new Provincia(4, 'CAMACHO'),
    new Provincia(5, 'CARANAVI'),
    new Provincia(6, 'FRANZ TAMAYO'),
    new Provincia(7, 'GUALBERTO VILLAROEL'),
    new Provincia(8, 'INGAVI'),
    new Provincia(9, 'INQUISIVO'),
    new Provincia(10, 'JOSE MANUEL PANDO'),
    new Provincia(11, 'LARECAJA'),
    new Provincia(12, 'LOAYZA'),
    new Provincia(13, 'LOS ANDES'),
    new Provincia(14, 'MANCO KAPAC'),
    new Provincia(15, 'MUÑECAS'),
    new Provincia(16, 'MURILLO'),
    new Provincia(17, 'NOR YUNGAS'),
    new Provincia(18, 'OMASUYOS'),
    new Provincia(19, 'PACAJES'),
    new Provincia(20, 'SUDYUNGAS')

  ]
}
