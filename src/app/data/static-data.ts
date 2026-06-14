import { Provincia } from '../interfaces/provincia-interface';
import { Municipio } from '../interfaces/municipio-interface';
import { Chaside } from '../interfaces/chaside-interface';
import { Holland } from '../interfaces/holland-interface';

export const PROVINCIAS_OFFLINE: Provincia[] = [
  { idProvincia: 1, nombre: 'ABEL ITURRALDE' },
  { idProvincia: 2, nombre: 'AROMA' },
  { idProvincia: 3, nombre: 'BAUTISTA SAAVEDRA' },
  { idProvincia: 4, nombre: 'CAMACHO' },
  { idProvincia: 5, nombre: 'CARANAVI' },
  { idProvincia: 6, nombre: 'FRANZ TAMAYO' },
  { idProvincia: 7, nombre: 'GUALBERTO VILLARROEL' },
  { idProvincia: 8, nombre: 'INGAVI' },
  { idProvincia: 9, nombre: 'INQUISIVI' },
  { idProvincia: 10, nombre: 'JOSÉ MANUEL PANDO' },
  { idProvincia: 11, nombre: 'LARECAJA' },
  { idProvincia: 12, nombre: 'LOAYZA' },
  { idProvincia: 13, nombre: 'LOS ANDES' },
  { idProvincia: 14, nombre: 'MANCO KAPAC' },
  { idProvincia: 15, nombre: 'MUÑECAS' },
  { idProvincia: 16, nombre: 'MURILLO' },
  { idProvincia: 17, nombre: 'NOR YUNGAS' },
  { idProvincia: 18, nombre: 'OMASUYOS' },
  { idProvincia: 19, nombre: 'PACAJES' },
  { idProvincia: 20, nombre: 'SUD YUNGAS' }
];

