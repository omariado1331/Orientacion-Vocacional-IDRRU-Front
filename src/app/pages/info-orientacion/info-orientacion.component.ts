// info-orientacion.component.ts - Componente simplificado para las facultades de la UMSA
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * Define la estructura de datos para una Facultad.
 */
interface Facultad {
  id: number;
  nombre: string;
  codigo: string;
  url: string;
  imgLogo: string;
  carreras: string[];
}

/**
 * Datos de ejemplo para las facultades.
 */
const FACULTADES_DATA: Facultad[] = [
  {
    id: 1,
    nombre: "Facultad de Agronomia",
    codigo: "FA",
    url: "/facultades/agronomia",
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
    url: "/facultades/arquitectura",
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
    url: "/facultades/economicas",
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
    url: "/facultades/farmaceuticas",
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
    url: "/facultades/geologicas",
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
    url: "/facultades/ciencias-puras",
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
    url: "/facultades/ciencias-sociales",
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
    url: "/facultades/derecho",
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
    url: "/facultades/humanidades",
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
    url: "/facultades/ingenieria",
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
    url: "/facultades/medicina",
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
    url: "/facultades/odontologia",
    imgLogo: "assets/logos-facultades/FO.png",
    carreras: [
      "Odontologia"
    ],
  },
  {
    id: 13,
    nombre: "Facultad de Tecnologia",
    codigo: "FT",
    url: "/facultades/tecnologia",
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

/**
 * Componente para mostrar informacion de las facultades de la UMSA.
 * Permite seleccionar una facultad para ver detalles.
 */
@Component({
  selector: 'app-informacion',
  templateUrl: './info-orientacion.component.html',
  styleUrls: ['./info-orientacion.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class InfoOrientacionComponent {

  facultades: Facultad[] = FACULTADES_DATA;

  facultadSeleccionada: Facultad | null = null;

  cargando = false;
  error = false;

  /**
   * Constructor del componente.
   * @param router Para la navegacion entre rutas.
   */
  constructor(private router: Router) { }

  /**
   * Selecciona una facultad y navega a su URL.
   * @param facultad La facultad seleccionada.
   */
  seleccionarFacultad(facultad: Facultad): void {
    this.facultadSeleccionada = facultad;
    this.router.navigate([facultad.url]);
  }

  /**
   * Alterna la visibilidad de las carreras de una facultad.
   * @param facultad La facultad cuyas carreras se alternaran.
   * @param event El evento del click para evitar propagacion.
   */
  toggleCarreras(facultad: Facultad, event: Event): void {
    event.stopPropagation();
    if (this.facultadSeleccionada && this.facultadSeleccionada.id === facultad.id) {
      this.facultadSeleccionada = null;
    } else {
      this.facultadSeleccionada = facultad;
    }
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 10);
  }
}