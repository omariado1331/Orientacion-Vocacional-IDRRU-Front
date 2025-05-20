import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MunicipioI } from '../interfaces/municipio-interface';
import { Municipio } from '../interfaces/municipio-interface';



@Injectable({
    providedIn: 'root'
})
export class MunicipioService {

    private mockMunicipios: MunicipioI[] = [
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

    getMunicipios(provinciaId?: number): Observable<MunicipioI[]> {

        let municipios = this.mockMunicipios;

        if (provinciaId !== undefined && provinciaId !== null) {
            municipios = municipios.filter(m => m.id_provincia === provinciaId);
        }

        return of(municipios);
    }


  municipios: Municipio[] = [
    new Municipio(1, 'Ixiamas', 'ABEL ITURRALDE'),
    new Municipio(2, 'San Buenaventura', 'ABEL ITURRALDE'),
    new Municipio( 2, 'Ayo Ayo', 'AROMA'),
    new Municipio( 3, 'Calamarca', 'AROMA'),
    new Municipio( 4, 'Collana', 'AROMA'),
    new Municipio( 5, 'Colquencha', 'AROMA'),
    new Municipio( 6, 'Patacamaya', 'AROMA'),
    new Municipio( 7, 'Sica Sica', 'AROMA'),
    new Municipio( 8, 'Umala', 'AROMA'),
    new Municipio( 9, 'Curva', 'BAUTISTA SAAVEDRA'),
    new Municipio( 10, 'General Juan José Pérez (Charazani)', 'BAUTISTA SAAVEDRA'),
    new Municipio( 11,'Escoma', 'CAMACHO'),
    new Municipio( 12,'Humanata', 'CAMACHO'),
    new Municipio( 13,'Mocomoco', 'CAMACHO'),
    new Municipio( 14,'Puerto Acosta', 'CAMACHO'),
    new Municipio( 15,'Puerto Carabuco', 'CAMACHO'),
    new Municipio( 16, 'Alto Beni', 'CARANAVI'),
    new Municipio( 17, 'Caranavi', 'CARANAVI'),
    new Municipio( 18, 'Apolo', 'FRANZ TAMAYO'),
    new Municipio( 19, 'Pelechuco', 'FRANZ TAMAYO'),
    new Municipio( 20, 'Chacarilla', 'GUALBERTO VILLAROEL'),
    new Municipio( 21, 'Papel Pampa', 'GUALBERTO VILLAROEL'),
    new Municipio( 22, 'San Pedro de Curahuara', 'GUALBERTO VILLAROEL'),
    new Municipio( 23, 'Desaguadero', 'INGAVI'),
    new Municipio( 24, 'Guaqui', 'INGAVI'),
    new Municipio( 25, 'Jesús de Machaca', 'INGAVI'),
    new Municipio( 26, 'San Andrés de Machaca', 'INGAVI'),
    new Municipio( 27, 'Taraco','INGAVI'),
    new Municipio( 28, 'Tiahuanaco', 'INGAVI'),
    new Municipio( 29, 'Viacha', 'INGAVI'),
    new Municipio( 30, 'Cajuata', 'INQUISIVO'),
    new Municipio( 31, 'Colquiri', 'INQUISIVO'),
    new Municipio( 32, 'Ichoca', 'INQUISIVO'),
    new Municipio( 33, 'Inquisivi', 'INQUISIVO'),
    new Municipio( 34, 'Licoma Pam', 'INQUISIVO'),
    new Municipio( 35, 'Quime', 'INQUISIVO'),
    new Municipio( 36, 'Catacora', 'JOSE MANUEL PANDO'),
    new Municipio( 37, 'Santiago de Machaca', 'JOSE MANUEL PANDO'),
    new Municipio( 38, 'Combaya', 'LARECAJA'),
    new Municipio( 39, 'Guanay', 'LARECAJA'),
    new Municipio( 40, 'Mapiri', 'LARECAJA'),
    new Municipio( 41, 'Quiabaya', 'LARECAJA'),
    new Municipio( 42, 'Sorata', 'LARECAJA'),
    new Municipio( 43, 'Tacacoma', 'LARECAJA'),
    new Municipio( 44, 'Tipuani', 'LARECAJA'),
    new Municipio( 45, 'Teoponte', 'LARECAJA'),
    new Municipio( 46, 'Cairoma', 'LOAYZA'),
    new Municipio( 47, 'Luribay', 'LOAYZA'),
    new Municipio( 48, 'Malla', 'LOAYZA'),
    new Municipio( 49, 'Sapahaqui', 'LOAYZA'),
    new Municipio( 50, 'Yaco', 'LOAYZA'),
    new Municipio( 51, 'Batallas', 'LOS ANDES'),
    new Municipio( 52, 'Laja', 'LOS ANDES'), 
    new Municipio( 53, 'Puerto Pérez', 'LOS ANDES'),
    new Municipio( 54, 'Pucarani', 'LOS ANDES'),
    new Municipio( 55, 'Copacabana', 'MANCO KAPAC'),
    new Municipio( 56, 'San Pedro de Tiquina', 'MANCO KAPAC'),
    new Municipio( 57, 'Tito Yupanqui', 'MANCO KAPAC'),
    new Municipio( 58, 'Aucapata', 'MUÑECAS'),
    new Municipio( 59, 'Ayata', 'MUÑECAS'),
    new Municipio( 60, 'Chuma', 'MUÑECAS'),
    new Municipio( 61, 'Achocalla', 'MURILLO'),
    new Municipio( 62, 'El Alto', 'MURILLO'),
    new Municipio( 63, 'La Paz', 'MURILLO'),
    new Municipio( 64, 'Mecapaca', 'MURILLO'),
    new Municipio( 65, 'Palca', 'MURILLO'),
    new Municipio( 66, 'Coroico', 'NOR YUNGAS'),
    new Municipio( 67, 'Coripata', 'NOR YUNGAS'),
    new Municipio( 68, 'Achacachi', 'OMASUYOS'),
    new Municipio( 69, 'Ancoraimes', 'OMASUYOS'),
    new Municipio( 70, 'Chua Cocani', 'OMASUYOS'),
    new Municipio( 71, 'Huarina', 'OMASUYOS'),
    new Municipio( 72, 'Huatajata', 'OMASUYOS'),
    new Municipio( 73, 'Santiago de Huata', 'OMASUYOS'),
    new Municipio( 74, 'Calacoto', 'PACAJES'),
    new Municipio( 75, 'Caquiaviri', 'PACAJES'),
    new Municipio( 76, 'Charaña', 'PACAJES'),
    new Municipio( 77, 'Comanche', 'PACAJES'),
    new Municipio( 78, 'Coro Coro', 'PACAJES'),
    new Municipio( 79, 'Nazacara de Pacajes', 'PACAJES'),
    new Municipio( 80, 'Santiago de Callapa', 'PACAJES'),
    new Municipio( 81, 'Waldo Ballivián', 'PACAJES'),
    new Municipio( 82, 'Chulumani','SUDYUNGAS'),
    new Municipio( 83, 'Irupana', 'SUDYUNGAS'),
    new Municipio( 84, 'La Asunta','SUDYUNGAS'),
    new Municipio( 85, 'Palos Blancos','SUDYUNGAS'),
    new Municipio( 86, 'Yanacachi','SUDYUNGAS')
  ]
}
