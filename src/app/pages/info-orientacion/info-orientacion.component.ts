// info-orientacion.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FacultadService, Facultad } from '../../services/facultad.service';

@Component({
  selector: 'app-info-orientacion',
  templateUrl: './info-orientacion.component.html',
  styleUrls: ['./info-orientacion.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class InfoOrientacionComponent implements OnInit {

  facultades: Facultad[] = [];
  facultadSeleccionada: Facultad | null = null;
  facultadSeleccionadaId: number | null = null;
  cargando = true;
  error = false;

  /**
   * Constructor del componente.
   * @param router Para la navegación entre rutas.
   * @param facultadService Servicio para obtener los datos de facultades.
   */
  constructor(
    private router: Router,
    private facultadService: FacultadService
  ) { }

  /**
   * Inicializa el componente cargando los datos desde el servicio.
   */
  ngOnInit(): void {
    this.cargarFacultades();
  }

  /**
   * Carga las facultades desde el servicio.
   */
  cargarFacultades(): void {
    this.cargando = true;
    this.error = false;

    this.facultadService.getAll().subscribe({
      next: (data) => {
        this.facultades = data.slice(0, 13).map(facultad => {
          return {
            ...facultad,
            carreras: Array.isArray(facultad.carreras) ? facultad.carreras : JSON.parse(facultad.carreras)
          };
        });
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar facultades:', error);
        this.error = true;
        this.cargando = false;
      }
    });
  }

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
   * @param facultad La facultad cuyas carreras se alternarán.
   * @param event El evento del click para evitar propagación.
   */
  toggleCarreras(facultad: Facultad, event: Event): void {
    event.stopPropagation();
    console.log('Facultad clickeada:', facultad.nombre, 'ID:', facultad.idFacultad);
    console.log('Facultad actualmente seleccionada ID:', this.facultadSeleccionadaId);
    if (this.facultadSeleccionadaId === facultad.idFacultad) {
      this.facultadSeleccionadaId = null;
      console.log('Cerrando facultad');
    } else {
      this.facultadSeleccionadaId = facultad.idFacultad;
      console.log('Abriendo facultad:', facultad.idFacultad);
    }
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 10);
  }
}