export const MUNICIPIOS_OFFLINE: Municipio[] = [
  { idMunicipio: 1, nombre: 'IXIAMAS', idProvincia: 1 },
  { idMunicipio: 2, nombre: 'SAN BUENAVENTURA', idProvincia: 1 },
  { idMunicipio: 3, nombre: 'AYO AYO', idProvincia: 2 },
  { idMunicipio: 4, nombre: 'CALAMARCA', idProvincia: 2 },
  { idMunicipio: 5, nombre: 'COLLANA', idProvincia: 2 },
  { idMunicipio: 6, nombre: 'COLQUENCHA', idProvincia: 2 },
  { idMunicipio: 7, nombre: 'PATACAMAYA', idProvincia: 2 },
  { idMunicipio: 8, nombre: 'SICA SICA', idProvincia: 2 },
  { idMunicipio: 9, nombre: 'UMALA', idProvincia: 2 },
  { idMunicipio: 10, nombre: 'CURVA', idProvincia: 3 },
  { idMunicipio: 11, nombre: 'CHARAZANI', idProvincia: 3 },
  { idMunicipio: 12, nombre: 'ESCOMA', idProvincia: 4 },
  { idMunicipio: 13, nombre: 'HUMANATA', idProvincia: 4 },
  { idMunicipio: 14, nombre: 'MOCOMOCO', idProvincia: 4 },
  { idMunicipio: 15, nombre: 'PUERTO ACOSTA', idProvincia: 4 },
  { idMunicipio: 16, nombre: 'PUERTO CARABUCO', idProvincia: 4 },
  { idMunicipio: 17, nombre: 'ALTO BENI', idProvincia: 5 },
  { idMunicipio: 18, nombre: 'CARANAVI', idProvincia: 5 },
  { idMunicipio: 19, nombre: 'APOLO', idProvincia: 6 },
  { idMunicipio: 20, nombre: 'PELECHUCO', idProvincia: 6 },
  { idMunicipio: 21, nombre: 'CHACARILLA', idProvincia: 7 },
  { idMunicipio: 22, nombre: 'PAPEL PAMPA', idProvincia: 7 },
  { idMunicipio: 23, nombre: 'SAN PEDRO DE CURAHUARA', idProvincia: 7 },
  { idMunicipio: 24, nombre: 'DESAGUADERO', idProvincia: 8 },
  { idMunicipio: 25, nombre: 'GUAQUI', idProvincia: 8 },
  { idMunicipio: 26, nombre: 'JESÚS DE MACHACA', idProvincia: 8 },
  { idMunicipio: 27, nombre: 'SAN ANDRÉS DE MACHACA', idProvincia: 8 },
  { idMunicipio: 28, nombre: 'TARACO', idProvincia: 8 },
  { idMunicipio: 29, nombre: 'TIAHUANACO', idProvincia: 8 },
  { idMunicipio: 30, nombre: 'VIACHA', idProvincia: 8 },
  { idMunicipio: 31, nombre: 'CAJUATA', idProvincia: 9 },
  { idMunicipio: 32, nombre: 'COLQUIRI', idProvincia: 9 },
  { idMunicipio: 33, nombre: 'ICHOCA', idProvincia: 9 },
  { idMunicipio: 34, nombre: 'INQUISIVI', idProvincia: 9 },
  { idMunicipio: 35, nombre: 'LICOMA PAMPA', idProvincia: 9 },
  { idMunicipio: 36, nombre: 'QUIME', idProvincia: 9 },
  { idMunicipio: 37, nombre: 'CATACORA', idProvincia: 10 },
  { idMunicipio: 38, nombre: 'SANTIAGO DE MACHACA', idProvincia: 10 },
  { idMunicipio: 39, nombre: 'COMBAYA', idProvincia: 11 },
  { idMunicipio: 40, nombre: 'GUANAY', idProvincia: 11 },
  { idMunicipio: 41, nombre: 'MAPIRI', idProvincia: 11 },
  { idMunicipio: 42, nombre: 'QUIABAYA', idProvincia: 11 },
  { idMunicipio: 43, nombre: 'SORATA', idProvincia: 11 },
  { idMunicipio: 44, nombre: 'TACACOMA', idProvincia: 11 },
  { idMunicipio: 45, nombre: 'TEOPONTE', idProvincia: 11 },
  { idMunicipio: 46, nombre: 'TIPUANI', idProvincia: 11 },
  { idMunicipio: 47, nombre: 'CAIROMA', idProvincia: 12 },
  { idMunicipio: 48, nombre: 'LURIBAY', idProvincia: 12 },
  { idMunicipio: 49, nombre: 'MALLA', idProvincia: 12 },
  { idMunicipio: 50, nombre: 'SAPAHAQUI', idProvincia: 12 },
  { idMunicipio: 51, nombre: 'YACO', idProvincia: 12 },
  { idMunicipio: 52, nombre: 'BATALLAS', idProvincia: 13 },
  { idMunicipio: 53, nombre: 'LAJA', idProvincia: 13 },
  { idMunicipio: 54, nombre: 'PUERTO PÉREZ', idProvincia: 13 },
  { idMunicipio: 55, nombre: 'PUCARANI', idProvincia: 13 },
  { idMunicipio: 56, nombre: 'COPACABANA', idProvincia: 14 },
  { idMunicipio: 57, nombre: 'SAN PEDRO DE TIQUINA', idProvincia: 14 },
  { idMunicipio: 58, nombre: 'TITO YUPANQUI', idProvincia: 14 },
  { idMunicipio: 59, nombre: 'AUCAPATA', idProvincia: 15 },
  { idMunicipio: 60, nombre: 'AYATA', idProvincia: 15 },
  { idMunicipio: 61, nombre: 'CHUMA', idProvincia: 15 },
  { idMunicipio: 62, nombre: 'ACHOCALLA', idProvincia: 16 },
  { idMunicipio: 63, nombre: 'EL ALTO', idProvincia: 16 },
  { idMunicipio: 64, nombre: 'LA PAZ', idProvincia: 16 },
  { idMunicipio: 65, nombre: 'MECAPACA', idProvincia: 16 },
  { idMunicipio: 66, nombre: 'PALCA', idProvincia: 16 },
  { idMunicipio: 67, nombre: 'COROICO', idProvincia: 17 },
  { idMunicipio: 68, nombre: 'CORIPATA', idProvincia: 17 },
  { idMunicipio: 69, nombre: 'ACHACACHI', idProvincia: 18 },
  { idMunicipio: 70, nombre: 'ANCORAIMES', idProvincia: 18 },
  { idMunicipio: 71, nombre: 'CHUA COCANI', idProvincia: 18 },
  { idMunicipio: 72, nombre: 'HUARINA', idProvincia: 18 },
  { idMunicipio: 73, nombre: 'HUATAJATA', idProvincia: 18 },
  { idMunicipio: 74, nombre: 'SANTIAGO DE HUATA', idProvincia: 18 },
  { idMunicipio: 75, nombre: 'CALACOTO', idProvincia: 19 },
  { idMunicipio: 76, nombre: 'CAQUIAVIRI', idProvincia: 19 },
  { idMunicipio: 77, nombre: 'CHARAÑA', idProvincia: 19 },
  { idMunicipio: 78, nombre: 'COMANCHE', idProvincia: 19 },
  { idMunicipio: 79, nombre: 'COROCORO', idProvincia: 19 },
  { idMunicipio: 80, nombre: 'NAZACARA DE PACAJES', idProvincia: 19 },
  { idMunicipio: 81, nombre: 'SANTIAGO DE CALLAPA', idProvincia: 19 },
  { idMunicipio: 82, nombre: 'WALDO BALLIVIÁN', idProvincia: 19 },
  { idMunicipio: 83, nombre: 'CHULUMANI', idProvincia: 20 },
  { idMunicipio: 84, nombre: 'IRUPANA', idProvincia: 20 },
  { idMunicipio: 85, nombre: 'LA ASUNTA', idProvincia: 20 },
  { idMunicipio: 86, nombre: 'PALOS BLANCOS', idProvincia: 20 },
  { idMunicipio: 87, nombre: 'YANACACHI', idProvincia: 20 }
];

