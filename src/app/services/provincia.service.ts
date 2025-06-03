import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Provincia } from '../interfaces/provincia-interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ProvinciaService {


  private baseUrl = 'http://localhost:8080/provincia';

  constructor(private http: HttpClient) {}

  getProvinciasList(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(this.baseUrl);
  }



  private mockProvincias: Provincia[] = [
    { id: 1, nombre: 'ABEL ITURRALDE' },
    { id: 2, nombre: 'AROMA' },
    { id: 3, nombre: 'BAUTISTA SAAVEDRA' },
    { id: 4, nombre: 'CAMACHO' },
    { id: 5, nombre: 'CARANAVI' },
    { id: 6, nombre: 'FRANZ TAMAYO' },
    { id: 7, nombre: 'GUALBERTO VILLAROEL' },
    { id: 8, nombre: 'INGAVI' },
    { id: 9, nombre: 'INQUISIVO' },
    { id: 10, nombre: 'JOSE MANUEL PANDO' },
    { id: 11, nombre: 'LARECAJA' },
    { id: 12, nombre: 'LOAYZA' },
    { id: 13, nombre: 'LOS ANDES' },
    { id: 14, nombre: 'MANCO KAPAC' },
    { id: 15, nombre: 'MUÑECAS' },
    { id: 16, nombre: 'MURILLO' },
    { id: 17, nombre: 'NOR YUNGAS' },
    { id: 18, nombre: 'OMASUYOS' },
    { id: 19, nombre: 'PACAJES' },
    { id: 20, nombre: 'SUDYUNGAS' }
  ];


  getProvincias(): Observable<Provincia[]> {
    return of(this.mockProvincias);
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
