import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface Municipio {
    id: number;
    nombre: string;
    id_provincia: number;
}

@Injectable({
    providedIn: 'root'
})
export class MunicipioService {

    private mockMunicipios: Municipio[] = [
        // ABEL ITURRALDE (id_provincia: 1)
        { id: 1, nombre: 'Ixiamas', id_provincia: 1 },
        { id: 2, nombre: 'San Buenaventura', id_provincia: 1 },
      
        // AROMA (id_provincia: 2)
        { id: 3, nombre: 'Ayo Ayo', id_provincia: 2 },
        { id: 4, nombre: 'Calamarca', id_provincia: 2 },
        { id: 5, nombre: 'Collana', id_provincia: 2 },
        { id: 6, nombre: 'Colquencha', id_provincia: 2 },
        { id: 7, nombre: 'Patacamaya', id_provincia: 2 },
        { id: 8, nombre: 'Sica Sica', id_provincia: 2 },
        { id: 9, nombre: 'Umala', id_provincia: 2 },
      
        // BAUTISTA SAAVEDRA (id_provincia: 3)
        { id: 10, nombre: 'Curva', id_provincia: 3 },
        { id: 11, nombre: 'General Juan José Pérez (Charazani)', id_provincia: 3 },
      
        // CAMACHO (id_provincia: 4)
        { id: 12, nombre: 'Escoma', id_provincia: 4 },
        { id: 13, nombre: 'Humanata', id_provincia: 4 },
        { id: 14, nombre: 'Mocomoco', id_provincia: 4 },
        { id: 15, nombre: 'Puerto Acosta', id_provincia: 4 },
        { id: 16, nombre: 'Puerto Carabuco', id_provincia: 4 },
      
        // CARANAVI (id_provincia: 5)
        { id: 17, nombre: 'Alto Beni', id_provincia: 5 },
        { id: 18, nombre: 'Caranavi', id_provincia: 5 },
      
        // FRANZ TAMAYO (id_provincia: 6)
        { id: 19, nombre: 'Apolo', id_provincia: 6 },
        { id: 20, nombre: 'Pelechuco', id_provincia: 6 },
      
        // GUALBERTO VILLAROEL (id_provincia: 7)
        { id: 21, nombre: 'Chacarilla', id_provincia: 7 },
        { id: 22, nombre: 'Papel Pampa', id_provincia: 7 },
        { id: 23, nombre: 'San Pedro de Curahuara', id_provincia: 7 },
      
        // INGAVI (id_provincia: 8)
        { id: 24, nombre: 'Desaguadero', id_provincia: 8 },
        { id: 25, nombre: 'Guaqui', id_provincia: 8 },
        { id: 26, nombre: 'Jesús de Machaca', id_provincia: 8 },
        { id: 27, nombre: 'San Andrés de Machaca', id_provincia: 8 },
        { id: 28, nombre: 'Taraco', id_provincia: 8 },
        { id: 29, nombre: 'Tiahuanaco', id_provincia: 8 },
        { id: 30, nombre: 'Viacha', id_provincia: 8 },
      
        // INQUISIVO (id_provincia: 9)
        { id: 31, nombre: 'Cajuata', id_provincia: 9 },
        { id: 32, nombre: 'Colquiri', id_provincia: 9 },
        { id: 33, nombre: 'Ichoca', id_provincia: 9 },
        { id: 34, nombre: 'Inquisivi', id_provincia: 9 },
        { id: 35, nombre: 'Licoma Pampa', id_provincia: 9 },
        { id: 36, nombre: 'Quime', id_provincia: 9 },
      
        // JOSE MANUEL PANDO (id_provincia: 10)
        { id: 37, nombre: 'Catacora', id_provincia: 10 },
        { id: 38, nombre: 'Santiago de Machaca', id_provincia: 10 },
      
        // LARECAJA (id_provincia: 11)
        { id: 39, nombre: 'Combaya', id_provincia: 11 },
        { id: 40, nombre: 'Guanay', id_provincia: 11 },
        { id: 41, nombre: 'Mapiri', id_provincia: 11 },
        { id: 42, nombre: 'Quiabaya', id_provincia: 11 },
        { id: 43, nombre: 'Sorata', id_provincia: 11 },
        { id: 44, nombre: 'Tacacoma', id_provincia: 11 },
        { id: 45, nombre: 'Teoponte', id_provincia: 11 },
        { id: 46, nombre: 'Tipuani', id_provincia: 11 },
      
        // LOAYZA (id_provincia: 12)
        { id: 47, nombre: 'Cairoma', id_provincia: 12 },
        { id: 48, nombre: 'Luribay', id_provincia: 12 },
        { id: 49, nombre: 'Malla', id_provincia: 12 },
        { id: 50, nombre: 'Sapahaqui', id_provincia: 12 },
        { id: 51, nombre: 'Yaco', id_provincia: 12 },
      
        // LOS ANDES (id_provincia: 13)
        { id: 52, nombre: 'Batallas', id_provincia: 13 },
        { id: 53, nombre: 'Laja', id_provincia: 13 },
        { id: 54, nombre: 'Puerto Pérez', id_provincia: 13 },
        { id: 55, nombre: 'Pucarani', id_provincia: 13 },
      
        // MANCO KAPAC (id_provincia: 14)
        { id: 56, nombre: 'Copacabana', id_provincia: 14 },
        { id: 57, nombre: 'San Pedro de Tiquina', id_provincia: 14 },
        { id: 58, nombre: 'Tito Yupanqui', id_provincia: 14 },
      
        // MUÑECAS (id_provincia: 15)
        { id: 59, nombre: 'Aucapata', id_provincia: 15 },
        { id: 60, nombre: 'Ayata', id_provincia: 15 },
        { id: 61, nombre: 'Chuma', id_provincia: 15 },
      
        // MURILLO (id_provincia: 16)
        { id: 62, nombre: 'Achocalla', id_provincia: 16 },
        { id: 63, nombre: 'El Alto', id_provincia: 16 },
        { id: 64, nombre: 'La Paz', id_provincia: 16 },
        { id: 65, nombre: 'Mecapaca', id_provincia: 16 },
        { id: 66, nombre: 'Palca', id_provincia: 16 },
      
        // NOR YUNGAS (id_provincia: 17)
        { id: 67, nombre: 'Coroico', id_provincia: 17 },
        { id: 68, nombre: 'Coripata', id_provincia: 17 },
      
        // OMASUYOS (id_provincia: 18)
        { id: 69, nombre: 'Achacachi', id_provincia: 18 },
        { id: 70, nombre: 'Ancoraimes', id_provincia: 18 },
        { id: 71, nombre: 'Chua Cocani', id_provincia: 18 },
        { id: 72, nombre: 'Huarina', id_provincia: 18 },
        { id: 73, nombre: 'Huatajata', id_provincia: 18 },
        { id: 74, nombre: 'Santiago de Huata', id_provincia: 18 },
      
        // PACAJES (id_provincia: 19)
        { id: 75, nombre: 'Calacoto', id_provincia: 19 },
        { id: 76, nombre: 'Caquiaviri', id_provincia: 19 },
        { id: 77, nombre: 'Charaña', id_provincia: 19 },
        { id: 78, nombre: 'Comanche', id_provincia: 19 },
        { id: 79, nombre: 'Coro Coro', id_provincia: 19 },
        { id: 80, nombre: 'Nazacara de Pacajes', id_provincia: 19 },
        { id: 81, nombre: 'Santiago de Callapa', id_provincia: 19 },
        { id: 82, nombre: 'Waldo Ballivián', id_provincia: 19 },
      
        // SUD YUNGAS (id_provincia: 20)
        { id: 83, nombre: 'Chulumani', id_provincia: 20 },
        { id: 84, nombre: 'Irupana', id_provincia: 20 },
        { id: 85, nombre: 'La Asunta', id_provincia: 20 },
        { id: 86, nombre: 'Palos Blancos', id_provincia: 20 },
        { id: 87, nombre: 'Yanacachi', id_provincia: 20 }
      ];
    constructor() { }

    getMunicipios(provinciaId?: number): Observable<Municipio[]> {

        let municipios = this.mockMunicipios;

        if (provinciaId !== undefined && provinciaId !== null) {
            municipios = municipios.filter(m => m.id_provincia === provinciaId);
        }

        return of(municipios);
    }
}