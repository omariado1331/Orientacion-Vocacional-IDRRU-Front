// info-orientacion.component.ts - Componente mejorado para las facultades de la UMSA
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { FacultadService } from '../../services/facultad.service';
import { Facultad } from '../../interfaces/facultad.interface';

const FACULTADES_DATA = [
  {
    id: 1,
    nombre: "Facultad de Agronomía",
    codigo: "FA",
    url: "/facultades/agronomia",
    imgLogo: "assets/logos-facultades/FA.png",
    carreras: [
      "Ingeniería Agronómica",
      "Ingeniería en Producción y Comercialización Agropecuaria",
      "Programa Medicina Veterinaria y Zootecnia"
    ],
    icono: "bi-tree"
  },
  {
    id: 2,
    nombre: "Facultad de Arquitectura, Artes, Diseño y Urbanismo",
    codigo: "FAADU",
    url: "/facultades/arquitectura",
    imgLogo: "assets/logos-facultades/FAADU.png",
    carreras: [
      "Arquitectura",
      "Artes Plásticas",
      "Diseño Gráfico",
      "Prog. Arquitectura para la Amazonía"
    ],
    icono: "bi-buildings"
  },
  {
    id: 3,
    nombre: "Facultad de Ciencias Económicas y Financieras",
    codigo: "FCEF",
    url: "/facultades/economicas",
    imgLogo: "assets/logos-facultades/FCEF.png",
    carreras: [
      "Administración de Empresas",
      "Contaduría Pública",
      "Economía"
    ],
    icono: "bi-cash-coin"
  },
  {
    id: 4,
    nombre: "Facultad de Ciencias Farmacéuticas y Bioquímicas",
    codigo: "FCFB",
    url: "/facultades/farmaceuticas",
    imgLogo: "assets/logos-facultades/FCFB.png",
    carreras: [
      "Bioquímica",
      "Química Farmacéutica"
    ],
    icono: "bi-capsule"
  },
  {
    id: 5,
    nombre: "Facultad de Ciencias Geológicas",
    codigo: "FCG",
    url: "/facultades/geologicas",
    imgLogo: "assets/logos-facultades/FCG.png",
    carreras: [
      "Ingeniería Geográfica",
      "Ingeniería Geológica",
      "Programa Catastro y Ordenamiento Territorial",
      "Programa Geología de Minas"
    ],
    icono: "bi-gem"
  },
  {
    id: 6,
    nombre: "Facultad de Ciencias Puras y Naturales",
    codigo: "FCPN",
    url: "/facultades/ciencias-puras",
    imgLogo: "assets/logos-facultades/FCPN.png",
    carreras: [
      "Biología",
      "Ciencias Químicas",
      "Estadística",
      "Física",
      "Informática",
      "Matemática"
    ],
    icono: "bi-atom"
  },
  {
    id: 7,
    nombre: "Facultad de Ciencias Sociales",
    codigo: "FCS",
    url: "/facultades/ciencias-sociales",
    imgLogo: "assets/logos-facultades/FCS.png",
    carreras: [
      "Antropología y Arqueología",
      "Ciencias de la Comunicación Social",
      "Sociología",
      "Trabajo Social"
    ],
    icono: "bi-people"
  },
  {
    id: 8,
    nombre: "Facultad de Derecho y Ciencias Políticas",
    codigo: "FDCP",
    url: "/facultades/derecho",
    imgLogo: "assets/logos-facultades/FDCP.png",
    carreras: [
      "Derecho",
      "Ciencias Políticas y Gestión Pública",
      "Programa Derecho de las Naciones Originarias"
    ],
    icono: "bi-balance-scale"
  },
  {
    id: 9,
    nombre: "Facultad de Humanidades y Ciencias de la Educación",
    codigo: "FHCE",
    url: "/facultades/humanidades",
    imgLogo: "assets/logos-facultades/FHCE.png",
    carreras: [
      "Ciencias de la Información, Archivología - Bibliotecología - Documentación - Museología",
      "Ciencias de la Educación",
      "Filosofía",
      "Historia",
      "Lingüística e Idiomas",
      "Literatura",
      "Psicología",
      "Turismo"
    ],
    icono: "bi-book"
  },
  {
    id: 10,
    nombre: "Facultad de Ingeniería",
    codigo: "FI",
    url: "/facultades/ingenieria",
    imgLogo: "assets/logos-facultades/FI.png",
    carreras: [
      "Ingeniería Ambiental",
      "Ingeniería de Alimentos",
      "Ingeniería Civil",
      "Ingeniería Eléctrica",
      "Ingeniería Mecánica y Electromecánica",
      "Ingeniería Electrónica",
      "Ingeniería Industrial",
      "Mecatrónica (MEC)",
      "Ingeniería Metalúrgica y Materiales",
      "Ingeniería Petrolera",
      "Ingeniería Química",
      "Programa de Ing. Industrial Amazónica",
      "Programa de Ing. Petroquímica",
      "Programa de Ing. Producción Industrial",
      "Programa de Ing. Seguridad Industrial y Salud Ocupacional"
    ],
    icono: "bi-gear"
  },
  {
    id: 11,
    nombre: "Facultad de Medicina, Enfermería, Nutrición y Tecnología Médica",
    codigo: "FMENT",
    url: "/facultades/medicina",
    imgLogo: "assets/logos-facultades/FMENT.png",
    carreras: [
      "Medicina",
      "Enfermería",
      "Nutrición y Dietética",
      "Tecnología Médica"
    ],
    icono: "bi-hospital"
  },
  {
    id: 12,
    nombre: "Facultad de Odontología",
    codigo: "FO",
    url: "/facultades/odontologia",
    imgLogo: "assets/logos-facultades/FO.png",
    carreras: [
      "Odontología"
    ],
    icono: "bi-emoji-smile"
  },
  {
    id: 13,
    nombre: "Facultad de Tecnología",
    codigo: "FT",
    url: "/facultades/tecnologia",
    imgLogo: "assets/logos-facultades/FT.png",
    carreras: [
      "Aeronáutica",
      "Construcciones Civiles",
      "Electricidad Industrial",
      "Electrónica y Telecomunicaciones",
      "Electromecánica",
      "Mecánica Automotriz",
      "Mecánica Industrial",
      "Química Industrial",
      "Geodesia, Topografía y Geomática",
      "Programa Tec. Sup. Construcción",
      "Programa Tec. Sup. Electromecánica",
      "Programa Tec. Sup. Mecánica Automotriz",
      "Programa Tec. Med. Mecánica Automotriz",
      "Programa Tecnología de Alimentos",
      "Programa Tec. Sup. Procesos Químicos"
    ],
    icono: "bi-tools"
  }
];

