import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConfiguracionService } from '../../services/configuracion.service';
import { MunicipioService } from '../../services/municipio.service';
import { ColegioService } from '../../services/colegio.service';
import { AuthService } from '../../services/auth.service';
import { ProvinciaService } from '../../services/provincia.service';
import { NotificacionService } from '../../services/notificacion.service';

import { Configuracion } from '../../interfaces/configuracion-interface';
import { Municipio } from '../../interfaces/municipio-interface';
import { Colegio } from '../../interfaces/colegio-interface';
import { UsuarioRegistrado } from '../../interfaces/auth.interface';
import { Provincia } from '../../interfaces/provincia-interface';

@Component({
  selector: 'app-configuracion-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './configuracion-admin.component.html',
  styleUrl: './configuracion-admin.component.css'
})
export class ConfiguracionAdminComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  // ─── Navegación por tabs ────────────────────────────────────────────────────
  tabActiva: 'configuracion' | 'usuarios' | 'municipios' | 'colegios' = 'configuracion';

  // ─── Listas de datos ────────────────────────────────────────────────────────
  configuracion!: Configuracion;
  provincias: Provincia[] = [];
  municipios: Municipio[] = [];
  municipiosFiltradosColegio: Municipio[] = [];
  colegios: Colegio[] = [];
  usuarios: UsuarioRegistrado[] = [];

  // ─── Estado de carga ────────────────────────────────────────────────────────
  cargandoUsuarios = false;
  cargandoMunicipios = false;
  cargandoColegios = false;

  // ─── Formularios ────────────────────────────────────────────────────────────
  configuracionForm!: FormGroup;
  municipioForm!: FormGroup;
  colegioForm!: FormGroup;
  usuarioForm!: FormGroup;

  // ─── Estado de edición ──────────────────────────────────────────────────────
  idMunicipioEditar: number | null = null;
  idColegioEditar: number | null = null;
  idUsuarioEditar: number | null = null;

  // Selector de provincia para el formulario de Colegio (fuera del form group)
  provinciaSeleccionadaColegio: number | null = null;

  // ─── Opciones de roles ──────────────────────────────────────────────────────
  readonly roles = [
    { value: 'ADMINISTRADOR', label: 'Administrador' },
    { value: 'EVALUADOR',     label: 'Evaluador'     }
  ];

  constructor(
    private configuracionService: ConfiguracionService,
    private provinciaService: ProvinciaService,
    private municipioService: MunicipioService,
    private colegioService: ColegioService,
    private authService: AuthService,
    private notificacionService: NotificacionService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  // ════════════════════════════════════════════════════════════════════════════
  // Ciclo de vida
  // ════════════════════════════════════════════════════════════════════════════

  ngOnInit(): void {
    if (!this.authService.esAdministrador()) {
      this.router.navigate(['/']);
      return;
    }
    this.inicializarFormularios();
    // Carga inicial según tab activa por defecto
    this.cargarDatosPorTab(this.tabActiva);
    // Las provincias se necesitan en múltiples tabs
    this.cargarProvincias();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ════════════════════════════════════════════════════════════════════════════
  // Navegación de tabs
  // ════════════════════════════════════════════════════════════════════════════

  cambiarTab(tab: 'configuracion' | 'usuarios' | 'municipios' | 'colegios'): void {
    this.tabActiva = tab;
    this.cargarDatosPorTab(tab);
  }

  private cargarDatosPorTab(tab: string): void {
    switch (tab) {
      case 'configuracion': this.cargarConfiguracion();  break;
      case 'usuarios':      this.cargarUsuarios();       break;
      case 'municipios':    this.cargarMunicipios();     break;
      case 'colegios':
        this.cargarMunicipios();
        this.cargarColegios();
        break;
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // Inicialización de formularios
  // ════════════════════════════════════════════════════════════════════════════

  private inicializarFormularios(): void {
    this.configuracionForm = this.fb.group({
      guardarResultados:    [false],
      formularioHabilitado: [true]
    });

    this.municipioForm = this.fb.group({
      nombre:      ['', Validators.required],
      idProvincia: [null, Validators.required]
    });

    this.colegioForm = this.fb.group({
      nombre:      ['', Validators.required],
      // Starts disabled until a province is selected
      idMunicipio: [{ value: null, disabled: true }, Validators.required]
    });

    this.usuarioForm = this.fb.group({
      username: ['', Validators.required],
      password: [''],
      nombre:   ['', Validators.required],
      rol:      ['EVALUADOR', Validators.required]
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // Configuración del sistema
  // ════════════════════════════════════════════════════════════════════════════

  cargarConfiguracion(): void {
    this.configuracionService.getConfiguracion()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.configuracion = data;
          this.configuracionForm.patchValue({
            guardarResultados:    data.guardarResultados,
            formularioHabilitado: data.formularioHabilitado
          });
        },
        error: (err) => {
          console.error('Error al cargar configuración:', err);
          // this.notificacionService.mostrar('Error al cargar la configuración', 'error');
        }
      });
  }

  guardarConfiguracion(): void {
    if (!this.configuracion || !this.configuracion.idConfiguracion) {
      this.notificacionService.mostrar('Error al guardar: La configuración no fue cargada.', 'error');
      return;
    }

    const configuracion: Configuracion = {
      ...this.configuracion,
      ...this.configuracionForm.value
    };
    this.configuracionService.updateConfiguracion(configuracion)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificacionService.mostrar('Configuración guardada exitosamente', 'success');
        },
        error: (err) => {
          console.error('Error al guardar configuración:', err);
          this.notificacionService.mostrar('Error al guardar la configuración', 'error');
        }
      });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // Provincias (catálogo de soporte)
  // ════════════════════════════════════════════════════════════════════════════

  cargarProvincias(): void {
    this.provinciaService.getProvincias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => { this.provincias = data; },
        error: (err) => { console.error('Error al cargar provincias:', err); }
      });
  }

  /** Helper: obtiene el nombre de la provincia dado su id */
  getNombreProvincia(idProvincia: number): string {
    return this.provincias.find(p => p.idProvincia === idProvincia)?.nombre ?? '—';
  }

  /** Helper: obtiene el nombre del municipio dado su id */
  getNombreMunicipio(idMunicipio: number): string {
    return this.municipios.find(m => m.idMunicipio === idMunicipio)?.nombre ?? '—';
  }

  // ════════════════════════════════════════════════════════════════════════════
  // Usuarios
  // ════════════════════════════════════════════════════════════════════════════

  cargarUsuarios(): void {
    this.cargandoUsuarios = true;
    this.authService.getUsuarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.usuarios = data;
          this.cargandoUsuarios = false;
        },
        error: (err) => {
          console.error('Error al cargar usuarios:', err);
          this.notificacionService.mostrar('Error al cargar la lista de usuarios', 'error');
          this.cargandoUsuarios = false;
        }
      });
  }

  guardarUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const esEdicion = this.idUsuarioEditar !== null;

    if (esEdicion) {
      // En edición, solo enviar password si fue modificada
      const payload: UsuarioRegistrado = { ...this.usuarioForm.value };
      if (!payload.password) {
        delete payload.password;
      }

      this.authService.update(this.idUsuarioEditar!, payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.cancelarEdicionUsuario();
            this.cargarUsuarios();
            this.notificacionService.mostrar('Usuario actualizado exitosamente', 'success');
          },
          error: (err) => {
            console.error('Error al actualizar usuario:', err);
            this.notificacionService.mostrar('Error al actualizar el usuario', 'error');
          }
        });
    } else {
      // Modo creación: password obligatoria
      if (!this.usuarioForm.get('password')?.value) {
        this.usuarioForm.get('password')?.setErrors({ required: true });
        this.usuarioForm.markAllAsTouched();
        return;
      }

      this.authService.create(this.usuarioForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.cancelarEdicionUsuario();
            this.cargarUsuarios();
            this.notificacionService.mostrar('Usuario creado exitosamente', 'success');
          },
          error: (err) => {
            console.error('Error al crear usuario:', err);
            this.notificacionService.mostrar('Error al crear el usuario', 'error');
          }
        });
    }
  }

  editarUsuario(id: number): void {
    const usuario = this.usuarios.find(u => u.idUsuario === id);
    if (!usuario) return;

    this.idUsuarioEditar = id;
    this.usuarioForm.patchValue({
      username: usuario.username,
      password: '',           // por seguridad, no pre-llenar contraseña
      nombre:   usuario.nombre,
      rol:      usuario.rol
    });
    // Hacer el campo password opcional en modo edición
    this.usuarioForm.get('password')?.clearValidators();
    this.usuarioForm.get('password')?.updateValueAndValidity();
  }

  cancelarEdicionUsuario(): void {
    this.idUsuarioEditar = null;
    this.usuarioForm.reset({ rol: 'EVALUADOR' });
    // Restaurar validación de password para modo creación
    this.usuarioForm.get('password')?.clearValidators();
    this.usuarioForm.get('password')?.updateValueAndValidity();
  }

  eliminarUsuario(id: number): void {
    if (!confirm('¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }
    this.authService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.cargarUsuarios();
          this.notificacionService.mostrar('Usuario eliminado exitosamente', 'success');
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
          this.notificacionService.mostrar('Error al eliminar el usuario', 'error');
        }
      });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // Municipios
  // ════════════════════════════════════════════════════════════════════════════

  cargarMunicipios(): void {
    this.cargandoMunicipios = true;
    this.municipioService.getAllMunicipios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.municipios = data;
          this.cargandoMunicipios = false;
        },
        error: (err) => {
          console.error('Error al cargar municipios:', err);
          this.notificacionService.mostrar('Error al cargar la lista de municipios', 'error');
          this.cargandoMunicipios = false;
        }
      });
  }

  guardarMunicipio(): void {
    if (this.municipioForm.invalid) {
      this.municipioForm.markAllAsTouched();
      return;
    }

    const esEdicion = this.idMunicipioEditar !== null;

    if (esEdicion) {
      this.municipioService.update(this.idMunicipioEditar!, this.municipioForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.cancelarEdicionMunicipio();
            this.cargarMunicipios();
            this.notificacionService.mostrar('Municipio actualizado exitosamente', 'success');
          },
          error: (err) => {
            console.error('Error al actualizar municipio:', err);
            this.notificacionService.mostrar('Error al actualizar el municipio', 'error');
          }
        });
    } else {
      this.municipioService.create(this.municipioForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.cancelarEdicionMunicipio();
            this.cargarMunicipios();
            this.notificacionService.mostrar('Municipio creado exitosamente', 'success');
          },
          error: (err) => {
            console.error('Error al crear municipio:', err);
            this.notificacionService.mostrar('Error al crear el municipio', 'error');
          }
        });
    }
  }

  editarMunicipio(id: number): void {
    const municipio = this.municipios.find(m => m.idMunicipio === id);
    if (!municipio) return;

    this.idMunicipioEditar = id;
    this.municipioForm.patchValue({
      nombre:      municipio.nombre,
      idProvincia: municipio.idProvincia
    });
  }

  cancelarEdicionMunicipio(): void {
    this.idMunicipioEditar = null;
    this.municipioForm.reset();
  }

  eliminarMunicipio(id: number): void {
    if (!confirm('¿Está seguro de eliminar este municipio?')) {
      return;
    }
    this.municipioService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.cargarMunicipios();
          this.notificacionService.mostrar('Municipio eliminado exitosamente', 'success');
        },
        error: (err) => {
          console.error('Error al eliminar municipio:', err);
          this.notificacionService.mostrar('Error al eliminar el municipio', 'error');
        }
      });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // Colegios
  // ════════════════════════════════════════════════════════════════════════════

  /** Filtra los municipios según la provincia seleccionada en el form de Colegio */
  onProvinciaColegioChange(event: Event): void {
    const idProvincia = +(event.target as HTMLSelectElement).value;
    this.provinciaSeleccionadaColegio = idProvincia || null;
    if (idProvincia) {
      this.municipiosFiltradosColegio = this.municipios.filter(m => m.idProvincia === idProvincia);
      this.colegioForm.get('idMunicipio')?.enable();
    } else {
      this.municipiosFiltradosColegio = [];
      this.colegioForm.get('idMunicipio')?.disable();
    }
    // Resetear municipio seleccionado al cambiar provincia
    this.colegioForm.patchValue({ idMunicipio: null });
  }

  cargarColegios(): void {
    this.cargandoColegios = true;
    this.colegioService.getAllColegios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.colegios = data;
          this.cargandoColegios = false;
        },
        error: (err) => {
          console.error('Error al cargar colegios:', err);
          this.notificacionService.mostrar('Error al cargar la lista de colegios', 'error');
          this.cargandoColegios = false;
        }
      });
  }

  guardarColegio(): void {
    if (this.colegioForm.invalid) {
      this.colegioForm.markAllAsTouched();
      return;
    }

    const esEdicion = this.idColegioEditar !== null;

    if (esEdicion) {
      this.colegioService.update(this.idColegioEditar!, this.colegioForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.cancelarEdicionColegio();
            this.cargarColegios();
            this.notificacionService.mostrar('Colegio actualizado exitosamente', 'success');
          },
          error: (err) => {
            console.error('Error al actualizar colegio:', err);
            this.notificacionService.mostrar('Error al actualizar el colegio', 'error');
          }
        });
    } else {
      this.colegioService.create(this.colegioForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.cancelarEdicionColegio();
            this.cargarColegios();
            this.notificacionService.mostrar('Colegio creado exitosamente', 'success');
          },
          error: (err) => {
            console.error('Error al crear colegio:', err);
            this.notificacionService.mostrar('Error al crear el colegio', 'error');
          }
        });
    }
  }

  editarColegio(id: number): void {
    const colegio = this.colegios.find(c => c.idColegio === id);
    if (!colegio) return;

    this.idColegioEditar = id;

    // Determinar provincia del municipio del colegio para pre-llenar el selector de provincia
    const municipio = this.municipios.find(m => m.idMunicipio === colegio.idMunicipio);
    if (municipio) {
      this.provinciaSeleccionadaColegio = municipio.idProvincia;
      this.municipiosFiltradosColegio = this.municipios.filter(
        m => m.idProvincia === municipio.idProvincia
      );
      this.colegioForm.get('idMunicipio')?.enable();
    }

    this.colegioForm.patchValue({
      nombre:      colegio.nombre,
      idMunicipio: colegio.idMunicipio
    });
  }

  cancelarEdicionColegio(): void {
    this.idColegioEditar = null;
    this.provinciaSeleccionadaColegio = null;
    this.municipiosFiltradosColegio = [];
    this.colegioForm.reset();
    this.colegioForm.get('idMunicipio')?.disable();
  }

  eliminarColegio(id: number): void {
    if (!confirm(
      '¿Está seguro de eliminar este colegio?\nSE ELIMINARÁN LAS EVALUACIONES DE ESTUDIANTES ASOCIADOS AL COLEGIO.'
    )) {
      return;
    }
    this.colegioService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.cargarColegios();
          this.notificacionService.mostrar('Colegio eliminado exitosamente', 'success');
        },
        error: (err) => {
          console.error('Error al eliminar colegio:', err);
          this.notificacionService.mostrar('Error al eliminar el colegio', 'error');
        }
      });
  }
}