export const CHASIDE_OFFLINE: Chaside[] = [
  { idChaside: 1, codigo: 'C', descripcion: 'Administrativas y Contables', puntaje: 'C'},
  { idChaside: 2, codigo: 'H', descripcion: 'Humanísticas y Sociales', puntaje: 'H'},
  { idChaside: 3, codigo: 'A', descripcion: 'Artísticas', puntaje: 'A'},
  { idChaside: 4, codigo: 'S', descripcion: 'Medicina y Ciencias de la Salud', puntaje: 'S' },
  { idChaside: 5, codigo: 'I', descripcion: 'Ingeniería y Computación', puntaje: 'I' },
  { idChaside: 6, codigo: 'D', descripcion: 'Defensa y Seguridad', puntaje: 'D' },
  { idChaside: 7, codigo: 'E', descripcion: 'Ciencias Exactas y Agrarias', puntaje: 'E' }
];

export const HOLLAND_OFFLINE: Holland[] = [
  { idHolland: 1, nombre: 'Realista', descripcion: 'Prefieren trabajar con objetos, máquinas, herramientas, plantas o animales.', codigo: 'R' },
  { idHolland: 2, nombre: 'Investigador', descripcion: 'Prefieren observar, aprender, investigar, analizar y resolver problemas.', codigo: 'I'},
  { idHolland: 3, nombre: 'Artístico', descripcion: 'Prefieren trabajar en situaciones no estructuradas usando su imaginación y creatividad.', codigo: 'A' },
  { idHolland: 4, nombre: 'Social', descripcion: 'Prefieren trabajar con personas para informar, enseñar, curar o ayudar.', codigo: 'S' },
  { idHolland: 5, nombre: 'Emprendedor', descripcion: 'Prefieren trabajar con personas, influir, persuadir y dirigir.', codigo: 'E' },
  { idHolland: 6, nombre: 'Convencional', descripcion: 'Prefieren trabajar con datos, procesar información y seguir instrucciones detalladas.', codigo: 'C'}
];

