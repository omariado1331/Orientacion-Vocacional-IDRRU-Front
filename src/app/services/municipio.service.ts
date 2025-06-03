// municipio.service.ts
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Municipio, MunicipioN } from '../interfaces/municipio-interface';
import { Municipioi } from '../interfaces/municipio-interface';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MunicipioService {
  private apiUrl = `${environment.apiUrl}/municipio`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Municipioi[]> {
    return this.http.get<Municipioi[]>(`${this.apiUrl}`);
  }

  getAllMunicipios(): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(this.apiUrl);
  }

  getMunicipiosPorProvinciaList(idProvincia: number): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(`${this.apiUrl}/provincia/${idProvincia}`);
  }



  getById(id: number): Observable<Municipioi> {
    return this.http.get<Municipioi>(`${this.apiUrl}/${id}`);
  }

municipios: Municipio[] = [
  new Municipio(1, 'IXIAMAS', 1),
  new Municipio(2, 'SAN BUENAVENTURA', 1),
  new Municipio(3, 'AYO AYO', 2),
  new Municipio(4, 'CALAMARCA', 2),
  new Municipio(5, 'COLLANA', 2),
  new Municipio(6, 'COLQUENCHA', 2),
  new Municipio(7, 'PATACAMAYA', 2),
  new Municipio(8, 'SICA SICA', 2),
  new Municipio(9, 'UMALA', 2),
  new Municipio(10, 'CURVA', 3),
  new Municipio(11, 'GENERAL JUAN JOSÉ PÉREZ (CHARAZANI)', 3),
  new Municipio(12, 'ESCOMA', 4),
  new Municipio(13, 'HUMANATA', 4),
  new Municipio(14, 'MOCOMOCO', 4),
  new Municipio(15, 'PUERTO ACOSTA', 4),
  new Municipio(16, 'PUERTO CARABUCO', 4),
  new Municipio(17, 'ALTO BENI', 5),
  new Municipio(18, 'CARANAVI', 5),
  new Municipio(19, 'APOLO', 6),
  new Municipio(20, 'PELECHUCO', 6),
  new Municipio(21, 'CHACARILLA', 7),
  new Municipio(22, 'PAPEL PAMPA', 7),
  new Municipio(23, 'SAN PEDRO DE CURAHUARA', 7),
  new Municipio(24, 'DESAGUADERO', 8),
  new Municipio(25, 'GUAQUI', 8),
  new Municipio(26, 'JESÚS DE MACHACA', 8),
  new Municipio(27, 'SAN ANDRÉS DE MACHACA', 8),
  new Municipio(28, 'TARACO', 8),
  new Municipio(29, 'TIAHUANACO', 8),
  new Municipio(30, 'VIACHA', 8),
  new Municipio(31, 'CAJUATA', 9),
  new Municipio(32, 'COLQUIRI', 9),
  new Municipio(33, 'ICHOCA', 9),
  new Municipio(34, 'INQUISIVI', 9),
  new Municipio(35, 'LICOMA PAM', 9),
  new Municipio(36, 'QUIME', 9),
  new Municipio(37, 'CATACORA', 10),
  new Municipio(38, 'SANTIAGO DE MACHACA', 10),
  new Municipio(39, 'COMBAYA', 11),
  new Municipio(40, 'GUANAY', 11),
  new Municipio(41, 'MAPIRI', 11),
  new Municipio(42, 'QUIABAYA', 11),
  new Municipio(43, 'SORATA', 11),
  new Municipio(44, 'TACACOMA', 11),
  new Municipio(45, 'TIPUANI', 11),
  new Municipio(46, 'TEOPONTE', 11),
  new Municipio(47, 'CAIROMA', 12),
  new Municipio(48, 'LURIBAY', 12),
  new Municipio(49, 'MALLA', 12),
  new Municipio(50, 'SAPAHAQUI', 12),
  new Municipio(51, 'YACO', 12),
  new Municipio(52, 'BATALLAS', 13),
  new Municipio(53, 'LAJA', 13),
  new Municipio(54, 'PUERTO PÉREZ', 13),
  new Municipio(55, 'PUCARANI', 13),
  new Municipio(56, 'COPACABANA', 14),
  new Municipio(57, 'SAN PEDRO DE TIQUINA', 14),
  new Municipio(58, 'TITO YUPANQUI', 14),
  new Municipio(59, 'AUCAPATA', 15),
  new Municipio(60, 'AYATA', 15),
  new Municipio(61, 'CHUMA', 15),
  new Municipio(62, 'ACHOCALLA', 16),
  new Municipio(63, 'EL ALTO', 16),
  new Municipio(64, 'LA PAZ', 16),
  new Municipio(65, 'MECAPACA', 16),
  new Municipio(66, 'PALCA', 16),
  new Municipio(67, 'COROICO', 17),
  new Municipio(68, 'CORIPATA', 17),
  new Municipio(69, 'ACHACACHI', 18),
  new Municipio(70, 'ANCORAIMES', 18),
  new Municipio(71, 'CHUA COCANI', 18),
  new Municipio(72, 'HUARINA', 18),
  new Municipio(73, 'HUATAJATA', 18),
  new Municipio(74, 'SANTIAGO DE HUATA', 18),
  new Municipio(75, 'CALACOTO', 19),
  new Municipio(76, 'CAQUIAVIRI', 19),
  new Municipio(77, 'CHARAÑA', 19),
  new Municipio(78, 'COMANCHE', 19),
  new Municipio(79, 'CORO CORO', 19),
  new Municipio(80, 'NAZACARA DE PACAJES', 19),
  new Municipio(81, 'SANTIAGO DE CALLAPA', 19),
  new Municipio(82, 'WALDO BALLIVIÁN', 19),
  new Municipio(83, 'CHULUMANI', 20),
  new Municipio(84, 'IRUPANA', 20),
  new Municipio(85, 'LA ASUNTA', 20),
  new Municipio(86, 'PALOS BLANCOS', 20),
  new Municipio(87, 'YANACACHI', 20)
]

