import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Facultad {
  idFacultad: number;
  nombre: string;
  codigo: string;
  chaside: number;
  url: string;
  imgLogo: string;
  carreras: string[];
}

export const FACULTADES_DATA: Facultad[] = [
  {
    idFacultad: 1,
    nombre: "Facultad de Agronomia",
    codigo: "FA",
    chaside: 7,
    url: "http://agro.umsa.bo/",
    imgLogo: "assets/logos-facultades/FA.png",
    carreras: [
      "Ingenieria Agronomica",
      "Ingenieria en Produccion y Comercializacion Agropecuaria",
      "Programa Medicina Veterinaria y Zootecnia"
    ],
  },
  {
    idFacultad: 2,
    nombre: "Facultad de Arquitectura, Artes, Diseno y Urbanismo",
    codigo: "FAADU",
    chaside: 3,
    url: "http://faadu.umsa.bo/",
    imgLogo: "assets/logos-facultades/FAADU.png",
    carreras: [
      "Arquitectura",
      "Artes Plasticas",
      "Diseno Grafico",
      "Prog. Arquitectura para la Amazonia"
    ],
  },
  {
    idFacultad: 3,
    nombre: "Facultad de Ciencias Economicas y Financieras",
    codigo: "FCEF",
    chaside: 1,
    url: "https://fcef.umsa.bo/",
    imgLogo: "assets/logos-facultades/FCEF.png",
    carreras: ["Administracion de Empresas", "Contaduria Publica", "Economia"],
  },
  {
    idFacultad: 4,
    nombre: "Facultad de Ciencias Farmaceuticas y Bioquimicas",
    codigo: "FCFB",
    chaside: 4,
    url: "http://www.farbio.edu.bo/",
    imgLogo: "assets/logos-facultades/FCFB.png",
    carreras: ["Bioquimica", "Quimica Farmaceutica"],
  },
  {
    idFacultad: 5,
    nombre: "Facultad de Ciencias Geologicas",
    codigo: "FCG",
    chaside: 5,
    url: "http://fcg.umsa.bo/",
    imgLogo: "assets/logos-facultades/FCG.png",
    carreras: [
      "Ingenieria Geografica",
      "Ingenieria Geologica",
      "Programa Catastro y Ordenamiento Territorial",
      "Programa Geologia de Minas"
    ],
  },
  {
    idFacultad: 6,
    nombre: "Facultad de Ciencias Puras y Naturales",
    codigo: "FCPN",
    chaside: 5,
    url: "http://www.fcpn.edu.bo/fcpn/",
    imgLogo: "assets/logos-facultades/FCPN.png",
    carreras: [
      "Biologia",
      "Ciencias Quimicas",
      "Estadistica",
      "Fisica",
      "Informatica",
      "Matematica"
    ],
  },
  {
    idFacultad: 7,
    nombre: "Facultad de Ciencias Sociales",
    codigo: "FCS",
    chaside: 2,
    url: "http://fcs.umsa.bo/",
    imgLogo: "assets/logos-facultades/FCS.png",
    carreras: [
      "Antropologia y Arqueologia",
      "Ciencias de la Comunicacion Social",
      "Sociologia",
      "Trabajo Social"
    ],
  },
  {
    idFacultad: 8,
    nombre: "Facultad de Derecho y Ciencias Politicas",
    codigo: "FDCP",
    chaside: 2,
    url: "http://www.fdcp.umsa.bo/",
    imgLogo: "assets/logos-facultades/FDCP.png",
    carreras: [
      "Derecho",
      "Ciencias Politicas y Gestion Publica",
      "Programa Derecho de las Naciones Originarias"
    ],
  },
  {
    idFacultad: 9,
    nombre: "Facultad de Humanidades y Ciencias de la Educacion",
    codigo: "FHCE",
    chaside: 2,
    url: "https://fhce.umsa.bo/",
    imgLogo: "assets/logos-facultades/FHCE.png",
    carreras: [
      "Ciencias de la Informacion, Archivologia - Bibliotecologia - Documentacion - Museologia",
      "Ciencias de la Educacion",
      "Filosofia",
      "Historia",
      "Linguistica e Idiomas",
      "Literatura",
      "Psicologia",
      "Turismo"
    ],
  },
  {
    idFacultad: 10,
    nombre: "Facultad de Ingenieria",
    codigo: "FI",
    chaside: 5,
    url: "http://200.87.114.154/ffing/index.php",
    imgLogo: "assets/logos-facultades/FI.png",
    carreras: [
      "Ingenieria Ambiental",
      "Ingenieria de Alimentos",
      "Ingenieria Civil",
      "Ingenieria Electrica",
      "Ingenieria Mecanica y Electromecanica",
      "Ingenieria Electronica",
      "Ingenieria Industrial",
      "Mecatronica (MEC)",
      "Ingenieria Metalurgica y Materiales",
      "Ingenieria Petrolera",
      "Ingenieria Quimica",
      "Programa de Ing. Industrial Amazonica",
      "Programa de Ing. Petroquimica",
      "Programa de Ing. Produccion Industrial",
      "Programa de Ing. Seguridad Industrial y Salud Ocupacional"
    ],
  },
  {
    idFacultad: 11,
    nombre: "Facultad de Medicina, Enfermeria, Nutricion y Tecnologia Medica",
    codigo: "FMENT",
    chaside: 4,
    url: "http://fment.umsa.bo/",
    imgLogo: "assets/logos-facultades/FMENT.png",
    carreras: [
      "Medicina",
      "Enfermeria",
      "Nutricion y Dietetica",
      "Tecnologia Medica"
    ],
  },
  {
    idFacultad: 12,
    nombre: "Facultad de Odontologia",
    codigo: "FO",
    chaside: 4,
    url: "http://fo.umsa.bo/",
    imgLogo: "assets/logos-facultades/FO.png",
    carreras: ["Odontologia"],
  },
  {
    idFacultad: 13,
    nombre: "Facultad de Tecnologia",
    codigo: "FT",
    chaside: 5,
    url: "http://ft.umsa.bo/",
    imgLogo: "assets/logos-facultades/FT.png",
    carreras: [
      "Aeronautica",
      "Construcciones Civiles",
      "Electricidad Industrial",
      "Electronica y Telecomunicaciones",
      "Electromecanica",
      "Mecanica Automotriz",
      "Mecanica Industrial",
      "Quimica Industrial",
      "Geodesia, Topografia y Geomatica",
      "Programa Tec. Sup. Construccion",
      "Programa Tec. Sup. Electromecanica",
      "Programa Tec. Sup. Mecanica Automotriz",
      "Programa Tec. Med. Mecanica Automotriz",
      "Programa Tecnologia de Alimentos",
      "Programa Tec. Sup. Procesos Quimicos"
    ],
  },
  {
    idFacultad: 14,
    nombre: "Academia Nacional de Policías (ANAPOL)",
    codigo: "ANAPOL",
    chaside: 6,
    url: "http://www.unipol.edu.bo/?page_id=223",
    imgLogo: "",
    carreras: ["Oficial de Policía"],
  },
  {
    idFacultad: 15,
    nombre: "Facultad Técnica Superior en Ciencias Policiales (FATESCIPOL)",
    codigo: "FATESCIPOL",
    chaside: 6,
    url: "http://www.unipol.edu.bo/?page_id=258",
    imgLogo: "",
    carreras: ["Técnico Superior en Ciencias Policiales"],
  },
  {
    idFacultad: 16,
    nombre: "Colegio Militar del Ejército - Cnl. Gualberto Villarroel",
    codigo: "COLMIL",
    chaside: 6,
    url: "https://www.colmil.mil.bo/",
    imgLogo: "",
    carreras: ["Oficial del Ejército"],
  },
  {
    idFacultad: 17,
    nombre: "Colegio Militar de Aviación (COLMILAV)",
    codigo: "COLMILAV",
    chaside: 6,
    url: "https://fab.bo/colmilav/",
    imgLogo: "",
    carreras: ["Oficial de la Fuerza Aérea"],
  },
  {
    idFacultad: 18,
    nombre: "Escuela Naval Militar - Eduardo Abaroa Hidalgo",
    codigo: "ESCUELANAVAL",
    chaside: 6,
    url: "https://www.armada.mil.bo/",
    imgLogo: "",
    carreras: ["Oficial de la Armada"],
  },
  {
    idFacultad: 19,
    nombre: "Escuela Militar de Sargentos del Ejército",
    codigo: "EMSGT",
    chaside: 6,
    url: "https://ejercito.mil.bo/",
    imgLogo: "",
    carreras: ["Sargento del Ejército"],
  },
];
@Injectable({
  providedIn: 'root'
})
export class FacultadService {
  private apiUrl = `${environment.apiUrl}/facultad`;
  private useMockData = true;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Facultad[]> {
    if (this.useMockData) {
      return of(FACULTADES_DATA);
    } else {
      return this.http.get<Facultad[]>(`${this.apiUrl}`);
    }
  }

  getById(id: number): Observable<Facultad> {
    if (this.useMockData) {
      const facultad = FACULTADES_DATA.find(f => f.idFacultad === id);
      return of(facultad as Facultad);
    } else {
      return this.http.get<Facultad>(`${this.apiUrl}/${id}`);
    }
  }

}