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
import { Facultad, FacultadService } from '../../services/facultad.service';
import { ChasideService } from '../../services/chaside.service';
import { HollandService } from '../../services/holland.service';
import { NotificacionService } from '../../services/notificacion.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { debounceTime, distinctUntilChanged, forkJoin, Observable, Subject, of, takeUntil } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-control-orientacion',
  templateUrl: './control-orientacion.component.html',
  styleUrls: ['./control-orientacion.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ToastrModule],
  providers: [DatePipe, NotificacionService]
})
export class ControlOrientacionComponent implements OnInit, OnDestroy {
  // CONSTANTES Y UTILIDADES
  Math = Math;
  logoUrl = 'assets/escudo.png';
  logoUrlc = 'assets/umsac.png';
  logoIDRU = 'assets/idrdu.png';
  // ESTADO DE AUTENTICACIÓN
  isAuthenticated = false;
  loading = false;
  error = '';

  // ESTADO DE LA INTERFAZ
  exportando = false;
  searchQuery = '';
  private searchTerms = new Subject<string>();
  private destroy$ = new Subject<void>();

  // FORMULARIOS
  loginForm!: FormGroup;
  editarForm!: FormGroup;
  resultadoForm!: FormGroup;
  resultadosForm!: FormArray;

  // GESTIÓN DE ESTUDIANTES
  estudiantes: any[] = [];
  estudiantesFiltrados: any[] = [];
  estudianteSeleccionado: any = null;
  resultadoEstudiante: ResultadoDto[] = [];
  resultados: any[] = [];
  todasLasFacultades: Facultad[] = [];
  // OPCIONES PARA SELECTORES
  chasideOpciones: any[] = [];
  hollandOpciones: any[] = [];
  facultadOpciones: any[] = [];
  provincias: any[] = [];
  municipiosPorProvincia: { [provinciaId: number]: any[] } = {};
  municipios: any[] = [];
  municipiosFiltrados: any[] = [];
  // DATOS ADICIONALES PARA VISUALIZACIONES
  chasideData: any = null;
  hollandData: any = null;

  // CONFIGURACIÓN DE FILTROS
  opcionesFiltros = {
    provincias: [] as { nombre: string; idProvincia: number }[],
    municipios: [] as { nombre: string; idMunicipio: number }[],
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

  // CONFIGURACIÓN DE PAGINACIÓN
  paginacion = {
    paginaActual: 1,
    itemsPorPagina: 10,
    totalPaginas: 1
  };

  // CONFIGURACIÓN DE ORDENAMIENTO
  ordenamiento = {
    columna: 'nombre',
    direccion: 'asc' as 'asc' | 'desc'
  };

  // ESTADO DE MODALES
  modalEditarVisible = false;
  modalPerfilVisible = false;

  get resultadosFormGroups(): FormArray<FormGroup> {
    return this.resultadosForm as FormArray<FormGroup>;
  }

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
    private datePipe: DatePipe,
    private notificacionService: NotificacionService,
    private router: Router
  ) {
    this.inicializarFormularios();
    this.configurarBusqueda();
  }

  // INICIALIZACIÓN

  private inicializarFormularios(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.editarForm = this.formBuilder.group({
      ciEstudiante: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apPaterno: ['', [Validators.required]],
      apMaterno: [''],
      colegio: ['', [Validators.required]],
      curso: ['', [Validators.required]],
      edad: [null, [Validators.required, Validators.min(10), Validators.max(30)]],
      celular: ['', [Validators.pattern('^[0-9]*$')]],
      idProvincia: [null, [Validators.required]],
      id_municipio: [null, [Validators.required]]
    });

    this.resultadoForm = this.formBuilder.group({
      fecha: ['', Validators.required],
      idChaside: ['', Validators.required],
      idHolland: ['', Validators.required],
      idFacultad: ['', Validators.required],
      puntajeHolland: ['', Validators.required],
      aptitud: ['', Validators.required],
    });

    this.resultadosForm = this.inicializarFormArrayResultados();
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
    this.resultadoForm = this.formBuilder.group({});
    this.isAuthenticated = this.authService.estaAutenticado();
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
  }

