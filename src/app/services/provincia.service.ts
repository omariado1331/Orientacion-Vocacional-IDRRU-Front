import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface Provincia {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {

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

  constructor() { }

  getProvincias(): Observable<Provincia[]> {
    return of(this.mockProvincias);
  }
}
