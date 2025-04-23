// info-orientacion.component.ts - Componente para mostrar y seleccionar facultades universitarias
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { FacultadService } from '../../services/facultad.service';
import { Facultad } from '../../interfaces/facultad.interface';

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

  constructor(
    private facultadService: FacultadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarFacultades();

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      filter(event => event.url.includes('info-orientacion')),
      takeUntil(this.destroy$)
    ).subscribe(() => this.cargarFacultades());
  }

  cargarFacultades(): void {
    this.cargando = true;
    this.error = false;

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
          
          // Intentar obtener datos del BehaviorSubject si la API falló
          this.facultadService.facultades$
            .pipe(takeUntil(this.destroy$))
            .subscribe(facultadesCache => {
              if (facultadesCache.length > 0) {
                this.facultades = facultadesCache;
                this.cargando = false;
              }
            });
        }
      });
  }

  seleccionarFacultad(facultad: Facultad): void {
    this.facultadSeleccionada = facultad;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}