@Component({
  selector: 'app-informacion',
  templateUrl: './info-orientacion.component.html',
  styleUrls: ['./info-orientacion.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class InfoOrientacionComponent implements OnInit, OnDestroy {
  facultades: Facultad[] = [];
  facultadSeleccionada: Facultad | null = null;
  cargando = true;
  error = false;
  private destroy$ = new Subject<void>();
  mostrarCarreras = false;

  constructor(
    private facultadService: FacultadService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('Iniciando carga de facultades');
    this.cargarFacultades();
    this.facultadService.facultades$.subscribe(data => {
      console.log('BehaviorSubject actualizado:', data);
    });
    
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      filter(event => event.url.includes('info-orientacion')),
      takeUntil(this.destroy$)
    ).subscribe(() => this.cargarFacultades());
  }

  cargarFacultades(): void {
    this.cargando = true;
    this.error = false;

    // Cargar datos locales mientras no se use la API
    setTimeout(() => {
      this.facultades = FACULTADES_DATA;
      this.cargando = false;
    }, 500);

    /*
    // Primero intenta usar datos del BehaviorSubject si ya están disponibles
    this.facultadService.facultades$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (cachedFacultades) => {
        if (cachedFacultades && cachedFacultades.length > 0) {
          this.facultades = cachedFacultades;
          this.cargando = false;
        }
      },
      error: () => {
        this.error = true;
        this.cargando = false;
      }
    });

    // Si no hay datos en caché, intenta cargar desde API
    this.facultadService.cargarFacultades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (facultades) => {
          this.facultades = facultades;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar facultades:', err);
          this.error = true;
          this.cargando = false;
        }
      });
    */
  }

  seleccionarFacultad(facultad: Facultad): void {
    this.facultadSeleccionada = facultad;
    this.router.navigate([facultad.url]);
  }
  toggleCarreras(facultad: any, event: Event) {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}