export interface FacultadOffline {
  idFacultad: number;
  nombre: string;
  codigo: string;
  idChaside: number;
  url: string;
  imgLogo: string;
  carreras: string;
}

export const FACULTADES_OFFLINE: FacultadOffline[] = [
  {
    idFacultad: 1,
    nombre: 'Facultad de Agronomia',
    codigo: 'FA',
    idChaside: 7,
    url: 'http://agro.umsa.bo/',
    imgLogo: 'assets/logos-facultades/FA.png',
    carreras: '["Ingenieria Agronomica", "Ingenieria en Produccion y Comercializacion Agropecuaria", "Programa Medicina Veterinaria y Zootecnia"]'
  },
  {
    idFacultad: 2,
    nombre: 'Facultad de Arquitectura, Artes, Diseno y Urbanismo',
    codigo: 'FAADU',
    idChaside: 3,
    url: 'http://faadu.umsa.bo/',
    imgLogo: 'assets/logos-facultades/FAADU.png',
    carreras: '["Arquitectura", "Artes Plasticas", "Diseno Grafico", "Prog. Arquitectura para la Amazonia"]'
  },
  {
    idFacultad: 3,
    nombre: 'Facultad de Ciencias Economicas y Financieras',
    codigo: 'FCEF',
    idChaside: 1,
    url: 'https://fcef.umsa.bo/',
    imgLogo: 'assets/logos-facultades/FCEF.png',
    carreras: '["Administracion de Empresas", "Contaduria Publica", "Economia"]'
  },
  {
    idFacultad: 4,
    nombre: 'Facultad de Ciencias Farmaceuticas y Bioquimicas',
    codigo: 'FCFB',
    idChaside: 4,
    url: 'http://www.farbio.edu.bo/',
    imgLogo: 'assets/logos-facultades/FCFB.png',
    carreras: '["Bioquimica", "Quimica Farmaceutica"]'
  },
  {
    idFacultad: 5,
    nombre: 'Facultad de Ciencias Geologicas',
    codigo: 'FCG',
    idChaside: 5,
    url: 'http://fcg.umsa.bo/',
    imgLogo: 'assets/logos-facultades/FCG.png',
    carreras: '["Ingenieria Geografica", "Ingenieria Geologica", "Programa Catastro y Ordenamiento Territorial", "Programa Geologia de Minas"]'
  },
  {
    idFacultad: 6,
    nombre: 'Facultad de Ciencias Puras y Naturales',
    codigo: 'FCPN',
    idChaside: 5,
    url: 'http://www.fcpn.edu.bo/fcpn/',
    imgLogo: 'assets/logos-facultades/FCPN.png',
    carreras: '["Biologia", "Ciencias Quimicas", "Estadistica", "Fisica", "Informatica", "Matematica"]'
  },
  {
    idFacultad: 7,
    nombre: 'Facultad de Ciencias Sociales',
    codigo: 'FCS',
    idChaside: 2,
    url: 'http://fcs.umsa.bo/',
    imgLogo: 'assets/logos-facultades/FCS.png',
    carreras: '["Antropologia y Arqueologia", "Ciencias de la Comunicacion Social", "Sociologia", "Trabajo Social"]'
  },
  {
    idFacultad: 8,
    nombre: 'Facultad de Derecho y Ciencias Politicas',
    codigo: 'FDCP',
    idChaside: 2,
    url: 'http://www.fdcp.umsa.bo/',
    imgLogo: 'assets/logos-facultades/FDCP.png',
    carreras: '["Derecho", "Ciencias Politicas y Gestion Publica", "Programa Derecho de las Naciones Originarias"]'
  },
  {
    idFacultad: 9,
    nombre: 'Facultad de Humanidades y Ciencias de la Educacion',
    codigo: 'FHCE',
    idChaside: 2,
    url: 'https://fhce.umsa.bo/',
    imgLogo: 'assets/logos-facultades/FHCE.png',
    carreras: '["Ciencias de la Informacion, Archivologia - Bibliotecologia - Documentacion - Museologia", "Ciencias de la Educacion", "Filosofia", "Historia", "Linguistica e Idiomas", "Literatura", "Psicologia", "Turismo"]'
  },
  {
    idFacultad: 10,
    nombre: 'Facultad de Ingenieria',
    codigo: 'FI',
    idChaside: 5,
    url: 'http://200.87.114.154/ffing/index.php',
    imgLogo: 'assets/logos-facultades/FI.png',
    carreras: '["Ingenieria Ambiental", "Ingenieria de Alimentos", "Ingenieria Civil", "Ingenieria Electrica", "Ingenieria Mecanica y Electromecanica", "Ingenieria Electronica", "Ingenieria Industrial", "Mecatronica (MEC)", "Ingenieria Metalurgica y Materiales", "Ingenieria Petrolera", "Ingenieria Quimica", "Programa de Ing. Industrial Amazonica", "Programa de Ing. Petroquimica", "Programa de Ing. Production Industrial", "Programa de Ing. Seguridad Industrial y Salud Ocupacional"]'
  },
  {
    idFacultad: 11,
    nombre: 'Facultad de Medicina, Enfermeria, Nutricion y Tecnologia Medica',
    codigo: 'FMENT',
    idChaside: 4,
    url: 'http://fment.umsa.bo/',
    imgLogo: 'assets/logos-facultades/FMENT.png',
    carreras: '["Medicina", "Enfermeria", "Nutricion y Dietetica", "Tecnologia Medica"]'
  },
  {
    idFacultad: 12,
    nombre: 'Facultad de Odontologia',
    codigo: 'FO',
    idChaside: 4,
    url: 'http://fo.umsa.bo/',
    imgLogo: 'assets/logos-facultades/FO.png',
    carreras: '["Odontologia"]'
  },
  {
    idFacultad: 13,
    nombre: 'Facultad de Tecnologia',
    codigo: 'FT',
    idChaside: 5,
    url: 'http://ft.umsa.bo/',
    imgLogo: 'assets/logos-facultades/FT.png',
    carreras: '["Aeronautica", "Construcciones Civiles", "Electricidad Industrial", "Electronica y Telecomunicaciones", "Electromecanica", "Mecanica Automotriz", "Mecanica Industrial", "Quimica Industrial", "Geodesia, Topografia y Geomatica", "Programa Tec. Sup. Construccion", "Programa Tec. Sup. Electromecanica", "Programa Tec. Sup. Mecanica Automotriz", "Programa Tec. Med. Mecanica Automotriz", "Programa Tecnologia de Alimentos", "Programa Tec. Sup. Procesos Quimicos"]'
  },
  {
    idFacultad: 14,
    nombre: 'Academia Nacional de Policías (ANAPOL)',
    codigo: 'ANAPOL',
    idChaside: 6,
    url: 'http://www.unipol.edu.bo/?page_id=223',
    imgLogo: '',
    carreras: '["Oficial de Policía"]'
  },
  {
    idFacultad: 15,
    nombre: 'Colegio Militar del Ejército - Cnl. Gualberto Villarroel',
    codigo: 'COLMIL',
    idChaside: 6,
    url: 'https://www.colmil.mil.bo/',
    imgLogo: '',
    carreras: '["Oficial del Ejército"]'
  },
  {
    idFacultad: 16,
    nombre: 'Colegio Militar de Aviación (COLMILAV)',
    codigo: 'COLMILAV',
    idChaside: 6,
    url: 'https://fab.bo/colmilav/',
    imgLogo: '',
    carreras: '["Oficial de la Fuerza Aérea"]'
  }
];
