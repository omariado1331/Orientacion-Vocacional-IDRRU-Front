import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Define la estructura de datos para una Facultad.
 */
export interface Facultad {
  id: number;
  nombre: string;
  codigo: string;
  url: string;
  imgLogo: string;
  carreras: string[];
}

/**
 * Datos estáticos para las facultades.
 */
const FACULTADES_DATA: Facultad[] = [
  {
    id: 1,
    nombre: "Facultad de Agronomia",
    codigo: "FA",
    url: "http://agro.umsa.bo/",
    imgLogo: "assets/logos-facultades/FA.png",
    carreras: [
      "Ingenieria Agronomica",
      "Ingenieria en Produccion y Comercializacion Agropecuaria",
      "Programa Medicina Veterinaria y Zootecnia"
    ],
  },
  {
    id: 2,
    nombre: "Facultad de Arquitectura, Artes, Diseno y Urbanismo",
    codigo: "FAADU",
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
    id: 3,
    nombre: "Facultad de Ciencias Economicas y Financieras",
    codigo: "FCEF",
    url: "https://fcef.umsa.bo/",
    imgLogo: "assets/logos-facultades/FCEF.png",
    carreras: [
      "Administracion de Empresas",
      "Contaduria Publica",
      "Economia"
    ],
  },
  {
    id: 4,
    nombre: "Facultad de Ciencias Farmaceuticas y Bioquimicas",
    codigo: "FCFB",
    url: "http://www.farbio.edu.bo/",
    imgLogo: "assets/logos-facultades/FCFB.png",
    carreras: [
      "Bioquimica",
      "Quimica Farmaceutica"
    ],
  },
  {
    id: 5,
    nombre: "Facultad de Ciencias Geologicas",
    codigo: "FCG",
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
    id: 6,
    nombre: "Facultad de Ciencias Puras y Naturales",
    codigo: "FCPN",
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
    id: 7,
    nombre: "Facultad de Ciencias Sociales",
    codigo: "FCS",
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
    id: 8,
    nombre: "Facultad de Derecho y Ciencias Politicas",
    codigo: "FDCP",
    url: "http://www.fdcp.umsa.bo/",
    imgLogo: "assets/logos-facultades/FDCP.png",
    carreras: [
      "Derecho",
      "Ciencias Politicas y Gestion Publica",
      "Programa Derecho de las Naciones Originarias"
    ],
  },
  {
    id: 9,
    nombre: "Facultad de Humanidades y Ciencias de la Educacion",
    codigo: "FHCE",
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
    id: 10,
    nombre: "Facultad de Ingenieria",
    codigo: "FI",
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
    id: 11,
    nombre: "Facultad de Medicina, Enfermeria, Nutricion y Tecnologia Medica",
    codigo: "FMENT",
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
    id: 12,
    nombre: "Facultad de Odontologia",
    codigo: "FO",
    url: "http://fo.umsa.bo/",
    imgLogo: "assets/logos-facultades/FO.png",
    carreras: [
      "Odontologia"
    ],
  },
  {
    id: 13,
    nombre: "Facultad de Tecnologia",
    codigo: "FT",
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
  }
];

@Injectable({
  providedIn: 'root'
})
export class FacultadService {
  private apiUrl = `${environment.apiUrl}/facultad`;
  private useMockData = true; 

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las facultades.
   * Si useMockData es true, devuelve los datos estáticos.
   * De lo contrario, realiza una llamada HTTP a la API.
   */
  getAll(): Observable<Facultad[]> {
    if (this.useMockData) {
      return of(FACULTADES_DATA);
    } else {
      return this.http.get<Facultad[]>(`${this.apiUrl}`);
    }
  }

  getById(id: number): Observable<Facultad> {
    if (this.useMockData) {
      const facultad = FACULTADES_DATA.find(f => f.id === id);
      return of(facultad as Facultad);
    } else {
      return this.http.get<Facultad>(`${this.apiUrl}/${id}`);
    }
  }

  create(facultad: Facultad): Observable<Facultad> {
    return this.http.post<Facultad>(`${this.apiUrl}`, facultad);
  }

  update(id: number, facultad: Facultad): Observable<Facultad> {
    return this.http.put<Facultad>(`${this.apiUrl}/${id}`, facultad);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}