getMunicipiosPorProvincia(idProvincia: number): string[] {
  return this.municipios
    .filter(m => m.idProvincia === idProvincia)
    .map(m => m.nombre);
}

  municipiosN: MunicipioN[] = [
    new MunicipioN(1, 'Ixiamas', 'ABEL ITURRALDE'),
    new MunicipioN(2, 'San Buenaventura', 'ABEL ITURRALDE'),
    new MunicipioN(2, 'Ayo Ayo', 'AROMA'),
    new MunicipioN(3, 'Calamarca', 'AROMA'),
    new MunicipioN(4, 'Collana', 'AROMA'),
    new MunicipioN(5, 'Colquencha', 'AROMA'),
    new MunicipioN(6, 'Patacamaya', 'AROMA'),
    new MunicipioN(7, 'Sica Sica', 'AROMA'),
    new MunicipioN(8, 'Umala', 'AROMA'),
    new MunicipioN(9, 'Curva', 'BAUTISTA SAAVEDRA'),
    new MunicipioN(10, 'General Juan José Pérez (Charazani)', 'BAUTISTA SAAVEDRA'),
    new MunicipioN(11, 'Escoma', 'CAMACHO'),
    new MunicipioN(12, 'Humanata', 'CAMACHO'),
    new MunicipioN(13, 'Mocomoco', 'CAMACHO'),
    new MunicipioN(14, 'Puerto Acosta', 'CAMACHO'),
    new MunicipioN(15, 'Puerto Carabuco', 'CAMACHO'),
    new MunicipioN(16, 'Alto Beni', 'CARANAVI'),
    new MunicipioN(17, 'Caranavi', 'CARANAVI'),
    new MunicipioN(18, 'Apolo', 'FRANZ TAMAYO'),
    new MunicipioN(19, 'Pelechuco', 'FRANZ TAMAYO'),
    new MunicipioN(20, 'Chacarilla', 'GUALBERTO VILLAROEL'),
    new MunicipioN(21, 'Papel Pampa', 'GUALBERTO VILLAROEL'),
    new MunicipioN(22, 'San Pedro de Curahuara', 'GUALBERTO VILLAROEL'),
    new MunicipioN(23, 'Desaguadero', 'INGAVI'),
    new MunicipioN(24, 'Guaqui', 'INGAVI'),
    new MunicipioN(25, 'Jesús de Machaca', 'INGAVI'),
    new MunicipioN(26, 'San Andrés de Machaca', 'INGAVI'),
    new MunicipioN(27, 'Taraco', 'INGAVI'),
    new MunicipioN(28, 'Tiahuanaco', 'INGAVI'),
    new MunicipioN(29, 'Viacha', 'INGAVI'),
    new MunicipioN(30, 'Cajuata', 'INQUISIVO'),
    new MunicipioN(31, 'Colquiri', 'INQUISIVO'),
    new MunicipioN(32, 'Ichoca', 'INQUISIVO'),
    new MunicipioN(33, 'Inquisivi', 'INQUISIVO'),
    new MunicipioN(34, 'Licoma Pam', 'INQUISIVO'),
    new MunicipioN(35, 'Quime', 'INQUISIVO'),
    new MunicipioN(36, 'Catacora', 'JOSE MANUEL PANDO'),
    new MunicipioN(37, 'Santiago de Machaca', 'JOSE MANUEL PANDO'),
    new MunicipioN(38, 'Combaya', 'LARECAJA'),
    new MunicipioN(39, 'Guanay', 'LARECAJA'),
    new MunicipioN(40, 'Mapiri', 'LARECAJA'),
    new MunicipioN(41, 'Quiabaya', 'LARECAJA'),
    new MunicipioN(42, 'Sorata', 'LARECAJA'),
    new MunicipioN(43, 'Tacacoma', 'LARECAJA'),
    new MunicipioN(44, 'Tipuani', 'LARECAJA'),
    new MunicipioN(45, 'Teoponte', 'LARECAJA'),
    new MunicipioN(46, 'Cairoma', 'LOAYZA'),
    new MunicipioN(47, 'Luribay', 'LOAYZA'),
    new MunicipioN(48, 'Malla', 'LOAYZA'),
    new MunicipioN(49, 'Sapahaqui', 'LOAYZA'),
    new MunicipioN(50, 'Yaco', 'LOAYZA'),
    new MunicipioN(51, 'Batallas', 'LOS ANDES'),
    new MunicipioN(52, 'Laja', 'LOS ANDES'),
    new MunicipioN(53, 'Puerto Pérez', 'LOS ANDES'),
    new MunicipioN(54, 'Pucarani', 'LOS ANDES'),
    new MunicipioN(55, 'Copacabana', 'MANCO KAPAC'),
    new MunicipioN(56, 'San Pedro de Tiquina', 'MANCO KAPAC'),
    new MunicipioN(57, 'Tito Yupanqui', 'MANCO KAPAC'),
    new MunicipioN(58, 'Aucapata', 'MUÑECAS'),
    new MunicipioN(59, 'Ayata', 'MUÑECAS'),
    new MunicipioN(60, 'Chuma', 'MUÑECAS'),
    new MunicipioN(61, 'Achocalla', 'MURILLO'),
    new MunicipioN(62, 'El Alto', 'MURILLO'),
    new MunicipioN(63, 'La Paz', 'MURILLO'),
    new MunicipioN(64, 'Mecapaca', 'MURILLO'),
    new MunicipioN(65, 'Palca', 'MURILLO'),
    new MunicipioN(66, 'Coroico', 'NOR YUNGAS'),
    new MunicipioN(67, 'Coripata', 'NOR YUNGAS'),
    new MunicipioN(68, 'Achacachi', 'OMASUYOS'),
    new MunicipioN(69, 'Ancoraimes', 'OMASUYOS'),
    new MunicipioN(70, 'Chua Cocani', 'OMASUYOS'),
    new MunicipioN(71, 'Huarina', 'OMASUYOS'),
    new MunicipioN(72, 'Huatajata', 'OMASUYOS'),
    new MunicipioN(73, 'Santiago de Huata', 'OMASUYOS'),
    new MunicipioN(74, 'Calacoto', 'PACAJES'),
    new MunicipioN(75, 'Caquiaviri', 'PACAJES'),
    new MunicipioN(76, 'Charaña', 'PACAJES'),
    new MunicipioN(77, 'Comanche', 'PACAJES'),
    new MunicipioN(78, 'Coro Coro', 'PACAJES'),
    new MunicipioN(79, 'Nazacara de Pacajes', 'PACAJES'),
    new MunicipioN(80, 'Santiago de Callapa', 'PACAJES'),
    new MunicipioN(81, 'Waldo Ballivián', 'PACAJES'),
    new MunicipioN(82, 'Chulumani', 'SUDYUNGAS'),
    new MunicipioN(83, 'Irupana', 'SUDYUNGAS'),
    new MunicipioN(84, 'La Asunta', 'SUDYUNGAS'),
    new MunicipioN(85, 'Palos Blancos', 'SUDYUNGAS'),
    new MunicipioN(86, 'Yanacachi', 'SUDYUNGAS')
  ]
}
