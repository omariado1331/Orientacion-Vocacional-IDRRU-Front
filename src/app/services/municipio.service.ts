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
  new Municipio(45, 'TEOPONTE', 11),
  new Municipio(46, 'TIPUANI', 11),
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
    new MunicipioN(1, 'IXIAMAS', 'ABEL ITURRALDE'),
    new MunicipioN(2, 'SAN BUENAVENTURA', 'ABEL ITURRALDE'),
    new MunicipioN(3, 'AYO AYO', 'AROMA'),
    new MunicipioN(4, 'CALAMARCA', 'AROMA'),
    new MunicipioN(5, 'COLLANA', 'AROMA'),
    new MunicipioN(6, 'COLQUENCHA', 'AROMA'),
    new MunicipioN(7, 'PATACAMAYA', 'AROMA'),
    new MunicipioN(8, 'SICA SICA', 'AROMA'),
    new MunicipioN(9, 'UMALA', 'AROMA'),
    new MunicipioN(10, 'CURVA', 'BAUTISTA SAAVEDRA'),
    new MunicipioN(11, 'GENERAL JUAN JOSÉ PÉREZ (CHARAZANI)', 'BAUTISTA SAAVEDRA'),
    new MunicipioN(12, 'ESCOMA', 'CAMACHO'),
    new MunicipioN(13, 'HUMANATA', 'CAMACHO'),
    new MunicipioN(14, 'MOMOCOCO', 'CAMACHO'),
    new MunicipioN(15, 'PUERTO ACOSTA', 'CAMACHO'),
    new MunicipioN(16, 'PUERTO CARABUCO', 'CAMACHO'),
    new MunicipioN(17, 'ALTO BENI', 'CARANAVI'),
    new MunicipioN(18, 'CARANAVI', 'CARANAVI'),
    new MunicipioN(19, 'APOLO', 'FRANZ TAMAYO'),
    new MunicipioN(20, 'PELECHUCO', 'FRANZ TAMAYO'),
    new MunicipioN(21, 'CHACARILLA', 'GUALBERTO VILLAROEL'),
    new MunicipioN(22, 'PAPEL PAMPA', 'GUALBERTO VILLAROEL'),
    new MunicipioN(23, 'SAN PEDRO DE CURAHUARA', 'GUALBERTO VILLAROEL'),
    new MunicipioN(24, 'DESAGUADERO', 'INGAVI'),
    new MunicipioN(25, 'GUAQUI', 'INGAVI'),
    new MunicipioN(26, 'JESÚS DE MACHACA', 'INGAVI'),
    new MunicipioN(27, 'SAN ANDRÉS DE MACHACA', 'INGAVI'),
    new MunicipioN(28, 'TARACO', 'INGAVI'),
    new MunicipioN(29, 'TIAHUANACO', 'INGAVI'),
    new MunicipioN(30, 'VIACHA', 'INGAVI'),
    new MunicipioN(31, 'CAJUATA', 'INQUISIVI'),
    new MunicipioN(32, 'COLQUIRI', 'INQUISIVI'),
    new MunicipioN(33, 'ICHOCA', 'INQUISIVI'),
    new MunicipioN(34, 'INQUISIVI', 'INQUISIVI'),
    new MunicipioN(35, 'LICOMA PAM', 'INQUISIVI'),
    new MunicipioN(36, 'QUIME', 'INQUISIVI'),
    new MunicipioN(37, 'CATACORA', 'JOSE MANUEL PANDO'),
    new MunicipioN(38, 'SANTIAGO DE MACHACA', 'JOSE MANUEL PANDO'),
    new MunicipioN(39, 'COMBAYA', 'LARECAJA'),
    new MunicipioN(40, 'GUANAY', 'LARECAJA'),
    new MunicipioN(41, 'MAPIRI', 'LARECAJA'),
    new MunicipioN(42, 'QUIABAYA', 'LARECAJA'),
    new MunicipioN(43, 'SORATA', 'LARECAJA'),
    new MunicipioN(44, 'TACACOMA', 'LARECAJA'),
    new MunicipioN(45, 'TIPUANI', 'LARECAJA'),
    new MunicipioN(46, 'TEOPONTE', 'LARECAJA'),
    new MunicipioN(47, 'CAIROMA', 'LOAYZA'),
    new MunicipioN(48, 'LURIBAY', 'LOAYZA'),
    new MunicipioN(49, 'MALLA', 'LOAYZA'),
    new MunicipioN(50, 'SAPAHAQUI', 'LOAYZA'),
    new MunicipioN(51, 'YACO', 'LOAYZA'),
    new MunicipioN(52, 'BATALLAS', 'LOS ANDES'),
    new MunicipioN(53, 'LAJA', 'LOS ANDES'),
    new MunicipioN(54, 'PUERTO PÉREZ', 'LOS ANDES'),
    new MunicipioN(55, 'PUCARANI', 'LOS ANDES'),
    new MunicipioN(56, 'COPACABANA', 'MANCO KAPAC'),
    new MunicipioN(57, 'SAN PEDRO DE TIQUINA', 'MANCO KAPAC'),
    new MunicipioN(58, 'TITO YUPANQUI', 'MANCO KAPAC'),
    new MunicipioN(59, 'AUCAPATA', 'MUÑECAS'),
    new MunicipioN(60, 'AYATA', 'MUÑECAS'),
    new MunicipioN(61, 'CHUMA', 'MUÑECAS'),
    new MunicipioN(62, 'ACHOCALLA', 'MURILLO'),
    new MunicipioN(63, 'LA PAZ', 'MURILLO'),
    new MunicipioN(64, 'EL ALTO', 'MURILLO'),
    new MunicipioN(65, 'MECAPACA', 'MURILLO'),
    new MunicipioN(66, 'PALCA', 'MURILLO'),
    new MunicipioN(67, 'COROICO', 'NOR YUNGAS'),
    new MunicipioN(68, 'CORIPATA', 'NOR YUNGAS'),
    new MunicipioN(69, 'ACHACACHI', 'OMASUYOS'),
    new MunicipioN(70, 'ANCORAIMES', 'OMASUYOS'),
    new MunicipioN(71, 'CHUA COCANI', 'OMASUYOS'),
    new MunicipioN(72, 'HUARINA', 'OMASUYOS'),
    new MunicipioN(73, 'HUATAJATA', 'OMASUYOS'),
    new MunicipioN(74, 'SANTIAGO DE HUATA', 'OMASUYOS'),
    new MunicipioN(75, 'CALACOTO', 'PACAJES'),
    new MunicipioN(76, 'CAQUIAVIRI', 'PACAJES'),
    new MunicipioN(77, 'CHARAÑA', 'PACAJES'),
    new MunicipioN(78, 'COMANCHE', 'PACAJES'),
    new MunicipioN(79, 'CORO CORO', 'PACAJES'),
    new MunicipioN(80, 'NAZACARA DE PACAJES', 'PACAJES'),
    new MunicipioN(81, 'SANTIAGO DE CALLAPA', 'PACAJES'),
    new MunicipioN(82, 'WALDO BALLIVIÁN', 'PACAJES'),
    new MunicipioN(83, 'CHULUMANI', 'SUD YUNGAS'),
    new MunicipioN(84, 'IRUPANA', 'SUD YUNGAS'),
    new MunicipioN(85, 'LA ASUNTA', 'SUD YUNGAS'),
    new MunicipioN(86, 'PALOS BLANCOS', 'SUD YUNGAS'),
    new MunicipioN(87, 'YANACACHI', 'SUD YUNGAS')
    ]
  
}
