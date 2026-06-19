import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ResultadoDto } from '../../interfaces/resultado-interface';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../interfaces/auth.interface';
import { EstudianteService } from '../../services/estudiante.service';
import { ResultadoService } from '../../services/resultado.service';
import { ProvinciaService } from '../../services/provincia.service';
import { MunicipioService } from '../../services/municipio.service';
import { Provincia } from '../../interfaces/provincia-interface';
import { Municipio } from '../../interfaces/municipio-interface';
import { Facultad, FacultadService } from '../../services/facultad.service';
import { ColegioService } from '../../services/colegio.service';
import { Colegio } from '../../interfaces/colegio-interface';
import { ChasideService } from '../../services/chaside.service';
import { HollandService } from '../../services/holland.service';
import { NotificacionService } from '../../services/notificacion.service';
import { Estudiante } from '../../interfaces/estudiante-interface';
import { Chaside } from '../../interfaces/chaside-interface';
import { Holland } from '../../interfaces/holland-interface';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { debounceTime, distinctUntilChanged, forkJoin, Observable, Subject, of, takeUntil } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ModalEditarComponent } from './components/modal-editar/modal-editar.component';
import { ModalPerfilComponent } from './components/modal-perfil/modal-perfil.component';

@Component({
  selector: 'app-control-orientacion',
  templateUrl: './control-orientacion.component.html',
  styleUrls: ['./control-orientacion.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ToastrModule, ModalEditarComponent, ModalPerfilComponent],
  providers: [DatePipe, NotificacionService]
})
export class ControlOrientacionComponent implements OnInit, OnDestroy {
  // CONSTANTES Y UTILIDADES
  Math = Math;
  logoUrl = 'assets/escudo.png';
  logoUrlc = 'assets/umsac.png';
  logoIDRU = 'assets/idrdu.png';
  // ESTADO DE AUTENTICACIÃ“N
  isAuthenticated = false;
  loading: boolean = false;
  error: string = '';

  // Variables de filtros

  // ESTADO DE LA INTERFAZ
  exportando = false;
  searchQuery = '';
  private searchTerms = new Subject<string>();
  private destroy$ = new Subject<void>();

  // FORMULARIOS
  loginForm!: FormGroup;

  // GESTIÃ“N DE ESTUDIANTES
  estudiantes: Estudiante[] = [];
  estudiantesFiltrados: Estudiante[] = [];
  estudianteSeleccionado: Estudiante | null = null;
  resultadoEstudiante: ResultadoDto[] = [];
  resultados: ResultadoDto[] = [];
  todasLasFacultades: Facultad[] = [];

  // GESTIÃ“N DE SELECCIÃ“N MÃšLTIPLE
  estudiantesSeleccionados: Set<number> = new Set();
  todoSeleccionado = false;

  // OPCIONES PARA SELECTORES
  chasideOpciones: Chaside[] = [];
  hollandOpciones: Holland[] = [];
  facultadOpciones: Facultad[] = [];
  colegios: Colegio[] = [];
  colegiosFiltrados: Colegio[] = [];
  provincias: Provincia[] = [];
  municipiosPorProvincia: { [provinciaId: number]: Municipio[] } = {};
  municipios: Municipio[] = [];
  municipiosFiltrados: Municipio[] = [];
  // DATOS ADICIONALES PARA VISUALIZACIONES
  chasideData: Record<string, number> | null = null;
  hollandData: Record<string, number> | null = null;

  // CONFIGURACIÃ“N DE FILTROS
  opcionesFiltros = {
    provincias: [] as Provincia[],
    municipios: [] as Municipio[],
    colegios: [] as string[],
    cursos: [] as string[],
    fechasRegistro: [] as string[]
  };

  filtros = {
    provincia: '',
    municipio: '',
    colegio: '',
    curso: '',
    fecha: '',
    nombre: '',
    fechaInicio: '',
    fechaFin: ''
  };

  // CONFIGURACIÃ“N DE PAGINACIÃ“N
  paginacion = {
    paginaActual: 1,
    itemsPorPagina: 10,
    totalPaginas: 1
  };

  // CONFIGURACIÃ“N DE ORDENAMIENTO
  ordenamiento = {
    columna: 'nombre',
    direccion: 'asc' as 'asc' | 'desc'
  };

  // ESTADO DE MODALES
  modalEditarVisible = false;
  modalPerfilVisible = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private estudianteService: EstudianteService,
    private resultadoService: ResultadoService,
    private provinciaService: ProvinciaService,
    private municipioService: MunicipioService,
    private facultadService: FacultadService,
    private chasideService: ChasideService,
    private hollandService: HollandService,
    private colegioService: ColegioService,
    private datePipe: DatePipe,
    private notificacionService: NotificacionService,
    private router: Router
  ) {
    this.inicializarFormularios();
    this.configurarBusqueda();
  }

  // INICIALIZACIÃ“N

  private inicializarFormularios() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  private configurarBusqueda(): void {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.searchQuery = term;
      this.filtrarEstudiantes();
    });
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.estaAutenticado();
    // redirecciona a la vista de admin si tiene el rol de administrador
    if (this.isAuthenticated && this.authService.esAdministrador()){
      this.router.navigate(['/admin/configuracion']);
      return;
    }
    this.authService.obtenerEstadoAutenticacion().subscribe(estado => {
      this.isAuthenticated = estado;
      if (estado) {
        this.cargarDatos();
      }
    });
    
    if (this.isAuthenticated) {
      this.cargarDatos();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private cargarDatos(): void {
    this.cargarEstudiantes();
    this.cargarProvincias();
    this.cargarMunicipios();
    this.cargarfacultades();
    this.cargarColegios();
    this.cargarDatosParaResultados();
  }

  cargarColegios(): void {
    this.colegioService.getAllColegios().subscribe({
      next: (data) => {
        this.colegios = data;
        this.colegiosFiltrados = data;
        this.actualizarOpcionesFiltros();
        this.filtrarEstudiantes();
      },
      error: (err) => console.error('Error cargando colegios', err)
    });
  }



  // AUTENTICACIÃ“N

  enviarFormulario(): void {
    if (this.loginForm?.invalid) {
      return;
    }
    this.loading = true;
    this.error = '';

    const credenciales: LoginRequest = {
      username: this.loginForm?.controls['username'].value,
      password: this.loginForm?.controls['password'].value
    };

    this.authService.iniciarSesion(credenciales)
      .subscribe({
        next: (respuesta) => {

          if (respuesta.rol === "ADMINISTRADOR") {
            this.router.navigate(['/admin/configuracion']);
            return;
          }

          this.isAuthenticated = true;
          this.loading = false;
          this.cargarDatos();
        },
        error: () => {
          this.error = 'Credenciales invalidas. Por favor intente nuevamente.';
          this.loading = false;
        }
      });
  }

  // cerrarSesion(): void {
  //   this.authService.cerrarSesion().subscribe({
  //     next: () => {
  //       this.isAuthenticated = false;
  //     },
  //     error: (error) => {
  //       console.error('Error al cerrar sesion:', error);
  //       this.isAuthenticated = false;
  //     }
  //   });
  // }

  // CARGA DE DATOS

  cargarEstudiantes(): void {
    this.estudianteService.getAll().subscribe({
      next: (data) => {
        this.estudiantes = data;
        this.aplicarOrdenamiento();
        this.actualizarOpcionesFiltros();
        this.filtrarEstudiantes();
        this.calcularPaginacion();
        const idsActuales = data.map(e => e.idEstudiante);
        this.estudiantesSeleccionados.forEach(id => {
          if (!idsActuales.includes(id)) {
            this.estudiantesSeleccionados.delete(id);
          }
        });

        this.actualizarEstadoSeleccionTodos();
      },
      error: (err: Error) => {
        console.error('Error al cargar estudiantes', err);
        this.mostrarNotificacion('No se pudieron cargar los estudiantes', 'error');
        this.estudiantes = [];
        this.estudiantesFiltrados = [];
        this.authService.cerrarSesion().subscribe({
          next: () => {
            this.router.navigate(['/control-orientacion']);
          },
          error: () => {
            this.router.navigate(['/control-orientacion']);
          }
        });
      }

    });
  }

  cargarProvincias(): void {
    this.provinciaService.getProvincias().subscribe({
      next: (data) => {
        this.provincias = data;
        this.opcionesFiltros.provincias = this.provincias.map(p => ({
          nombre: p.nombre,
          idProvincia: p.idProvincia
        }));
      },
      error: (err) => console.error('Error cargando provincias', err)
    });
  }

  cargarMunicipios(): void {
    this.municipioService.getAllMunicipios().subscribe({
      next: (municipios: Municipio[]) => {
        this.municipios = municipios;
        this.municipiosPorProvincia = {};
        this.municipios.forEach(m => {
          if (!this.municipiosPorProvincia[m.idProvincia]) {
            this.municipiosPorProvincia[m.idProvincia] = [];
          }
          this.municipiosPorProvincia[m.idProvincia].push(m);
        });
        this.opcionesFiltros.municipios = this.municipios.map(m => ({
          nombre: m.nombre,
          idMunicipio: m.idMunicipio,
          idProvincia: m.idProvincia
        }));

        if (this.filtros.provincia) {
          this.onProvinciaChange(this.filtros.provincia);
        }
      },
      error: (err) => console.error('Error al cargar municipios', err)
    });
  }

  /**
   * Devuelve el nombre de un municipio dado su idMunicipio.
   * Busca primero en los datos HTTP cargados, luego en el servicio local.
   */
  getMunicipioNombre(idMunicipio: number): string {
    // Primero buscar en los datos cargados por HTTP (tienen prioridad)
    const municipioHttp = this.municipios.find(m => m.idMunicipio === idMunicipio);
    if (municipioHttp) return municipioHttp.nombre;
    return 'Desconocido';
  }

  getColegioNombre(idColegio: number | null): string {
    if (idColegio === null) return 'Desconocido';
    const colegioHttp = this.colegios.find(c => c.idColegio === idColegio);
    if (colegioHttp) return colegioHttp.nombre;
    return 'Desconocido';
  }



  getProvinciaByMunicipio(municipioId: number): Provincia | null {
    for (const provinciaId in this.municipiosPorProvincia) {
      const municipio = this.municipiosPorProvincia[+provinciaId].find((m: Municipio) => Number(m.idMunicipio) === Number(municipioId));
      if (municipio) {
        return this.provincias.find(p => p.idProvincia === +provinciaId) ?? null;
      }
    }
    const idProv = this.municipios.find((m: Municipio) => Number(m.idMunicipio) === Number(municipioId))?.idProvincia ?? null;
    if (idProv !== null) {
      return this.provincias.find(p => p.idProvincia === idProv) ?? null;
    }
    return null;
  }

  cargarDatosParaResultados(): void {
    forkJoin({
      chaside: this.chasideService.getAll(),
      holland: this.hollandService.getAll(),
      facultad: this.facultadService.getAll()
    }).subscribe({
      next: (resultado) => {
        this.chasideOpciones = resultado.chaside;
        this.hollandOpciones = resultado.holland;
        this.facultadOpciones = resultado.facultad;
      },
      error: (err) => {
        console.error('Error al cargar opciones para resultados', err);
        this.mostrarNotificacion('Error al cargar datos necesarios para resultados', 'error');
      }
    });
  }

  cargarfacultades() {
    this.facultadService.getAll().subscribe(facultades => {
      this.todasLasFacultades = facultades.map(f => ({
        ...f,
        carreras: typeof f.carreras === 'string' ? JSON.parse(f.carreras) : f.carreras,
        chaside: f.idChaside || 0
      }));
    });
  }



  // GESTIÃ“N DE FILTROS

  actualizarOpcionesFiltros(): void {
    this.opcionesFiltros.municipios = this.municipios ? this.municipios.map(m => ({
      nombre: m.nombre,
      idMunicipio: m.idMunicipio,
      idProvincia: m.idProvincia
    })) : [];

    this.opcionesFiltros.colegios = this.colegios ? Array.from(
      new Set(this.colegios.map(c => c.nombre))
    ).sort() : [];

    this.opcionesFiltros.cursos = Array.from(
      new Set(this.estudiantes.map(e => e.curso || 'No especificado'))
    );

    this.opcionesFiltros.fechasRegistro = Array.from(
      new Set(this.estudiantes.map(e => this.formatDate(e.createdAt || new Date().toISOString())))
    );
  }
  onProvinciaChange(idProvincia: string): void {
    this.filtros.provincia = idProvincia;
    this.opcionesFiltros.municipios = this.municipios.map(m => ({
      nombre: m.nombre,
      idMunicipio: m.idMunicipio,
      idProvincia: m.idProvincia
    }));

    this.filtrarEstudiantes();
  }

  aplicarFiltro(tipo: keyof typeof this.filtros, valor: string): void {
    this.filtros[tipo] = valor;

    // Autollenar la provincia si se selecciona un municipio
    if (tipo === 'municipio' && valor) {
      const municipioIdNumerico = parseInt(valor, 10);
      const municipioSeleccionado = this.municipios.find(m => m.idMunicipio === municipioIdNumerico);

      if (municipioSeleccionado && municipioSeleccionado.idProvincia) {
        this.filtros.provincia = municipioSeleccionado.idProvincia.toString();
      }
    }

    this.filtrarEstudiantes();
    this.paginacion.paginaActual = 1;
  }

  limpiarTodosFiltros(): void {
    this.filtros = {
      provincia: '',
      municipio: '',
      colegio: '',
      curso: '',
      fecha: '',
      nombre: '',
      fechaInicio: '',
      fechaFin: ''
    };
    this.searchQuery = '';
    this.filtrarEstudiantes();
  }

  aplicarFiltroFecha(): void {
    if (this.filtros.fechaInicio && this.filtros.fechaFin) {
      const inicio = new Date(this.filtros.fechaInicio);
      const fin = new Date(this.filtros.fechaFin);
      if (fin < inicio) {
        this.mostrarNotificacion('La fecha final debe ser mayor o igual a la fecha inicial', 'error');
        return;
      }
    }
    this.filtrarEstudiantes();
  }
  filtrarEstudiantes(): void {
    let resultados = [...this.estudiantes];

    // Filtro de busqueda global
    if (this.searchQuery) {
      const busqueda = this.searchQuery.toLowerCase();
      resultados = resultados.filter(estudiante =>
        (estudiante.nombre || '').toLowerCase().includes(busqueda) ||
        (estudiante.apPaterno || '').toLowerCase().includes(busqueda) ||
        (estudiante.apMaterno || '').toLowerCase().includes(busqueda) ||
        (estudiante.ciEstudiante || '').toLowerCase().includes(busqueda) ||
        (this.getColegioNombre(estudiante.idColegio)).toLowerCase().includes(busqueda)
      );
    }

    if (this.filtros.provincia) {
      const idProvincia = Number(this.filtros.provincia);
      const municipiosEnProvincia: number[] = [
        ...(this.municipiosPorProvincia[idProvincia]?.map((m: Municipio) => m.idMunicipio) ?? []),
        ...this.municipios.filter(m => m.idProvincia === idProvincia).map(m => m.idMunicipio)
      ].filter((v, i, a) => a.indexOf(v) === i); // deduplicar
      resultados = resultados.filter(estudiante => {
        const idMun = estudiante.idMunicipio ?? estudiante.idMunicipio;
        return municipiosEnProvincia.includes(Number(idMun));
      });
    }

    if (this.filtros.municipio) {
      const idMunicipioFiltro = Number(this.filtros.municipio);
      resultados = resultados.filter(estudiante => {
        const idMun = estudiante.idMunicipio ?? estudiante.idMunicipio;
        return Number(idMun) === idMunicipioFiltro;
      });
    }

    // Filtros institucionales
    if (this.filtros.colegio) {
      resultados = resultados.filter(estudiante => this.getColegioNombre(estudiante.idColegio) === this.filtros.colegio);
    }

    if (this.filtros.curso) {
      resultados = resultados.filter(estudiante =>
        (estudiante.curso || 'No especificado') === this.filtros.curso
      );
    }

    // Filtros temporales
    if (this.filtros.fecha) {
      resultados = resultados.filter(estudiante =>
        this.formatDate(estudiante.createdAt || '') === this.filtros.fecha
      );
    }

    if (this.filtros.fechaInicio && this.filtros.fechaFin) {
      const fechaInicio = new Date(this.filtros.fechaInicio);
      const fechaFin = new Date(this.filtros.fechaFin);
      fechaFin.setHours(23, 59, 59);

      resultados = resultados.filter(estudiante => {
        if (!estudiante.createdAt) return false;
        const fechaEstudiante = new Date(estudiante.createdAt);
        return fechaEstudiante >= fechaInicio && fechaEstudiante <= fechaFin;
      });
    }

    this.estudiantesFiltrados = resultados;
    this.calcularPaginacion();
    const idsVisibles = this.estudiantesFiltrados.map(e => e.idEstudiante);
    this.estudiantesSeleccionados.forEach(id => {
      if (!idsVisibles.includes(id)) {
        this.estudiantesSeleccionados.delete(id);
      }
    });

    this.actualizarEstadoSeleccionTodos();
  }

  buscarGlobal(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.filtrarEstudiantes();
    this.paginacion.paginaActual = 1;
  }

  // PAGINACIÃ“N Y ORDENAMIENTO

  aplicarOrdenamiento(): void {
    this.estudiantes.sort((a, b) => {
      let valorA: string | number | null | undefined;
      let valorB: string | number | null | undefined;
      if (this.ordenamiento.columna === 'apellidos') {
        valorA = `${a.apPaterno || ''} ${a.apMaterno || ''}`.toLowerCase();
        valorB = `${b.apPaterno || ''} ${b.apMaterno || ''}`.toLowerCase();
      } else {
        valorA = (a as Record<string, any>)[this.ordenamiento.columna] !== undefined ? (a as Record<string, any>)[this.ordenamiento.columna] : '';
        valorB = (b as Record<string, any>)[this.ordenamiento.columna] !== undefined ? (b as Record<string, any>)[this.ordenamiento.columna] : '';
      }

      if (valorA == null) valorA = '';
      if (valorB == null) valorB = '';

      if (typeof valorA === 'string') valorA = valorA.toLowerCase();
      if (typeof valorB === 'string') valorB = valorB.toLowerCase();

      if (valorA < valorB) return this.ordenamiento.direccion === 'asc' ? -1 : 1;
      if (valorA > valorB) return this.ordenamiento.direccion === 'asc' ? 1 : -1;
      return 0;
    });

    this.filtrarEstudiantes();
  }

  ordenarPor(columna: string): void {
    if (this.ordenamiento.columna === columna) {
      this.ordenamiento.direccion = this.ordenamiento.direccion === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenamiento.columna = columna;
      this.ordenamiento.direccion = 'asc';
    }
    this.aplicarOrdenamiento();
  }

  calcularPaginacion(): void {
    this.paginacion.totalPaginas = Math.ceil(this.estudiantesFiltrados.length / this.paginacion.itemsPorPagina);
    if (this.paginacion.paginaActual > this.paginacion.totalPaginas) {
      this.paginacion.paginaActual = this.paginacion.totalPaginas || 1;
    }
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.paginacion.totalPaginas) {
      this.paginacion.paginaActual = pagina;
    }
    this.actualizarEstadoSeleccionTodos();
  }

  get estudiantesPaginados(): Estudiante[] {
    const inicio = (this.paginacion.paginaActual - 1) * this.paginacion.itemsPorPagina;
    const fin = inicio + this.paginacion.itemsPorPagina;
    return this.estudiantesFiltrados.slice(inicio, fin);
  }

  cambiarItemsPorPagina(items: number): void {
    this.paginacion.itemsPorPagina = items;
    this.paginacion.paginaActual = 1;
    this.calcularPaginacion();
  }

  // UTILIDADES

  formatDate(dateString: string): string {
    if (!dateString) return 'No especificado';
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  formatearFechaParaInput(fechaString: string): string {
    if (!fechaString) return '';
    const fecha = new Date(fechaString);
    return fecha.toISOString().slice(0, 16);
  }

  mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'info' | 'warning'): void {
    this.notificacionService.mostrar(mensaje, tipo);
  }

  // GESTIÃ“N DE ESTUDIANTES

  eliminarEstudiante(id: number | null): void {
    if (id === null) return;
    Swal.fire({
      title: 'Â¿Estas seguro?',
      text: 'Esta accion no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      background: '#f7f7f7',
      color: '#333',
      buttonsStyling: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.estudianteService.delete(id).subscribe({
          next: () => {
            this.cargarEstudiantes();
            this.notificacionService.mostrar('Estudiante eliminado exitosamente', 'success');
          },
          error: (err) => {
            console.error('Error al eliminar estudiante', err);
            this.notificacionService.mostrar('Error al eliminar estudiante', 'error');
          }
        });
      }
    });
  }
  // MÃ‰TODOS PARA SELECCIÃ“N MÃšLTIPLE

  toggleSeleccionTodos(): void {
    this.todoSeleccionado = !this.todoSeleccionado;

    if (this.todoSeleccionado) {
      // Seleccionar todos los estudiantes de la pagina actual
      this.estudiantesPaginados.forEach(estudiante => {
        this.estudiantesSeleccionados.add(estudiante.idEstudiante!);
      });
    } else {
      // Deseleccionar todos
      this.estudiantesSeleccionados.clear();
    }
  }

  toggleSeleccionEstudiante(idEstudiante: number | null): void {
    if (idEstudiante === null) return;
    if (this.estudiantesSeleccionados.has(idEstudiante)) {
      this.estudiantesSeleccionados.delete(idEstudiante);
    } else {
      this.estudiantesSeleccionados.add(idEstudiante);
    }
    this.actualizarEstadoSeleccionTodos();
  }

  actualizarEstadoSeleccionTodos(): void {
    const estudiantesPaginaActual = this.estudiantesPaginados.map(e => e.idEstudiante!);
    this.todoSeleccionado = estudiantesPaginaActual.length > 0 &&
      estudiantesPaginaActual.every(id => this.estudiantesSeleccionados.has(id));
  }

  estaSeleccionado(idEstudiante: number | null): boolean {
    if (idEstudiante === null) return false;
    return this.estudiantesSeleccionados.has(idEstudiante);
  }

  get tieneEstudiantesSeleccionados(): boolean {
    return this.estudiantesSeleccionados.size > 0;
  }

  eliminarEstudiantesSeleccionados(): void {
    const cantidad = this.estudiantesSeleccionados.size;

    Swal.fire({
      title: 'Â¿Estas seguro?',
      text: `Se eliminaran ${cantidad} estudiante${cantidad > 1 ? 's' : ''}. Esta accion no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      background: '#f7f7f7',
      color: '#333',
      buttonsStyling: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const idsAEliminar = Array.from(this.estudiantesSeleccionados);

        // Crear observables para cada eliminacion
        const eliminaciones = idsAEliminar.map(id =>
          this.estudianteService.delete(id)
        );

        // Ejecutar todas las eliminaciones en paralelo
        forkJoin(eliminaciones).subscribe({
          next: () => {
            this.cargarEstudiantes();
            this.estudiantesSeleccionados.clear();
            this.todoSeleccionado = false;
            this.notificacionService.mostrar(
              `${cantidad} estudiante${cantidad > 1 ? 's eliminados' : ' eliminado'} exitosamente`,
              'success'
            );
          },
          error: (err) => {
            console.error('Error al eliminar estudiantes', err);
            this.notificacionService.mostrar('Error al eliminar algunos estudiantes', 'error');
            this.cargarEstudiantes();
            this.estudiantesSeleccionados.clear();
            this.todoSeleccionado = false;
          }
        });
      }
    });
  }


  abrirModalEditar(estudiante: Estudiante): void {
    this.estudianteSeleccionado = estudiante;
    this.loading = true;

    this.resultadoService.getByEstudianteId(estudiante.idEstudiante!).subscribe({
      next: (resultados: ResultadoDto[]) => {
        this.resultados = resultados;
        this.modalEditarVisible = true;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar resultados del estudiante', err);
        this.mostrarNotificacion('No se pudieron cargar los resultados de orientacion', 'error');
        this.resultados = [];
        this.modalEditarVisible = true;
        this.loading = false;
      }
    });
  }

  cerrarModalEditar(): void {
    this.modalEditarVisible = false;
    this.estudianteSeleccionado = null;
  }

  onSavedEstudiante(): void {
    this.cerrarModalEditar();
    this.cargarEstudiantes();
  }

  verPerfilEstudiante(id: number | null): void {
    if (id === null) return;
    this.loading = true;

    this.estudianteService.getById(id).subscribe({
      next: (estudiante) => {
        this.estudianteSeleccionado = estudiante;

        this.resultadoService.getByEstudianteId(id).subscribe({
          next: (resultados) => {
            if (resultados.length === 0) {
              this.resultadoEstudiante = [];
              this.modalPerfilVisible = true;
              this.loading = false;
              return;
            }

            // Procesar resultados para obtener datos adicionales
            const resultadosPromesas = resultados.map((resultado: ResultadoDto) => {
              const promesas = [];

              // Solo buscar datos de Chaside y Holland si no los tenemos
              if (resultado.idChaside) {
                promesas.push(
                  this.chasideService.getById(resultado.idChaside).toPromise()
                    .then(chaside => ({ tipo: 'chaside', data: chaside }))
                    .catch(() => ({ tipo: 'chaside', data: null }))
                );
              }

              if (resultado.idHolland) {
                promesas.push(
                  this.hollandService.getById(resultado.idHolland).toPromise()
                    .then(holland => ({ tipo: 'holland', data: holland }))
                    .catch(() => ({ tipo: 'holland', data: null }))
                );
              }

              return Promise.all(promesas).then(datosAdicionales => {
                const resultadoCompleto = { ...resultado };
                datosAdicionales.forEach(item => {
                  if (item.tipo === 'chaside') {
                    resultadoCompleto.chaside = item.data;
                  } else if (item.tipo === 'holland') {
                    resultadoCompleto.holland = item.data;
                  }
                });

                if (resultado.idChaside && this.todasLasFacultades?.length > 0) {
                  const facultadesRelacionadas = this.todasLasFacultades.filter(
                    facultad => facultad.chaside === resultado.idChaside
                  );
                  resultadoCompleto.facultad = facultadesRelacionadas[0] || undefined;
                  resultadoCompleto.facultades = facultadesRelacionadas;
                } else {
                  resultadoCompleto.facultad = undefined;
                  resultadoCompleto.facultades = [];
                }
                return resultadoCompleto;
              });
            });

            Promise.all(resultadosPromesas)
              .then(resultadosFinales => {
                this.resultadoEstudiante = resultadosFinales;
                const primerChaside = resultadosFinales.find(r => r.chaside);
                if (primerChaside) {
                  this.chasideData = primerChaside.chaside;
                }

                const primerHolland = resultadosFinales.find(r => r.holland);
                if (primerHolland) {
                  this.hollandData = primerHolland.holland;
                }

                this.modalPerfilVisible = true;
                this.loading = false;
              })
              .catch(err => {
                console.error('Error al procesar los resultados', err);
                this.mostrarNotificacion('Hubo un error al procesar los resultados', 'error');
                this.resultadoEstudiante = resultados;
                this.modalPerfilVisible = true;
                this.loading = false;
              });
          },
          error: (err) => {
            console.error('Error al cargar resultados del estudiante', err);
            this.mostrarNotificacion('No se pudieron cargar los resultados de orientacion vocacional', 'error');
            this.modalPerfilVisible = true;
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar datos del estudiante', err);
        this.mostrarNotificacion('No se pudo cargar la informacion del estudiante', 'error');
        this.loading = false;
      }
    });
  }
  cerrarModalPerfil(): void {
    this.modalPerfilVisible = false;
    this.estudianteSeleccionado = null;
    this.resultadoEstudiante = [];
    this.chasideData = null;
    this.hollandData = null;
    setTimeout(() => {
      document.body.focus();
    }, 0);
  }
  // EXPORTACIÃ“N

  exportarEstudiantes(formato: 'excel' | 'pdf'): void {
    this.exportando = true;

    if (formato === 'excel') {
      this.exportarExcel();
    } else {
      this.exportarPDF();
    }
  }

  private async exportarExcel(): Promise<void> {
    try {
      this.exportando = true;
      const datosParaExportar = await Promise.all(
        this.estudiantesFiltrados.map(async (est) => {
          const resultados = await this.resultadoService.getByEstudianteId(est.idEstudiante!).toPromise();
          let datosResultado = {
            'Test Realizado': 'No',
            'Fecha Test': '',
            'Puntaje Interes': '',
            'Puntaje Aptitud': '',
            'CHASIDE - Codigo': '',
            'CHASIDE - Descripcion': '',
            'Holland - Codigo': '',
            'Holland - Tipo': '',
            'Holland - Descripcion': '',
            'Facultades Recomendadas': '',
            'Carreras Relacionadas': ''
          };

          if (resultados && resultados.length > 0) {
            const resultado = resultados[0];

            datosResultado['Test Realizado'] = 'Si';
            datosResultado['Fecha Test'] = resultado.fecha ? this.formatDate(resultado.fecha) : '';
            datosResultado['Puntaje Interes'] = resultado.interes?.toString() || '';
            datosResultado['Puntaje Aptitud'] = resultado.aptitud?.toString() || '';
            if (resultado.idChaside) {
              try {
                const chaside = await this.chasideService.getById(resultado.idChaside).toPromise();
                datosResultado['CHASIDE - Codigo'] = chaside?.codigo || '';
                datosResultado['CHASIDE - Descripcion'] = chaside?.descripcion || '';
                if (this.todasLasFacultades && this.todasLasFacultades.length > 0) {
                  const facultadesRelacionadas = this.todasLasFacultades.filter(
                    fac => fac.chaside === resultado.idChaside
                  );

                  datosResultado['Facultades Recomendadas'] = facultadesRelacionadas
                    .map(fac => fac.nombre)
                    .join('; ');
                  const todasLasCarreras = facultadesRelacionadas
                    .flatMap(fac => fac.carreras || [])
                    .filter((carrera, index, arr) => arr.indexOf(carrera) === index)
                    .sort();

                  datosResultado['Carreras Relacionadas'] = todasLasCarreras.join('; ');
                }
              } catch (error) {
                console.error('Error al obtener datos de CHASIDE:', error);
              }
            }
            if (resultado.idHolland) {
              try {
                const holland = await this.hollandService.getById(resultado.idHolland).toPromise();
                datosResultado['Holland - Codigo'] = resultado.puntajeHolland || '';
                datosResultado['Holland - Tipo'] = holland?.nombre || '';
                datosResultado['Holland - Descripcion'] = holland?.descripcion || '';
              } catch (error) {
                console.error('Error al obtener datos de Holland:', error);
              }
            }
          }

          return {
            'CI': est.ciEstudiante,
            'Nombre': est.nombre,
            'Apellido Paterno': est.apPaterno,
            'Apellido Materno': est.apMaterno,
            'Colegio': est.colegio,
            'Curso': est.curso,
            'Edad': est.edad,
            'Celular': est.celular,
            'Fecha Registro': est.createdAt ? this.formatDate(est.createdAt) : 'No especificada',
            ...datosResultado
          };
        })
      );

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExportar);
      const workbook: XLSX.WorkBook = XLSX.utils.book_new();
      const infoSheet = XLSX.utils.aoa_to_sheet([
        ['UNIVERSIDAD MAYOR DE SAN ANDRÃ‰S'],
        ['INSTITUTO DE DESARROLLO REGIONAL Y DESCONCENTRACIÃ“N UNIVERSITARIA'],
        [''],
        ['Sistema de Orientacion Vocacional - Reporte Completo de Estudiantes'],
        [''],
        ['Fecha de generacion: ' + this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm')],
        [''],
        ['Filtros aplicados:']
      ]);

      let rowIndex = 8;
      let hayFiltros = false;

      if (this.filtros.provincia) {
        const provincia = this.provincias.find(p => p.idProvincia === parseInt(this.filtros.provincia));
        XLSX.utils.sheet_add_aoa(infoSheet, [[`Provincia: ${provincia?.nombre || this.filtros.provincia}`]], { origin: { r: rowIndex++, c: 0 } });
        hayFiltros = true;
      }

      if (this.filtros.municipio) {
        const municipio = this.opcionesFiltros.municipios.find(m => m.idMunicipio === parseInt(this.filtros.municipio));
        XLSX.utils.sheet_add_aoa(infoSheet, [[`Municipio: ${municipio?.nombre || this.filtros.municipio}`]], { origin: { r: rowIndex++, c: 0 } });
        hayFiltros = true;
      }

      if (this.filtros.colegio) {
        XLSX.utils.sheet_add_aoa(infoSheet, [[`Colegio: ${this.filtros.colegio}`]], { origin: { r: rowIndex++, c: 0 } });
        hayFiltros = true;
      }

      if (this.filtros.curso) {
        XLSX.utils.sheet_add_aoa(infoSheet, [[`Curso: ${this.filtros.curso}`]], { origin: { r: rowIndex++, c: 0 } });
        hayFiltros = true;
      }

      if (this.filtros.fechaInicio && this.filtros.fechaFin) {
        XLSX.utils.sheet_add_aoa(infoSheet, [[`Periodo: ${this.filtros.fechaInicio} - ${this.filtros.fechaFin}`]], { origin: { r: rowIndex++, c: 0 } });
        hayFiltros = true;
      }

      if (!hayFiltros) {
        XLSX.utils.sheet_add_aoa(infoSheet, [['Sin filtros aplicados']], { origin: { r: rowIndex++, c: 0 } });
      }

      const estudiantesConTest = datosParaExportar.filter(est => est['Test Realizado'] === 'Si').length;
      const estudiantesSinTest = datosParaExportar.length - estudiantesConTest;

      XLSX.utils.sheet_add_aoa(infoSheet, [
        [''],
        [`Total registros: ${this.estudiantesFiltrados.length}`],
        [`Estudiantes con test: ${estudiantesConTest}`],
        [`Estudiantes sin test: ${estudiantesSinTest}`],
        [''],
        ['Descripcion de columnas:'],
        ['- Test Realizado: Indica si el estudiante completo el test de orientacion'],
        ['- CHASIDE: Test de intereses profesionales (C=Ciencias, H=Humanidades, A=Arte, S=Servicio Social, I=Informatica, D=Derecho, E=Empresa)'],
        ['- Holland: Test de personalidad vocacional (R=Realista, I=Investigativo, A=Artistico, S=Social, E=Emprendedor, C=Convencional)'],
        ['- Facultades Recomendadas: Facultades de la UMSA relacionadas con el perfil CHASIDE'],
        ['- Carreras Relacionadas: Carreras disponibles en las facultades recomendadas'],
        [''],
        [' https://www.facebook.com/IDR.DU.UMSA'],
        [''],
        ['Contacto IDRDU:(591) 2-2118556'],
        ['Telefono - Fax (591) 2-2118556 - IP (591) 2-2612211'],
        ['E-mail:idrdu@umsa.bo'],
        ['Av. 6 de Agosto. Edificio HOY Nro. 2170 Piso 12']
      ], { origin: { r: rowIndex, c: 0 } });

      infoSheet['!merges'] = [
        { s: { c: 0, r: 0 }, e: { c: 9, r: 0 } },
        { s: { c: 0, r: 1 }, e: { c: 9, r: 1 } },
        { s: { c: 0, r: 3 }, e: { c: 9, r: 3 } }
      ];

      infoSheet['!cols'] = [{ wch: 80 }];
      XLSX.utils.book_append_sheet(workbook, infoSheet, 'Informacion');
      const columnas = [
        { wch: 15 }, // CI
        { wch: 20 }, // Nombre
        { wch: 20 }, // Apellido Paterno
        { wch: 20 }, // Apellido Materno
        { wch: 30 }, // Colegio
        { wch: 15 }, // Curso
        { wch: 10 }, // Edad
        { wch: 15 }, // Celular
        { wch: 20 }, // Fecha Registro
        { wch: 15 }, // Test Realizado
        { wch: 20 }, // Fecha Test
        { wch: 15 }, // Puntaje Interes
        { wch: 15 }, // Puntaje Aptitud
        { wch: 15 }, // CHASIDE - Codigo
        { wch: 50 }, // CHASIDE - Descripcion
        { wch: 15 }, // Holland - Codigo
        { wch: 20 }, // Holland - Tipo
        { wch: 50 }, // Holland - Descripcion
        { wch: 60 }, // Facultades Recomendadas
        { wch: 80 }  // Carreras Relacionadas
      ];
      worksheet['!cols'] = columnas;
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Estudiantes');
      const resumenData = this.generarResumenEstadistico(datosParaExportar);
      const resumenSheet = XLSX.utils.json_to_sheet(resumenData);
      resumenSheet['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(workbook, resumenSheet, 'Resumen Estadistico');
      const fechaActual = new Date().toISOString().split('T')[0];
      XLSX.writeFile(workbook, `orientacion_vocacional_completo_umsa_${fechaActual}.xlsx`);

      this.exportando = false;
      this.mostrarNotificacion('Reporte completo exportado en formato Excel correctamente', 'success');
    } catch (error) {
      console.error('Error al exportar Excel completo', error);
      this.exportando = false;
      this.mostrarNotificacion('Error al exportar el reporte completo en Excel', 'error');
    }
  }

  private generarResumenEstadistico(datos: Record<string, unknown>[]): Record<string, unknown>[] {
    const resumen = [];

    // Estadisticas generales
    resumen.push({ 'Concepto': 'ESTADÃSTICAS GENERALES', 'Cantidad': '', 'Porcentaje': '' });
    resumen.push({ 'Concepto': 'Total de estudiantes', 'Cantidad': datos.length, 'Porcentaje': '100%' });

    const conTest = datos.filter(d => d['Test Realizado'] === 'Si').length;
    const sinTest = datos.length - conTest;

    resumen.push({
      'Concepto': 'Con test completado',
      'Cantidad': conTest,
      'Porcentaje': `${((conTest / datos.length) * 100).toFixed(1)}%`
    });
    resumen.push({
      'Concepto': 'Sin test completado',
      'Cantidad': sinTest,
      'Porcentaje': `${((sinTest / datos.length) * 100).toFixed(1)}%`
    });

    // Estadisticas por CHASIDE
    resumen.push({ 'Concepto': '', 'Cantidad': '', 'Porcentaje': '' });
    resumen.push({ 'Concepto': 'DISTRIBUCIÃ“N POR CHASIDE', 'Cantidad': '', 'Porcentaje': '' });

    const chasideStats: { [codigo: string]: number } = {};
    datos.forEach((d: Record<string, any>) => {
      if (d['CHASIDE - Codigo']) {
        const codigo = d['CHASIDE - Codigo'] as string;
        chasideStats[codigo] = (chasideStats[codigo] || 0) + 1;
      }
    });

    Object.entries(chasideStats).forEach(([codigo, cantidad]) => {
      resumen.push({
        'Concepto': `CHASIDE ${codigo}`,
        'Cantidad': cantidad,
        'Porcentaje': `${(((cantidad as number) / conTest) * 100).toFixed(1)}%`
      });
    });

    // Estadisticas por Holland
    resumen.push({ 'Concepto': '', 'Cantidad': '', 'Porcentaje': '' });
    resumen.push({ 'Concepto': 'DISTRIBUCIÃ“N POR HOLLAND', 'Cantidad': '', 'Porcentaje': '' });

    const hollandStats: { [key: string]: number } = {};
    datos.forEach((d: Record<string, any>) => {
      if (d['Holland - Tipo']) {
        const tipo = d['Holland - Tipo'] as string;
        hollandStats[tipo] = (hollandStats[tipo] || 0) + 1;
      }
    });

    Object.entries(hollandStats).forEach(([tipo, cantidad]) => {
      resumen.push({
        'Concepto': `Holland ${tipo}`,
        'Cantidad': cantidad,
        'Porcentaje': `${(((cantidad as number) / conTest) * 100).toFixed(1)}%`
      });
    });

    return resumen;
  }

  private async exportarPDF(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {

      try {
        this.exportando = true;
        await import('jspdf-autotable');
        const doc = new jsPDF('landscape', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10;
        let y = 15;
        const logoUmsaColor = 'assets/umsac.png';
        const logoIDRUColor = 'assets/idrdu.png';
        const logoUMSA = await this.cargarImagen(logoUmsaColor);
        const logoIDRDU = await this.cargarImagen(logoIDRUColor);
        const agregarEncabezado = (logoUMSA: string | null, logoIDRDU: string | null) => {
          // === ===
          const anchoPagina = doc.internal.pageSize.getWidth();
          const margen = 10;
          const anchoLogo = 16;
          const altoLogo = 16;

          // === Estilos ===
          const fuenteNormal = 'helvetica';
          const fuenteNegrita = 'helvetica';
          const estiloNormal = 'normal';
          const estiloNegrita = 'bold';

          const tamTitulo = 10;
          const tamSubtitulo = 10;
          const colorTitulo: [number, number, number] = [0, 54, 107];
          const colorTexto: [number, number, number] = [0, 54, 107];

          // === Textos ===
          const textoUMSA = 'UNIVERSIDAD MAYOR DE SAN ANDRÉS';
          const textoVicerrectorado = 'VICERRECTORADO';
          const textoInstituto = 'INSTITUTO DE DESARROLLO REGIONAL Y DESCONCENTRACIÓN UNIVERSITARIA';

          // === posicionamiento ===
          y = margen + 5;

          // === logos ===
          if (logoUMSA) doc.addImage(logoUMSA, 'PNG', margen, margen, anchoLogo, altoLogo);
          if (logoIDRDU) doc.addImage(logoIDRDU, 'PNG', anchoPagina - margen - anchoLogo - 5, margen, anchoLogo, altoLogo);

          // === umsa ===
          doc.setFont(fuenteNormal, estiloNormal);
          doc.setFontSize(tamTitulo);
          doc.setTextColor(...colorTitulo);
          doc.text(textoUMSA, anchoPagina / 2, y, { align: 'center' });

          // === vicerectorado ===
          y += 4;
          doc.setFontSize(tamSubtitulo);
          doc.setTextColor(...colorTexto);
          doc.text(textoVicerrectorado, anchoPagina / 2, y, { align: 'center' });

          // === Lineas ===
          y += 1;
          const anchoTexto = doc.getTextWidth(textoInstituto) + 3;
          const inicioLinea = (anchoPagina - anchoTexto) / 2;
          const finLinea = inicioLinea + anchoTexto;
          doc.setDrawColor(...colorTitulo)
          doc.setLineWidth(0.3);
          doc.line(inicioLinea, y, finLinea, y);
          doc.line(inicioLinea, y + 0.75, finLinea, y + 0.75);

          // === instituto ===
          y += 4.5;
          doc.setFont(fuenteNegrita, estiloNegrita);
          doc.setTextColor(...colorTexto);
          doc.text(textoInstituto, anchoPagina / 2, y, { align: 'center' });

          y += 10;
        };

        const agregarPiePagina = () => {
          // === tamano pagina ===
          const anchoPagina = doc.internal.pageSize.getWidth();
          const altoPagina = doc.internal.pageSize.getHeight();

          // ===estilo ===
          const fuente = 'helvetica';
          const estilo = 'normal';
          const tamanoFuente = 8;
          const colorTexto: [number, number, number] = [0, 54, 107];

          // === texto ===
          const textoLinea1 = 'Av. 6 de Agosto 2170 · Edificio Hoy Piso 12 · Teléfono - Fax (591) 2-2118556 · IP (591) 2-2612211';
          const textoLinea2 = 'e-mail: idrdu@umsa.bo · https://www.facebook.com/IDR.DU.UMSA';
          const fechaGeneracion = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm');

          // === estilos ===
          doc.setTextColor(...colorTexto);
          doc.setFont(fuente, estilo);
          doc.setFontSize(tamanoFuente);

          // === texto ===
          doc.text(textoLinea1, anchoPagina / 2, altoPagina - 12, { align: 'center' });
          doc.text(textoLinea2, anchoPagina / 2, altoPagina - 8, { align: 'center' });
        };
        const agregarMarcaDeAgua = async (logoIDRDU: string | null) => {
          if (!logoIDRDU) return;

          // === Dimensiones de la pagina ===
          const anchoPagina = doc.internal.pageSize.getWidth();
          const altoPagina = doc.internal.pageSize.getHeight();

          // === tamano de la marca de agua ===
          const anchoMarcaAgua = 100;
          const altoMarcaAgua = 100;

          // === centro ===
          const posX = (anchoPagina - anchoMarcaAgua) / 2;
          const posY = (altoPagina - altoMarcaAgua) / 2;

          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            const img = new Image();
            await new Promise<void>((resolve, reject) => {
              img.onload = () => {
                canvas.width = img.naturalWidth || 200;
                canvas.height = img.naturalHeight || 200;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 0.15;
                ctx.drawImage(img, 0, 0);

                resolve();
              };

              img.onerror = () => reject(new Error('Error al cargar imagen'));
              img.src = logoIDRDU;
            });
            const imagenConOpacidad = canvas.toDataURL('image/png');
            doc.addImage(imagenConOpacidad, 'PNG', posX, posY, anchoMarcaAgua, altoMarcaAgua);

          } catch (error) {
            console.warn('Error al crear marca de agua:', error);
            doc.addImage(logoIDRDU, 'PNG', posX, posY, anchoMarcaAgua * 0.8, altoMarcaAgua * 0.8);
          }
        };
        // Encabezado
        const colorAzulUMSA: [number, number, number] = [0, 51, 153];
        const colorVinoUMSA: [number, number, number] = [128, 0, 32];
        const colorAzulClaro: [number, number, number] = [235, 245, 255];
        const colorGrisClaro: [number, number, number] = [240, 240, 240];
        const colorVerdeClaro: [number, number, number] = [230, 255, 230];
        let yPos = margin + 25;

        agregarEncabezado(logoUMSA, logoIDRDU);
        await agregarMarcaDeAgua(logoIDRDU);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text('Listado de Estudiantes', pageWidth / 2, yPos, { align: 'center' });
        yPos += 5;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');

        let filtrosAplicados = '';
        let hayFiltros = false;

        if (this.filtros.provincia) {
          const provincia = this.provincias.find(p => p.idProvincia === parseInt(this.filtros.provincia));
          filtrosAplicados += `Provincia: ${provincia?.nombre || this.filtros.provincia}, `;
          hayFiltros = true;
        }

        if (this.filtros.municipio) {
          const municipio = this.opcionesFiltros.municipios.find(m => m.idMunicipio === parseInt(this.filtros.municipio));
          filtrosAplicados += `Municipio: ${municipio?.nombre || this.filtros.municipio}, `;
          hayFiltros = true;
        }

        if (this.filtros.colegio) {
          filtrosAplicados += `Colegio: ${this.filtros.colegio}, `;
          hayFiltros = true;
        }

        if (this.filtros.curso) {
          filtrosAplicados += `Curso: ${this.filtros.curso}, `;
          hayFiltros = true;
        }

        if (this.filtros.fechaInicio && this.filtros.fechaFin) {
          filtrosAplicados += `Periodo: ${this.filtros.fechaInicio} - ${this.filtros.fechaFin}, `;
          hayFiltros = true;
        }

        if (hayFiltros) {
          doc.text(filtrosAplicados.slice(0, -2), margin, yPos);
        } else {
          doc.text('', margin, yPos);
        }
        const headers = [
          { header: 'CI', dataKey: 'ci' },
          { header: 'Nombre', dataKey: 'nombre' },
          { header: 'Apellidos', dataKey: 'apellidos' },
          { header: 'Colegio', dataKey: 'colegio' },
          { header: 'Curso', dataKey: 'curso' },
          { header: 'Edad', dataKey: 'edad' },
          { header: 'Celular', dataKey: 'celular' }
        ];
        const data = this.estudiantesFiltrados.map(est => ({
          ci: est.ciEstudiante,
          nombre: est.nombre,
          apellidos: `${est.apPaterno} ${est.apMaterno || ''}`.trim(),
          colegio: est.colegio,
          curso: est.curso,
          edad: est.edad,
          celular: est.celular
        }));
        autoTable(doc, {
          startY: yPos + 5,
          head: [headers.map(h => h.header)],
          body: data.map(d => headers.map(h => d[h.dataKey as keyof typeof d])),
          theme: 'grid',
          headStyles: {
            fillColor: [23, 54, 93],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center'
          },
          alternateRowStyles: {
            fillColor: [240, 240, 240]
          },
          styles: {
            fontSize: 7,
            cellPadding: 1
          },
          columnStyles: {
            0: { cellWidth: 20 }, // CI
            1: { cellWidth: 40 }, // Nombre
            2: { cellWidth: 60 }, // Apellidos
            3: { cellWidth: 85 }, // Colegio
            4: { cellWidth: 40 }, // Curso
            5: { cellWidth: 15 }, // Edad
            6: { cellWidth: 20 }  // Celular
          },
          margin: { left: margin, right: margin }
        });
        const finalY = (doc as any).lastAutoTable.finalY + 5;
        doc.setFontSize(9);
        doc.text(`Total registros: ${this.estudiantesFiltrados.length}`, margin, finalY);
        const fechaGeneracion = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
        doc.text(`Generado el: ${fechaGeneracion}`, margin, finalY + 5);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        agregarPiePagina();
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.text(`Pagina ${i} de ${totalPages}`, pageWidth - margin - 20, pageHeight - margin, { align: 'right' });
        }
        const fechaActual = new Date().toISOString().split('T')[0];
        doc.save(`listado_estudiantes_umsa_${fechaActual}.pdf`);
        this.exportando = false;
        this.mostrarNotificacion('Datos exportados en formato PDF correctamente', 'success');
      } catch (error) {
        console.error('Error al exportar PDF', error);
        this.exportando = false;
        this.mostrarNotificacion('Error al exportar datos en PDF', 'error');
      }
    } else {
      console.warn('La exportacion PDF no esta disponible en el servidor.');
    }
  }

  private cargarImagen(url: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if (!url) {
        resolve(null);
        return;
      }
      const img = new Image();
      img.crossOrigin = 'Anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        } else {
          console.error('Failed to get 2D context for canvas');
        }
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };

      img.onerror = () => {
        console.warn(`No se pudo cargar la imagen: ${url}`);
        resolve(null);
      };
      img.src = url;
    });
  }

}