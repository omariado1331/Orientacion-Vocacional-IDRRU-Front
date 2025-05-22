// municipio.service.ts
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Municipio } from '../interfaces/municipio-interface';
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


  getById(id: number): Observable<Municipioi> {
    return this.http.get<Municipioi>(`${this.apiUrl}/${id}`);
  }

  municipios: Municipio[] = [
    new Municipio(1, 'Ixiamas', 'ABEL ITURRALDE'),
    new Municipio(2, 'San Buenaventura', 'ABEL ITURRALDE'),
    new Municipio(2, 'Ayo Ayo', 'AROMA'),
    new Municipio(3, 'Calamarca', 'AROMA'),
    new Municipio(4, 'Collana', 'AROMA'),
    new Municipio(5, 'Colquencha', 'AROMA'),
    new Municipio(6, 'Patacamaya', 'AROMA'),
    new Municipio(7, 'Sica Sica', 'AROMA'),
    new Municipio(8, 'Umala', 'AROMA'),
    new Municipio(9, 'Curva', 'BAUTISTA SAAVEDRA'),
    new Municipio(10, 'General Juan José Pérez (Charazani)', 'BAUTISTA SAAVEDRA'),
    new Municipio(11, 'Escoma', 'CAMACHO'),
    new Municipio(12, 'Humanata', 'CAMACHO'),
    new Municipio(13, 'Mocomoco', 'CAMACHO'),
    new Municipio(14, 'Puerto Acosta', 'CAMACHO'),
    new Municipio(15, 'Puerto Carabuco', 'CAMACHO'),
    new Municipio(16, 'Alto Beni', 'CARANAVI'),
    new Municipio(17, 'Caranavi', 'CARANAVI'),
    new Municipio(18, 'Apolo', 'FRANZ TAMAYO'),
    new Municipio(19, 'Pelechuco', 'FRANZ TAMAYO'),
    new Municipio(20, 'Chacarilla', 'GUALBERTO VILLAROEL'),
    new Municipio(21, 'Papel Pampa', 'GUALBERTO VILLAROEL'),
    new Municipio(22, 'San Pedro de Curahuara', 'GUALBERTO VILLAROEL'),
    new Municipio(23, 'Desaguadero', 'INGAVI'),
    new Municipio(24, 'Guaqui', 'INGAVI'),
    new Municipio(25, 'Jesús de Machaca', 'INGAVI'),
    new Municipio(26, 'San Andrés de Machaca', 'INGAVI'),
    new Municipio(27, 'Taraco', 'INGAVI'),
    new Municipio(28, 'Tiahuanaco', 'INGAVI'),
    new Municipio(29, 'Viacha', 'INGAVI'),
    new Municipio(30, 'Cajuata', 'INQUISIVO'),
    new Municipio(31, 'Colquiri', 'INQUISIVO'),
    new Municipio(32, 'Ichoca', 'INQUISIVO'),
    new Municipio(33, 'Inquisivi', 'INQUISIVO'),
    new Municipio(34, 'Licoma Pam', 'INQUISIVO'),
    new Municipio(35, 'Quime', 'INQUISIVO'),
    new Municipio(36, 'Catacora', 'JOSE MANUEL PANDO'),
    new Municipio(37, 'Santiago de Machaca', 'JOSE MANUEL PANDO'),
    new Municipio(38, 'Combaya', 'LARECAJA'),
    new Municipio(39, 'Guanay', 'LARECAJA'),
    new Municipio(40, 'Mapiri', 'LARECAJA'),
    new Municipio(41, 'Quiabaya', 'LARECAJA'),
    new Municipio(42, 'Sorata', 'LARECAJA'),
    new Municipio(43, 'Tacacoma', 'LARECAJA'),
    new Municipio(44, 'Tipuani', 'LARECAJA'),
    new Municipio(45, 'Teoponte', 'LARECAJA'),
    new Municipio(46, 'Cairoma', 'LOAYZA'),
    new Municipio(47, 'Luribay', 'LOAYZA'),
    new Municipio(48, 'Malla', 'LOAYZA'),
    new Municipio(49, 'Sapahaqui', 'LOAYZA'),
    new Municipio(50, 'Yaco', 'LOAYZA'),
    new Municipio(51, 'Batallas', 'LOS ANDES'),
    new Municipio(52, 'Laja', 'LOS ANDES'),
    new Municipio(53, 'Puerto Pérez', 'LOS ANDES'),
    new Municipio(54, 'Pucarani', 'LOS ANDES'),
    new Municipio(55, 'Copacabana', 'MANCO KAPAC'),
    new Municipio(56, 'San Pedro de Tiquina', 'MANCO KAPAC'),
    new Municipio(57, 'Tito Yupanqui', 'MANCO KAPAC'),
    new Municipio(58, 'Aucapata', 'MUÑECAS'),
    new Municipio(59, 'Ayata', 'MUÑECAS'),
    new Municipio(60, 'Chuma', 'MUÑECAS'),
    new Municipio(61, 'Achocalla', 'MURILLO'),
    new Municipio(62, 'El Alto', 'MURILLO'),
    new Municipio(63, 'La Paz', 'MURILLO'),
    new Municipio(64, 'Mecapaca', 'MURILLO'),
    new Municipio(65, 'Palca', 'MURILLO'),
    new Municipio(66, 'Coroico', 'NOR YUNGAS'),
    new Municipio(67, 'Coripata', 'NOR YUNGAS'),
    new Municipio(68, 'Achacachi', 'OMASUYOS'),
    new Municipio(69, 'Ancoraimes', 'OMASUYOS'),
    new Municipio(70, 'Chua Cocani', 'OMASUYOS'),
    new Municipio(71, 'Huarina', 'OMASUYOS'),
    new Municipio(72, 'Huatajata', 'OMASUYOS'),
    new Municipio(73, 'Santiago de Huata', 'OMASUYOS'),
    new Municipio(74, 'Calacoto', 'PACAJES'),
    new Municipio(75, 'Caquiaviri', 'PACAJES'),
    new Municipio(76, 'Charaña', 'PACAJES'),
    new Municipio(77, 'Comanche', 'PACAJES'),
    new Municipio(78, 'Coro Coro', 'PACAJES'),
    new Municipio(79, 'Nazacara de Pacajes', 'PACAJES'),
    new Municipio(80, 'Santiago de Callapa', 'PACAJES'),
    new Municipio(81, 'Waldo Ballivián', 'PACAJES'),
    new Municipio(82, 'Chulumani', 'SUDYUNGAS'),
    new Municipio(83, 'Irupana', 'SUDYUNGAS'),
    new Municipio(84, 'La Asunta', 'SUDYUNGAS'),
    new Municipio(85, 'Palos Blancos', 'SUDYUNGAS'),
    new Municipio(86, 'Yanacachi', 'SUDYUNGAS')
  ]
}