  // AUTENTICACIÓN

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
        next: () => {
          this.isAuthenticated = true;
          this.loading = false;
          this.cargarDatos();
        },
        error: () => {
          this.error = 'Credenciales inválidas. Por favor intente nuevamente.';
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
  //       console.error('Error al cerrar sesión:', error);
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
      },
      error: (err: unknown) => {
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
        this.opcionesFiltros.provincias = data.map(p => ({
          nombre: p.nombre,
          idProvincia: p.idProvincia
        }));
      },
      error: (err) => {
        console.error('Error al cargar provincias', err);
        this.mostrarNotificacion('No se pudieron cargar las provincias', 'error');
      }
    });
  }

  cargarMunicipios(): void {
    this.municipioService.getAll().subscribe({
      next: (municipios: any[]) => {
        this.municipios = municipios;
        this.municipiosPorProvincia = {};
        this.municipios.forEach(m => {
          if (!this.municipiosPorProvincia[m.idProvincia]) {
            this.municipiosPorProvincia[m.idProvincia] = [];
          }
          this.municipiosPorProvincia[m.idProvincia].push(m);
        });
        if (this.filtros.provincia) {
          this.onProvinciaChange(this.filtros.provincia);
        }
      },
      error: (err) => {
        console.error('Error al cargar municipios', err);
      }
    });
  }

  getMunicipioNombre(id: number): string {
    const municipio = this.municipios.find(m => m.idMunicipio === id);
    return municipio ? municipio.nombre : 'Desconocido';
  }

  onProvinciaChangeEditar(event: any): void {
    const provinciaId = event.target.value;
    if (provinciaId && provinciaId !== 'null') {
      this.municipiosFiltrados = this.municipiosPorProvincia[provinciaId] || [];
      this.editarForm.patchValue({
        id_municipio: null
      });
    } else {
      this.municipiosFiltrados = [];
      this.editarForm.patchValue({
        id_municipio: null
      });
    }
  }

  getProvinciaByMunicipio(municipioId: number): any {
    for (let provinciaId in this.municipiosPorProvincia) {
      const municipio = this.municipiosPorProvincia[provinciaId].find(m => m.idMunicipio === municipioId);
      if (municipio) {
        return this.provincias.find(p => p.idProvincia == Number(provinciaId));
      }
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
        carreras: typeof f.carreras === 'string' ? JSON.parse(f.carreras) : f.carreras
      }));
    });
  }

  // GESTIÓN DE FILTROS

  actualizarOpcionesFiltros(): void {
    this.opcionesFiltros.municipios = Array.from(
      new Set(this.estudiantes.map(e => e.municipio?.nombre || 'No especificado'))
    ).map(nombre => {
      const estudiante = this.estudiantes.find(e => e.municipio?.nombre === nombre);
      return {
        nombre,
        idMunicipio: estudiante?.municipio?.idMunicipio || estudiante?.id_municipio || 0
      };
    });

    this.opcionesFiltros.colegios = Array.from(
      new Set(this.estudiantes.map(e => e.colegio || 'No especificado'))
    );

    this.opcionesFiltros.cursos = Array.from(
      new Set(this.estudiantes.map(e => e.curso || 'No especificado'))
    );

    this.opcionesFiltros.fechasRegistro = Array.from(
      new Set(this.estudiantes.map(e => this.formatDate(e.createdAt || new Date().toISOString())))
    );
  }
  onProvinciaChange(idProvincia: string): void {
    this.filtros.provincia = idProvincia;
    this.filtros.municipio = '';

    if (idProvincia && this.municipios) {
      const provinciaIdNumerico = parseInt(idProvincia, 10);
      const municipiosFiltrados = this.municipios.filter(m =>
        m.idProvincia === provinciaIdNumerico
      );
      this.opcionesFiltros.municipios = municipiosFiltrados.map(m => ({
        nombre: m.nombre,
        idMunicipio: m.idMunicipio
      }));
    } else {
      this.opcionesFiltros.municipios = [];
    }

    this.filtrarEstudiantes();
  }

  aplicarFiltro(tipo: keyof typeof this.filtros, valor: string): void {
    this.filtros[tipo] = valor;
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

    // Filtro de búsqueda global
    if (this.searchQuery) {
      const busqueda = this.searchQuery.toLowerCase();
      resultados = resultados.filter(estudiante =>
        (estudiante.nombre || '').toLowerCase().includes(busqueda) ||
        (estudiante.apPaterno || '').toLowerCase().includes(busqueda) ||
        (estudiante.apMaterno || '').toLowerCase().includes(busqueda) ||
        (estudiante.ciEstudiante || '').toLowerCase().includes(busqueda) ||
        (estudiante.colegio || '').toLowerCase().includes(busqueda)
      );
    }

    // Filtros por ubicación
    if (this.filtros.provincia) {
      const idProvincia = parseInt(this.filtros.provincia);
      const municipiosEnProvincia = this.municipiosPorProvincia[idProvincia]?.map(m => m.idMunicipio) || [];
      resultados = resultados.filter(estudiante =>
        municipiosEnProvincia.includes(estudiante.id_municipio)
      );
    }

    if (this.filtros.municipio) {
      const idMunicipioFiltro = Number(this.filtros.municipio);
      resultados = resultados.filter(estudiante => (estudiante.id_municipio || estudiante.municipio?.idMunicipio) === idMunicipioFiltro
      );
    }

    // Filtros institucionales
    if (this.filtros.colegio) {
      resultados = resultados.filter(estudiante => (estudiante.colegio || 'No especificado') === this.filtros.colegio);
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
  }

  buscarGlobal(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.filtrarEstudiantes();
    this.paginacion.paginaActual = 1;
  }

  // PAGINACIÓN Y ORDENAMIENTO

  aplicarOrdenamiento(): void {
    this.estudiantes.sort((a, b) => {
      let valorA: any;
      let valorB: any;
      if (this.ordenamiento.columna === 'apellidos') {
        valorA = `${a.apPaterno || ''} ${a.apMaterno || ''}`.toLowerCase();
        valorB = `${b.apPaterno || ''} ${b.apMaterno || ''}`.toLowerCase();
      } else {
        valorA = a[this.ordenamiento.columna] !== undefined ? a[this.ordenamiento.columna] : '';
        valorB = b[this.ordenamiento.columna] !== undefined ? b[this.ordenamiento.columna] : '';
      }

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
  }

  get estudiantesPaginados(): any[] {
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

  // GESTIÓN DE ESTUDIANTES

  eliminarEstudiante(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
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

  // GESTIÓN DE RESULTADOS

  inicializarFormArrayResultados(): FormArray {
    return this.formBuilder.array([]);
  }

  crearFormularioResultado(resultado?: any): FormGroup {
    return this.formBuilder.group({
      idResultado: [resultado?.idResultado || null],
      interes: [resultado?.interes || null, [Validators.required, Validators.min(0), Validators.max(100)]],
      aptitud: [resultado?.aptitud || null, [Validators.required, Validators.min(0), Validators.max(100)]],
      puntajeHolland: [resultado?.puntajeHolland || ''],
      fecha: [resultado?.fecha ? this.formatearFechaParaInput(resultado.fecha) :
        this.formatearFechaParaInput(new Date().toISOString())],
      idEstudiante: [resultado?.idEstudiante || null],
      idChaside: [resultado?.idChaside || null],
      idHolland: [resultado?.idHolland || null],
      idFacultad: [resultado?.idFacultad || null]
    });
  }

  agregarNuevoResultado(): void {
    const nuevoResultado = this.crearFormularioResultado({
      idEstudiante: this.estudianteSeleccionado?.idEstudiante
    });
    this.resultadosForm.push(nuevoResultado);
  }

  eliminarResultado(index: number): void {
    this.resultadosForm.removeAt(index);
  }

  esFormularioValido(): boolean {
    if (!this.editarForm || this.editarForm.invalid || !this.resultadosForm) {
      return false;
    }

    for (let i = 0; i < this.resultadosForm.length; i++) {
      const resultadoForm = this.resultadosForm.at(i) as FormGroup;
      if (!resultadoForm || resultadoForm.invalid) {
        return false;
      }
    }

    return true;
  }

  // GESTIÓN DE MODALES

  abrirModalEditar(estudiante: any): void {
    let provinciaEstudiante = null;
    if (estudiante.id_municipio) {
      provinciaEstudiante = this.getProvinciaByMunicipio(estudiante.id_municipio);
    }

    this.editarForm.patchValue({
      ciEstudiante: estudiante.ciEstudiante,
      nombre: estudiante.nombre,
      apPaterno: estudiante.apPaterno,
      apMaterno: estudiante.apMaterno,
      colegio: estudiante.colegio,
      curso: estudiante.curso,
      edad: estudiante.edad,
      celular: estudiante.celular,
      idProvincia: provinciaEstudiante ? provinciaEstudiante.idProvincia : null,
      id_municipio: estudiante.id_municipio
    });
    if (provinciaEstudiante) {
      this.municipiosFiltrados = this.municipiosPorProvincia[provinciaEstudiante.idProvincia] || [];
    } else {
      this.municipiosFiltrados = [];
    }
    this.resultadoService.getByEstudianteId(estudiante.idEstudiante).subscribe({
      next: (resultados: ResultadoDto[]) => {
        if (resultados.length === 0) {
          this.resultados = [];
          this.modalEditarVisible = true;
          this.loading = false;
          return;
        }

        const resultadosCompletos = resultados.map((resultado: ResultadoDto) => {
          const resultadoPromesas = [];

          if (resultado.idFacultad) {
            resultadoPromesas.push(
              this.facultadService.getById(resultado.idFacultad).toPromise()
                .then(facultad => ({ tipo: 'facultad', data: facultad }))
                .catch(() => ({ tipo: 'facultad', data: null }))
            );
          }

          if (resultado.idChaside) {
            resultadoPromesas.push(
              this.chasideService.getById(resultado.idChaside).toPromise()
                .then(chaside => ({ tipo: 'chaside', data: chaside }))
                .catch(() => ({ tipo: 'chaside', data: null }))
            );
          }

          if (resultado.idHolland) {
            resultadoPromesas.push(
              this.hollandService.getById(resultado.idHolland).toPromise()
                .then(holland => ({ tipo: 'holland', data: holland }))
                .catch(() => ({ tipo: 'holland', data: null }))
            );
          }

          return Promise.all(resultadoPromesas).then(resultadosAdicionales => {
            const resultadoCompleto = { ...resultado };
            resultadosAdicionales.forEach(item => {
              if (item.tipo === 'facultad') {
                resultadoCompleto.facultad = item.data;
              } else if (item.tipo === 'chaside') {
                resultadoCompleto.chaside = item.data;
              } else if (item.tipo === 'holland') {
                resultadoCompleto.holland = item.data;
              }
            });
            return resultadoCompleto;
          });
        });

        Promise.all(resultadosCompletos)
          .then(resultadosFinales => {
            this.resultados = resultadosFinales;

            const primerChaside = resultadosFinales.find(r => r.chaside);
            if (primerChaside) {
              this.chasideData = primerChaside.chaside;
            }

            const primerHolland = resultadosFinales.find(r => r.holland);
            if (primerHolland) {
              this.hollandData = primerHolland.holland;
            }

            this.modalEditarVisible = true;
            this.loading = false;
          })
          .catch(err => {
            console.error('Error al procesar los resultados', err);
            this.mostrarNotificacion('Hubo un error al procesar los resultados', 'error');
            this.resultados = resultados;
            this.modalEditarVisible = true;
            this.loading = false;
          });
      },
      error: (err) => {
        console.error('Error al cargar resultados del estudiante', err);
        this.mostrarNotificacion('No se pudieron cargar los resultados de orientación', 'error');
        this.resultados = [];
        this.modalEditarVisible = true;
        this.loading = false;
      }
    });
  }

  cerrarModalEditar(): void {
    this.modalEditarVisible = false;
    this.estudianteSeleccionado = null;
    if (this.editarForm) {
      this.editarForm.reset();
    }
    this.resultadosForm = this.inicializarFormArrayResultados();
  }

  guardarEdicionCompletaEstudiante(): void {
    if (!this.esFormularioValido() || !this.estudianteSeleccionado) {
      this.mostrarNotificacion('Por favor, complete todos los campos requeridos', 'error');
      return;
    }
    this.loading = true;
    const estudianteActualizado = {
      ...this.estudianteSeleccionado,
      ...this.editarForm.value
    };
    this.estudianteService.update(estudianteActualizado.idEstudiante, estudianteActualizado).subscribe({

      next: () => {
        const resultadosOperaciones: Observable<any>[] = [];
        for (let i = 0; i < this.resultadosForm.length; i++) {
          const resultadoForm = this.resultadosForm.at(i) as FormGroup;
          const resultadoData = resultadoForm.value;
          resultadoData.idEstudiante = estudianteActualizado.idEstudiante;
          if (resultadoData.idResultado) {
            resultadosOperaciones.push(
              this.resultadoService.update(resultadoData.idResultado, resultadoData)
            );
          } else {
            resultadosOperaciones.push(
              this.resultadoService.create(resultadoData)
            );
          }
        }
        if (resultadosOperaciones.length === 0) {
          this.loading = false;
          this.mostrarNotificacion('Estudiante actualizado con éxito', 'success');
          this.cerrarModalEditar();
          this.cargarEstudiantes();
          return;
        }

        forkJoin(resultadosOperaciones.length ? resultadosOperaciones : [of(null)]).subscribe({
          next: () => {
            this.loading = false;
            this.mostrarNotificacion('Estudiante y resultados actualizados con éxito', 'success');
            this.cerrarModalEditar();
            this.cargarEstudiantes();
          },
          error: (err) => {
            this.loading = false;
            console.error('Error al guardar resultados', err);
            this.mostrarNotificacion('Datos del estudiante actualizados, pero hubo errores con los resultados', 'warning');
            this.cerrarModalEditar();
            this.cargarEstudiantes();
          }
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al actualizar estudiante', err);
        this.mostrarNotificacion('No se pudo actualizar el estudiante', 'error');
      }
    });
  }

  verPerfilEstudiante(id: number): void {
    this.loading = true;
    this.estudianteService.getById(id).subscribe({
      next: (estudiante) => {
        this.estudianteSeleccionado = estudiante;
        console.log('Estudiante seleccionado:', this.estudianteSeleccionado);
        this.resultadoService.getByEstudianteId(id).subscribe({
          next: (resultados) => {
            if (resultados.length === 0) {
              this.resultadoEstudiante = [];
              this.modalPerfilVisible = true;
              this.loading = false;
              return;
            }
            console.log('Resultados obtenidos:', resultados);
            const resultadosCompletos = resultados.map((resultado: ResultadoDto) => {
              const resultadoPromesas = [];
              if (resultado.idFacultad) {
                resultadoPromesas.push(
                  this.facultadService.getById(resultado.idFacultad).toPromise()
                    .then(facultad => ({ tipo: 'facultad', data: facultad }))
                    .catch(() => ({ tipo: 'facultad', data: null }))
                );
              }
              if (resultado.idChaside) {
                resultadoPromesas.push(
                  this.chasideService.getById(resultado.idChaside).toPromise()
                    .then(chaside => ({ tipo: 'chaside', data: chaside }))
                    .catch(() => ({ tipo: 'chaside', data: null }))
                );
              }
              if (resultado.idHolland) {
                resultadoPromesas.push(
                  this.hollandService.getById(resultado.idHolland).toPromise()
                    .then(holland => ({ tipo: 'holland', data: holland }))
                    .catch(() => ({ tipo: 'holland', data: null }))
                );
              }
              return Promise.all(resultadoPromesas).then(resultadosAdicionales => {
                const resultadoCompleto = { ...resultado };
                resultadosAdicionales.forEach(item => {
                  if (item.tipo === 'facultad') {
                    resultadoCompleto.facultad = item.data;
                  } else if (item.tipo === 'chaside') {
                    resultadoCompleto.chaside = item.data;
                  } else if (item.tipo === 'holland') {
                    resultadoCompleto.holland = item.data;
                  }
                });

                return resultadoCompleto;
              });
            });
            Promise.all(resultadosCompletos)
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
            this.mostrarNotificacion('No se pudieron cargar los resultados de orientación vocacional', 'error');
            this.modalPerfilVisible = true;
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar datos del estudiante', err);
        this.mostrarNotificacion('No se pudo cargar la información del estudiante', 'error');
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

  // EXPORTACIÓN

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

      // Preparar los datos para Excel
      const datosParaExportar = this.estudiantesFiltrados.map(est => ({
        'CI': est.ciEstudiante,
        'Nombre': est.nombre,
        'Apellido Paterno': est.apPaterno,
        'Apellido Materno': est.apMaterno,
        'Colegio': est.colegio,
        'Curso': est.curso,
        'Edad': est.edad,
        'Celular': est.celular,
        'Fecha Registro': est.createdAt ? this.formatDate(est.createdAt) : 'No especificada'
      }));

      // Crear el libro de trabajo y la hoja
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExportar);
      const workbook: XLSX.WorkBook = XLSX.utils.book_new();

      // Añadir información institucional antes de los datos
      const infoSheet = XLSX.utils.aoa_to_sheet([
        ['UNIVERSIDAD MAYOR DE SAN ANDRÉS (2017-2025)'],
        ['INSTITUTO DE DESARROLLO REGIONAL Y DESCONCENTRACIÓN UNIVERSITARIA'],
        [''],
        ['Sistema de Orientación Vocacional - Listado de Estudiantes'],
        [''],
        ['Fecha de generación: ' + this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm')],
        [''],
        ['Filtros aplicados:']
      ]);

      // Añadir información de filtros aplicados
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
        XLSX.utils.sheet_add_aoa(infoSheet, [[`Período: ${this.filtros.fechaInicio} - ${this.filtros.fechaFin}`]], { origin: { r: rowIndex++, c: 0 } });
        hayFiltros = true;
      }

      if (!hayFiltros) {
        XLSX.utils.sheet_add_aoa(infoSheet, [['Sin filtros aplicados']], { origin: { r: rowIndex++, c: 0 } });
      }

      XLSX.utils.sheet_add_aoa(infoSheet, [
        [''],
        [`Total registros: ${this.estudiantesFiltrados.length}`],
        [''],
        ['Contacto UMSA:'],
        ['Teléfono: (591 - 2) 2612298'],
        ['E-mail: informate@umsa.bo'],
        ['Av. Villazón N° 1995, Plaza del Bicentenario - Zona Central'],
        ['Ciudad de La Paz. Estado Plurinacional de Bolivia'],
        [''],
        ['Contacto IDRDU:'],
        ['Teléfono: (591 - 2)'],
        ['E-mail:'],
        ['Av. 6 de Agosto. Edificio HOY Nro. 2170 Piso 12']
      ], { origin: { r: rowIndex, c: 0 } });

      // Añadir estilos personalizados (en la medida que XLSX lo permite)
      const infoRange = { s: { c: 0, r: 0 }, e: { c: 9, r: rowIndex + 13 } };
      infoSheet['!merges'] = [
        // Fusionar celdas para los títulos
        { s: { c: 0, r: 0 }, e: { c: 9, r: 0 } },
        { s: { c: 0, r: 1 }, e: { c: 9, r: 1 } },
        { s: { c: 0, r: 3 }, e: { c: 9, r: 3 } }
      ];

      // Ajustar ancho de columnas para la hoja de información
      infoSheet['!cols'] = [{ wch: 60 }];

      // Añadir la hoja de información
      XLSX.utils.book_append_sheet(workbook, infoSheet, 'Información');

      // Ajustar ancho de columnas para la hoja de datos
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
      ];
      worksheet['!cols'] = columnas;

      // Añadir la hoja de datos
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Estudiantes');

      // Generar el archivo
      const fechaActual = new Date().toISOString().split('T')[0];
      XLSX.writeFile(workbook, `estudiantes_orientacion_umsa_${fechaActual}.xlsx`);

      this.exportando = false;
      this.mostrarNotificacion('Datos exportados en formato Excel correctamente', 'success');
    } catch (error) {
      console.error('Error al exportar Excel', error);
      this.exportando = false;
      this.mostrarNotificacion('Error al exportar datos en Excel', 'error');
    }
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

        try {
          const logoUMSA = await this.cargarImagen(this.logoUrlc);
          const logoIDRDU = await this.cargarImagen(this.logoIDRU);
          if (logoUMSA) doc.addImage(logoUMSA, 'PNG', margin, margin, 30, 30);
          if (logoIDRDU) doc.addImage(logoIDRDU, 'PNG', pageWidth - margin - 30, margin, 30, 30);
        } catch (error) {
          console.warn('No se pudieron cargar las imágenes para el PDF', error);
        }

        let yPos = margin + 15;

        // Encabezado
        const colorAzulUMSA: [number, number, number] = [0, 51, 153];
        const colorVinoUMSA: [number, number, number] = [128, 0, 32];
        const colorAzulClaro: [number, number, number] = [235, 245, 255];
        const colorGrisClaro: [number, number, number] = [240, 240, 240];
        const colorVerdeClaro: [number, number, number] = [230, 255, 230];

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colorAzulUMSA);
        doc.text('UNIVERSIDAD MAYOR DE SAN ANDRÉS', pageWidth / 2, yPos, { align: 'center' });
        yPos += 6;

        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text('INSTITUTO DE DESARROLLO REGIONAL Y DESCONCENTRACIÓN UNIVERSITARIA', pageWidth / 2, yPos, { align: 'center' });
        yPos += 4;

        doc.setFontSize(10);
        doc.setTextColor(...colorVinoUMSA);
        doc.text('SISTEMA DE ORIENTACIÓN VOCACIONAL', pageWidth / 2, yPos, { align: 'center' });
        yPos += 8;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text('Listado de Estudiantes', pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');

        let filtrosAplicados = 'Filtros aplicados: ';
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
          filtrosAplicados += `Período: ${this.filtros.fechaInicio} - ${this.filtros.fechaFin}, `;
          hayFiltros = true;
        }

        if (hayFiltros) {
          doc.text(filtrosAplicados.slice(0, -2), margin, yPos);
        } else {
          doc.text('Sin filtros aplicados', margin, yPos);
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
            fontSize: 9,
            cellPadding: 2
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
        const footerY = pageHeight - 20;
        doc.text('UMSA: Teléfono: (591-2) 2612298 | E-mail: informate@umsa.bo', pageWidth / 2, footerY, { align: 'center' });
        doc.text('Av. Villazón N° 1995, Plaza del Bicentenario - Zona Central, La Paz, Bolivia', pageWidth / 2, footerY + 4, { align: 'center' });
        doc.text('IDRDU: Av. 6 de Agosto, Edificio HOY Nro. 2170 Piso 12', pageWidth / 2, footerY + 8, { align: 'center' });
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin - 20, pageHeight - margin, { align: 'right' });
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
      console.warn('La exportación PDF no está disponible en el servidor.');
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

  async exportarPerfilPDF(): Promise<void> {
    const doc = new jsPDF('portrait', 'mm', 'letter');
    const colorAzulUMSA: [number, number, number] = [0, 51, 153];
    const colorVinoUMSA: [number, number, number] = [128, 0, 32];
    const colorAzulClaro: [number, number, number] = [235, 245, 255];
    const colorGrisClaro: [number, number, number] = [240, 240, 240];
    const colorVerdeClaro: [number, number, number] = [230, 255, 230];
    const margenIzquierdo = 15;
    const margenDerecho = 15;
    const anchoUtil = doc.internal.pageSize.width - margenIzquierdo - margenDerecho;
    let y = 15;
    const estudiante = this.estudianteSeleccionado;
    if (!this.resultadoEstudiante || this.resultadoEstudiante.length === 0) {
      this.mostrarNotificacion('No hay resultados disponibles para exportar', 'warning');
      return;
    }
    const logoUMSA = await this.cargarImagen(this.logoUrlc);
    const logoIDRDU = await this.cargarImagen(this.logoIDRU);

    const agregarEncabezado = (logoUMSA: string | null, logoIDRDU: string | null) => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      y = margin + 15;

      if (logoUMSA) doc.addImage(logoUMSA, 'PNG', margin, margin, 30, 30);
      if (logoIDRDU) doc.addImage(logoIDRDU, 'PNG', pageWidth - margin - 30, margin, 30, 30);

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colorAzulUMSA);
      doc.text('UNIVERSIDAD MAYOR DE SAN ANDRÉS', pageWidth / 2, y, { align: 'center' });
      y += 6;

      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text('INSTITUTO DE DESARROLLO REGIONAL Y DESCONCENTRACIÓN UNIVERSITARIA', pageWidth / 2, y, { align: 'center' });
      y += 4;

      doc.setFontSize(10);
      doc.setTextColor(...colorVinoUMSA);
      doc.text('SISTEMA DE ORIENTACIÓN VOCACIONAL', pageWidth / 2, y, { align: 'center' });
      y += 8;

      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text('Perfil del Estudiante', pageWidth / 2, y, { align: 'center' });
      y += 10;
    };
    const agregarPiePagina = () => {
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const fechaGeneracion = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm');

      doc.setFontSize(9);
      doc.text(`Fecha de emisión: ${fechaGeneracion}`, 15, pageHeight - 20);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text('UMSA: Teléfono: (591-2) 2612298 | E-mail: informate@umsa.bo', pageWidth / 2, pageHeight - 15, { align: 'center' });
      doc.text('Av. Villazón N° 1995, Plaza del Bicentenario - Zona Central, La Paz, Bolivia', pageWidth / 2, pageHeight - 11, { align: 'center' });
      doc.text('IDRDU: Av. 6 de Agosto, Edificio HOY Nro. 2170 Piso 12', pageWidth / 2, pageHeight - 7, { align: 'center' });
    };
    const crearTitulo = (texto: string, color: [number, number, number] = colorAzulUMSA): void => {
      doc.setDrawColor(...color);
      doc.setLineWidth(0.5);
      doc.line(margenIzquierdo, y, doc.internal.pageSize.width - margenDerecho, y);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...color);
      doc.text(texto, margenIzquierdo, y + 5);
      y += 8;
    };

    const obtenerDescripcionArea = (codigo: string): string => {
      const areas = {
        'C': 'Administrativas, Contables y Económicas',
        'H': 'Humanísticas y Sociales',
        'A': 'Artísticas',
        'S': 'Medicina y Cs. de la Salud',
        'I': 'Ingeniería y Computación',
        'D': 'Defensa y Seguridad',
        'E': 'Ciencias Exactas y Agrarias'
      };
      return areas[codigo as keyof typeof areas] || '';
    };
    const correspondeACodigoChaside = (facultad: any, codigoChaside: string): boolean => {
      console.log('Facultad:', facultad, 'CodigoChaside:', codigoChaside);
      const mapeoCodigoANumero = {
        'C': 1, // Administrativas, Contables y Económicas
        'H': 2, // Humanísticas y Sociales
        'A': 3, // Artísticas
        'S': 4, // Medicina y Cs. de la Salud
        'I': 5, // Ingeniería y Computación
        'D': 6, // Defensa y Seguridad
        'E': 7  // Ciencias Exactas y Agrarias
      };
      return facultad.idChaside === mapeoCodigoANumero[codigoChaside as keyof typeof mapeoCodigoANumero];
    };

    const obtenerDescripcionHolland = (codigo: 'R' | 'I' | 'A' | 'S' | 'E' | 'C'): string => {
      const descripciones = {
        'R': 'Realista: Práctico, físico, concreto, orientado a la acción',
        'I': 'Investigador: Prefiere observar, aprender, investigar, analizar',
        'A': 'Artístico: Prefiere actividades creativas y expresivas',
        'S': 'Social: Prefiere trabajar con personas, ayudar y orientar',
        'E': 'Emprendedor: Prefiere liderar, persuadir y gestionar',
        'C': 'Convencional: Prefiere actividades ordenadas y sistemáticas'
      };
      return descripciones[codigo];
    };
    const procesarAreasCHASIDE = (chasideData: any) => {
      if (!chasideData?.codigo) {
        return { intereses: [], aptitudes: [] };
      }
      const codigo = chasideData.codigo.toString().toUpperCase();
      if (codigo.includes('-')) {
        const partes = codigo.split('-');
        return {
          intereses: partes[0]?.split('') || [],
          aptitudes: partes[1]?.split('') || []
        };
      }
      return {
        intereses: [codigo],
        aptitudes: [codigo]
      };
    };

    const verificarEspacioDisponible = (espacioNecesario: number): boolean => {
      const espacioDisponible = doc.internal.pageSize.height - y - 20;
      if (espacioDisponible < espacioNecesario) {
        doc.addPage();
        y = 15;
        agregarEncabezado(logoUMSA, logoIDRDU);
        return true;
      }
      else {
        agregarPiePagina();
      }
      return false;
    };

    agregarEncabezado(logoUMSA, logoIDRDU);
    doc.setDrawColor(...colorAzulUMSA);
    doc.setFillColor(...colorAzulClaro);
    doc.setLineWidth(0.3);
    doc.roundedRect(margenIzquierdo, y, anchoUtil, 28, 2, 2, 'FD');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('DATOS DEL ESTUDIANTE:', margenIzquierdo + 3, y + 5);
    doc.setFont('helvetica', 'normal');

    const nombreCompleto = `${estudiante.nombre} ${estudiante.apPaterno} ${estudiante.apMaterno || ''}`;
    doc.text(`Nombre: ${nombreCompleto}`, margenIzquierdo + 5, y + 11);
    doc.text(`C.I.: ${estudiante.ciEstudiante}`, margenIzquierdo + 5, y + 17);
    doc.text(`Edad: ${estudiante.edad} años`, margenIzquierdo + 5, y + 23);

    doc.text(`Colegio: ${estudiante.colegio}`, margenIzquierdo + anchoUtil / 2, y + 11);
    doc.text(`Celular: ${estudiante.celular || 'No especificado'}`, margenIzquierdo + anchoUtil / 2, y + 17);
    doc.text(`Curso: ${estudiante.curso}`, margenIzquierdo + anchoUtil / 2, y + 23);

    y += 30;
    const todosChaside = this.resultadoEstudiante
      .filter(r => r.chaside)
      .map((r, idx) => ({
        data: r.chaside,
        areas: procesarAreasCHASIDE(r.chaside),
        orden: idx + 1,
        fechaCreacion: r.fecha
      }));

    const todosHolland = this.resultadoEstudiante
      .filter(r => r.holland && r.puntajeHolland)
      .map((r, idx) => {
        const codigoHolland = r.puntajeHolland || 'N/A';
        return {
          data: r.holland,
          codigo: codigoHolland,
          orden: idx + 1,
          fechaCreacion: r.fecha
        };
      });
    const facultadesRecomendadas = new Map<number, any>();
    const todosChasideUnicos = new Set<string>();
    this.resultadoEstudiante
      .filter(r => r.chaside && r.chaside.codigo)
      .forEach(resultado => {
        const codigoChaside = resultado.chaside.codigo;
        todosChasideUnicos.add(codigoChaside);
        if (this.todasLasFacultades) {
          this.todasLasFacultades
            .filter(facultad => correspondeACodigoChaside(facultad, codigoChaside))
            .forEach(facultad => {
              if (!facultadesRecomendadas.has(facultad.idFacultad)) {
                facultadesRecomendadas.set(facultad.idFacultad, {
                  data: facultad,
                  codigosChaside: [codigoChaside],
                  fechaCreacion: resultado.fecha
                });
              } else {
                const existing = facultadesRecomendadas.get(facultad.idFacultad);
                if (!existing.codigosChaside.includes(codigoChaside)) {
                  existing.codigosChaside.push(codigoChaside);
                }
              }
            });
        }
      });
    const todasFacultades = Array.from(facultadesRecomendadas.values())
      .map((item, idx) => ({
        ...item,
        orden: idx + 1
      }));
    if (todosChaside.length > 0) {
      verificarEspacioDisponible(70);
      crearTitulo('RESULTADOS TEST CHASIDE');
      doc.setFillColor(...colorGrisClaro);
      doc.rect(margenIzquierdo, y, anchoUtil, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text('Cod.', margenIzquierdo + 5, y + 6);
      doc.text('Área', margenIzquierdo + 20, y + 6);

      const anchoColumnaResultado = 15;
      todosChaside.forEach((chaside, idx) => {
        const posX = margenIzquierdo + anchoUtil - ((todosChaside.length - idx) * anchoColumnaResultado);
        const fechaStr = chaside.fechaCreacion
          ? this.datePipe.transform(new Date(chaside.fechaCreacion), 'dd/MM')
          : `#${chaside.orden}`;
        doc.text(`${fechaStr}`, posX, y + 6);
      });
      y += 10;

      const codigosCHASIDE = ['C', 'H', 'A', 'S', 'I', 'D', 'E'];
      codigosCHASIDE.forEach(codigo => {
        const tieneAlgunDestacado = todosChaside.some(
          chaside => chaside.areas.intereses.includes(codigo) || chaside.areas.aptitudes.includes(codigo)
        );

        if (tieneAlgunDestacado) {
          doc.setFillColor(255, 255, 200);
        } else {
          doc.setFillColor(255, 255, 255);
        }

        doc.rect(margenIzquierdo, y, anchoUtil, 5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.text(codigo, margenIzquierdo + 5, y + 3.5);
        doc.setFont('helvetica', 'normal');
        doc.text(obtenerDescripcionArea(codigo), margenIzquierdo + 20, y + 3.5);

        todosChaside.forEach((chaside, idx) => {
          const posX = margenIzquierdo + anchoUtil - ((todosChaside.length - idx) * anchoColumnaResultado);

          const esInteresDestacado = chaside.areas.intereses.includes(codigo);
          const esAptitudDestacada = chaside.areas.aptitudes.includes(codigo);

          if (esInteresDestacado && esAptitudDestacada) {
            doc.setFont('helvetica', 'bold');
            doc.text('I+A', posX, y + 3.5);
          } else if (esInteresDestacado) {
            doc.setFont('helvetica', 'bold');
            doc.text('Int', posX, y + 3.5);
          } else if (esAptitudDestacada) {
            doc.setFont('helvetica', 'bold');
            doc.text('Apt', posX, y + 3.5);
          }
        });

        y += 5;
      });

      y += 3;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      todosChaside.forEach((chaside, idx) => {
        doc.text(`${chaside.orden} : ${chaside.data.codigo || 'N/A'}`,
          margenIzquierdo, y + (idx * 4));
      });
      y += (todosChaside.length * 4) + 5;
    }
    if (todosHolland.length > 0) {
      verificarEspacioDisponible(40);
      crearTitulo('RESULTADOS TEST HOLLAND');
      doc.setFillColor(...colorGrisClaro);
      doc.rect(margenIzquierdo, y, anchoUtil, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text('Evaluación', margenIzquierdo + 5, y + 6);
      doc.text('Código', margenIzquierdo + 35, y + 6);
      doc.text('Tipo Principal', margenIzquierdo + 60, y + 6);
      doc.text('Descripción', margenIzquierdo + 90, y + 6);
      doc.text('Fecha', margenIzquierdo + anchoUtil - 20, y + 6);
      y += 10;

      todosHolland.forEach((holland, idx) => {
        const colorFila: [number, number, number] = idx % 2 === 0 ? [255, 255, 255] : [245, 245, 245];
        doc.setFillColor(...colorFila);
        doc.rect(margenIzquierdo, y, anchoUtil, 8, 'F');

        const fechaStr = holland.fechaCreacion
          ? this.datePipe.transform(new Date(holland.fechaCreacion), 'dd/MM/yyyy')
          : 'No disponible';

        doc.setFont('helvetica', 'bold');
        doc.text(`${holland.orden}`, margenIzquierdo + 5, y + 5);
        doc.text(holland.codigo, margenIzquierdo + 35, y + 5);
        const tipoPrincipal = holland.codigo.charAt(0) as 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
        if (tipoPrincipal && ['R', 'I', 'A', 'S', 'E', 'C'].includes(tipoPrincipal)) {
          doc.text(holland.data.nombre || tipoPrincipal, margenIzquierdo + 60, y + 5);

          const descripcion = holland.data.descripcion || obtenerDescripcionHolland(tipoPrincipal);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(6);
          doc.text(descripcion, margenIzquierdo + 90, y + 5, {
            maxWidth: anchoUtil - 130
          });
        }

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text(fechaStr || '', margenIzquierdo + anchoUtil - 20, y + 5);

        y += 8;
      });
      y += 5;
    }
    if (todasFacultades.length > 0) {
      verificarEspacioDisponible(50);
      crearTitulo('RECOMENDACIONES ACADÉMICAS', colorVinoUMSA);

      todasFacultades.forEach((facultadItem, idx) => {
        verificarEspacioDisponible(40);
        const facultad = facultadItem.data;

        const imgWidth = 30;
        const imgHeight = 30;
        const imgX = margenIzquierdo + anchoUtil - imgWidth - 5;
        const imgY = y + 5;

        // doc.setFillColor(220, 240, 220);
        // doc.rect(margenIzquierdo, y - 4, anchoUtil, 14, 'F');

        doc.addImage(facultad.imgLogo, 'PNG', imgX, imgY, imgWidth, imgHeight);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(0, 100, 0);
        doc.text(`${facultadItem.orden}. ${facultad.nombre}`, margenIzquierdo + 5, y + 6);

        doc.setTextColor(0, 0, 0);
        y += 14;


        if (facultadItem.codigosChaside && facultadItem.codigosChaside.length > 0) {
          doc.setFontSize(7);
          doc.setFont('helvetica', 'bold');
          doc.text('Basado en áreas CHASIDE:', margenIzquierdo, y);
          doc.setFont('helvetica', 'normal');
          const areasTexto = facultadItem.codigosChaside
            .map((codigo: string) => `${codigo}: ${obtenerDescripcionArea(codigo)}`)
            .join(', ');
          doc.text(areasTexto, margenIzquierdo + 45, y, { maxWidth: anchoUtil - 50 });
          y += 8;
        }
        if (facultad.carreras && facultad.carreras.length > 0) {
          doc.setFontSize(7);
          doc.setFont('helvetica', 'bold');
          doc.text('Carreras disponibles:', margenIzquierdo, y);
          y += 5;

          const columnasCarreras = 2;
          const anchoColumna = anchoUtil / columnasCarreras;
          let columnaActual = 0;

          (facultad.carreras as string[]).slice(0, 10).forEach((carrera: string) => {
            const xPos = margenIzquierdo + (columnaActual * anchoColumna);
            doc.setFontSize(6);
            doc.setFont('helvetica', 'normal');
            doc.text(`• ${carrera}`, xPos + 2, y);
            columnaActual++;
            if (columnaActual >= columnasCarreras) {
              columnaActual = 0;
              y += 4;
            }
          });
          if (columnaActual > 0) y += 4;
          y += 2;
        }
        if (facultad.url) {
          doc.setFontSize(6);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(0, 0, 200);
          doc.text(`Más información: ${facultad.url}`, margenIzquierdo, y);
          doc.setTextColor(0, 0, 0);
          y += 4;
        }

        y += 5;
      });
    } else {
      verificarEspacioDisponible(30);
      crearTitulo('RECOMENDACIONES ACADÉMICAS', colorVinoUMSA);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Para obtener recomendaciones específicas de facultades y carreras,', margenIzquierdo, y);
      y += 5;
      doc.text('consulte con un orientador vocacional basándose en sus resultados CHASIDE y Holland.', margenIzquierdo, y);
      y += 10;
    }
    verificarEspacioDisponible(30);
    crearTitulo('CONSIDERACIONES IMPORTANTES', colorVinoUMSA);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');

    const textoConsejos = [
      "• Este informe es una guía orientativa basada en tus respuestas a los tests vocacionales.",
      "• Investiga más sobre las carreras sugeridas, visitando facultades o hablando con profesionales.",
      "• Considera tus intereses personales, habilidades y el mercado laboral al tomar tu decisión.",
      "• Puedes solicitar una entrevista con un orientador profesional para profundizar en tus resultados.",
      "• Tu vocación puede evolucionar con el tiempo y las experiencias que vayas adquiriendo."
    ];
    textoConsejos.forEach((consejo, index) => {
      doc.text(consejo, margenIzquierdo, y);
      y += 3.5;
    });

    agregarPiePagina();
    doc.save(`Perfil_Vocacional_${estudiante.nombre}_${estudiante.apPaterno}.pdf`);
    this.mostrarNotificacion('Perfil exportado a PDF correctamente', 'success');
  }
}