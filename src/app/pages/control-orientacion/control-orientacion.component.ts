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
import { FacultadService } from '../../services/facultad.service';
import { ChasideService } from '../../services/chaside.service';
import { HollandService } from '../../services/holland.service';
import { NotificacionService } from '../../services/notificacion.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { debounceTime, distinctUntilChanged, forkJoin, Observable, Subject, of, takeUntil } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';

/**
 * Componente para manejar el inicio de sesión
 * y mostrar datos de control de orientación vocacional.
 */
@Component({
  selector: 'app-control-orientacion',
  templateUrl: './control-orientacion.component.html',
  styleUrls: ['./control-orientacion.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ToastrModule],
  providers: [DatePipe, NotificacionService]
})
export class ControlOrientacionComponent implements OnInit {
  // Variables públicas para usar en el template
  Math = Math;
  logoUrl = 'assets/escudo.png';

  // Estados del componente
  isAuthenticated = false;
  loading = false;
  error = '';
  exportando = false;
  searchQuery = '';

  // Formularios
  loginForm: FormGroup;
  // Formulario para edición
  editarForm: FormGroup | undefined;

  // Datos de estudiantes y filtrado
  estudiantes: any[] = [];
  estudiantesFiltrados: any[] = [];

  // Opciones para filtros
  opcionesFiltros = {
    provincias: [] as { nombre: string; idProvincia: number }[],
    municipios: [] as { nombre: string; idMunicipio: number }[],
    colegios: [] as string[],
    cursos: [] as string[],
    fechasRegistro: [] as string[]
  };

  // Estado de los filtros
  filtros: { [key in 'provincia' | 'municipio' | 'colegio' | 'curso' | 'fecha' | 'nombre' | 'fechaInicio' | 'fechaFin']: string } = {
    provincia: '',
    municipio: '',
    colegio: '',
    curso: '',
    fecha: '',
    nombre: '',
    fechaInicio: '',
    fechaFin: ''
  };
  // Configuración de paginación
  paginacion = {
    paginaActual: 1,
    itemsPorPagina: 10,
    totalPaginas: 1
  };

  // Configuración de ordenamiento
  ordenamiento = {
    columna: 'nombre',
    direccion: 'asc' as 'asc' | 'desc'
  };
  // Para modales
  estudianteSeleccionado: any = null;
  modalEditarVisible = false;
  modalPerfilVisible = false;

  // Para resultados de orientación

  resultadoEstudiante: ResultadoDto[] = [];

  // Para filtros adicionales
  provincias: any[] = [];
  municipiosPorProvincia: { [provinciaId: number]: any[] } = {}
  filtroFechaInicio: string = '';
  filtroFechaFin: string = '';
  // Nuevas propiedades para datos adicionales
  chasideData: any = null;
  hollandData: any = null;
  private searchTerms = new Subject<string>();
  private destroy$ = new Subject<void>();

  // FormArray para manejar los resultados
  resultadosForm: FormArray;
  resultadoForm: FormGroup;
  // Opciones para los selectores
  chasideOpciones: any[] = [];
  hollandOpciones: any[] = [];
  facultadOpciones: any[] = [];
  get resultadoFormGroup(): FormGroup {
    return this.resultadoForm as FormGroup;
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
    private notificacionService: NotificacionService
  ) {
    // Inicialización de formularios
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    //formulario para edición
    this.editarForm = this.formBuilder.group({
      ciEstudiante: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apPaterno: ['', [Validators.required]],
      apMaterno: [''],
      colegio: ['', [Validators.required]],
      curso: ['', [Validators.required]],
      edad: [null, [Validators.required, Validators.min(10), Validators.max(30)]],
      celular: ['', [Validators.pattern('^[0-9]*$')]],
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
    // Configurar el debounce para la búsqueda
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchQuery = term;
      this.filtrarEstudiantes();
    });
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.cargarDatos();
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  /**
   * Carga todos los datos necesarios para la vista
   */
  private cargarDatos(): void {
    this.cargarEstudiantes();
    this.cargarProvincias();
  }
  /**
   * Maneja el envío del formulario de login
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const credentials: LoginRequest = {
      username: this.loginForm.controls['username'].value,
      password: this.loginForm.controls['password'].value
    };

    this.authService.login(credentials)
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

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
  }

  /**
   * Carga la lista de estudiantes
   */
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
      }
    });
  }
  /**
  * Carga las provincias disponibles
  */
  cargarProvincias(): void {
    this.provinciaService.getProvincias().subscribe({
      next: (data) => {
        this.provincias = data;
        this.opcionesFiltros.provincias = data.map(p => ({
          nombre: p.nombre,
          idProvincia: p.id
        }));
        data.forEach(provincia => {
          this.cargarMunicipiosPorProvincia(provincia.id);
        });
      },
      error: (err) => {
        console.error('Error al cargar provincias', err);
        this.mostrarNotificacion('No se pudieron cargar las provincias', 'error');
      }
    });
  }
  /**
  * Carga los municipios de una provincia específica
  */
  cargarMunicipiosPorProvincia(idProvincia: number): void {
    this.municipioService.getMunicipios(idProvincia).subscribe({
      next: (data) => {
        this.municipiosPorProvincia[idProvincia] = data.map(m => ({
          nombre: m.nombre,
          idMunicipio: m.id
        }));
        if (this.filtros.provincia && parseInt(this.filtros.provincia) === idProvincia) {
          this.opcionesFiltros.municipios = this.municipiosPorProvincia[idProvincia];
        }
      },
      error: (err) => {
        console.error(`Error al cargar municipios de la provincia ${idProvincia}`, err);
      }
    });
  }
  /**
  * Actualiza la lista de municipios cuando cambia la provincia seleccionada
  */
  onProvinciaChange(idProvincia: string): void {
    this.filtros.provincia = idProvincia;
    this.filtros.municipio = '';
    if (idProvincia && this.municipiosPorProvincia[parseInt(idProvincia)]) {
      this.opcionesFiltros.municipios = this.municipiosPorProvincia[parseInt(idProvincia)].map(m => ({
        nombre: m.nombre,
        idMunicipio: m.idMunicipio
      }));
    } else {
      this.opcionesFiltros.municipios = [];
    }

    this.filtrarEstudiantes();
  }
  /**
  * Actualiza los filtros de fecha con validación
  */
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
  /**
   * Actualiza las opciones disponibles para los filtros
   */
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

  /**
   * Formatea una fecha para mostrarla en el formato DD/MM/YYYY
   */
  formatDate(dateString: string): string {
    if (!dateString) return 'No especificado';
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  /**
   * Aplica un filtro específico
   */
  aplicarFiltro(tipo: keyof typeof this.filtros, valor: string): void {
    this.filtros[tipo] = valor;
    this.filtrarEstudiantes();
    this.paginacion.paginaActual = 1;
  }

  /**
   * Limpia todos los filtros
   */
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
  /**
   * Filtra los estudiantes según los criterios actuales
   */
  filtrarEstudiantes(): void {
    let resultados = [...this.estudiantes];

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

    // Filtrar por provincia y municipio
    if (this.filtros.provincia) {
      const idProvincia = parseInt(this.filtros.provincia);
      const municipiosEnProvincia = this.municipiosPorProvincia[idProvincia]?.map(m => m.idMunicipio) || [];
      resultados = resultados.filter(estudiante =>
        municipiosEnProvincia.includes(estudiante.id_municipio)
      );
    }

    if (this.filtros.municipio) {
      resultados = resultados.filter(estudiante =>
        estudiante.id_municipio === parseInt(this.filtros.municipio)
      );
    }

    // Filtros existentes
    if (this.filtros.colegio) {
      resultados = resultados.filter(estudiante =>
        (estudiante.colegio || 'No especificado') === this.filtros.colegio
      );
    }

    if (this.filtros.curso) {
      resultados = resultados.filter(estudiante =>
        (estudiante.curso || 'No especificado') === this.filtros.curso
      );
    }

    // Filtro por fecha específica
    if (this.filtros.fecha) {
      resultados = resultados.filter(estudiante =>
        this.formatDate(estudiante.createdAt || '') === this.filtros.fecha
      );
    }

    // Filtro por rango de fechas
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
  /**
   * Aplica ordenamiento a la lista de estudiantes
   */
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

  /**
   * Cambia la columna de ordenamiento
   */
  ordenarPor(columna: string): void {
    if (this.ordenamiento.columna === columna) {
      this.ordenamiento.direccion = this.ordenamiento.direccion === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenamiento.columna = columna;
      this.ordenamiento.direccion = 'asc';
    }
    this.aplicarOrdenamiento();
  }

  /**
   * Calcula la paginación basada en los resultados filtrados
   */
  calcularPaginacion(): void {
    this.paginacion.totalPaginas = Math.ceil(this.estudiantesFiltrados.length / this.paginacion.itemsPorPagina);
    if (this.paginacion.paginaActual > this.paginacion.totalPaginas) {
      this.paginacion.paginaActual = this.paginacion.totalPaginas || 1;
    }
  }

  /**
   * Cambia a una página específica
   */
  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.paginacion.totalPaginas) {
      this.paginacion.paginaActual = pagina;
    }
  }

  /**
   * Obtiene los estudiantes de la página actual
   */
  get estudiantesPaginados(): any[] {
    const inicio = (this.paginacion.paginaActual - 1) * this.paginacion.itemsPorPagina;
    const fin = inicio + this.paginacion.itemsPorPagina;
    return this.estudiantesFiltrados.slice(inicio, fin);
  }

  /**
   * Cambia la cantidad de items por página
   */
  cambiarItemsPorPagina(items: number): void {
    this.paginacion.itemsPorPagina = items;
    this.paginacion.paginaActual = 1; // Resetear a primera página
    this.calcularPaginacion();
  }

  /**
   * Elimina un estudiante
   */
  eliminarEstudiante(id: number): void {
    if (confirm('¿Está seguro de eliminar este estudiante?')) {
      this.estudianteService.delete(id).subscribe({
        next: () => {
          this.cargarEstudiantes();
          this.mostrarNotificacion('Estudiante eliminado exitosamente', 'success');
        },
        error: (err) => {
          console.error('Error al eliminar estudiante', err);
          this.mostrarNotificacion('Error al eliminar estudiante', 'error');
        }
      });
    }
  }

  /**
   * Muestra una notificación al usuario
   */
  mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'info' | 'warning'): void {
    this.notificacionService.mostrar(mensaje, tipo);
  }
  /**
   * Maneja la búsqueda global
   */
  buscarGlobal(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.filtrarEstudiantes();
    this.paginacion.paginaActual = 1;
  }

  /**
   * Métodos para los modales
   */

  inicializarFormArrayResultados(): FormArray {
    return this.formBuilder.array([]);
  }

  /**
   * Crea un FormGroup para un resultado individual
   */
  crearFormularioResultado(resultado?: any): FormGroup {
    return this.formBuilder.group({
      idResultado: [resultado?.idResultado || null],
      interes: [resultado?.interes || null, [Validators.required, Validators.min(0), Validators.max(100)]],
      aptitud: [resultado?.aptitud || null, [Validators.required, Validators.min(0), Validators.max(100)]],
      puntajeHolland: [resultado?.puntajeHolland || ''],
      fecha: [resultado?.fecha ? this.formatearFechaParaInput(resultado.fecha) : this.formatearFechaParaInput(new Date().toISOString())],
      idEstudiante: [resultado?.idEstudiante || null],
      idChaside: [resultado?.idChaside || null],
      idHolland: [resultado?.idHolland || null],
      idFacultad: [resultado?.idFacultad || null]
    });
  }

  /**
   * Formatea la fecha para el input datetime-local
   */
  formatearFechaParaInput(fechaString: string): string {
    if (!fechaString) return '';
    const fecha = new Date(fechaString);
    return fecha.toISOString().slice(0, 16); // formato: "YYYY-MM-DDThh:mm"
  }

  /**
   * Carga los datos necesarios para los selectores de resultados
   */
  cargarDatosParaResultados(): void {
    // Cargar opciones de CHASIDE
    this.chasideService.getAll().subscribe({
      next: (data) => {
        this.chasideOpciones = data;
      },
      error: (err) => {
        console.error('Error al cargar opciones CHASIDE', err);
        this.mostrarNotificacion('No se pudieron cargar las opciones de CHASIDE', 'error');
      }
    });

    // Cargar opciones de Holland
    this.hollandService.getAll().subscribe({
      next: (data) => {
        this.hollandOpciones = data;
      },
      error: (err) => {
        console.error('Error al cargar opciones Holland', err);
        this.mostrarNotificacion('No se pudieron cargar las opciones de Holland', 'error');
      }
    });

    // Cargar opciones de Facultad
    this.facultadService.getAll().subscribe({
      next: (data) => {
        this.facultadOpciones = data;
      },
      error: (err) => {
        console.error('Error al cargar opciones de Facultad', err);
        this.mostrarNotificacion('No se pudieron cargar las opciones de Facultad', 'error');
      }
    });
  }

  /**
   * Abre el modal para editar un estudiante y sus resultados
   */
  abrirModalEditar(estudiante: any): void {
    this.estudianteSeleccionado = { ...estudiante };

    // Resetear formularios
    if (!this.editarForm) {
      this.editarForm = this.formBuilder.group({
        ciEstudiante: ['', [Validators.required]],
        nombre: ['', [Validators.required]],
        apPaterno: ['', [Validators.required]],
        apMaterno: [''],
        colegio: ['', [Validators.required]],
        curso: ['', [Validators.required]],
        edad: [null, [Validators.required, Validators.min(10), Validators.max(30)]],
        celular: ['', [Validators.pattern('^[0-9]*$')]],
        id_municipio: [null, [Validators.required]]
      });
    }

    // Inicializar el FormArray para resultados
    this.resultadosForm = this.inicializarFormArrayResultados();

    // Asegurarse de que los datos selectores estén cargados
    this.cargarDatosParaResultados();

    // Completar el formulario con los datos del estudiante
    this.editarForm.patchValue({
      ciEstudiante: estudiante.ciEstudiante,
      nombre: estudiante.nombre,
      apPaterno: estudiante.apPaterno,
      apMaterno: estudiante.apMaterno,
      colegio: estudiante.colegio,
      curso: estudiante.curso,
      edad: estudiante.edad,
      celular: estudiante.celular,
      id_municipio: estudiante.id_municipio
    });

    // Cargar los resultados existentes del estudiante
    this.resultadoService.getByEstudianteId(estudiante.idEstudiante).subscribe({
      next: (resultados: ResultadoDto[]) => {
        if (resultados.length > 0) {
          resultados.forEach(resultado => {
            this.resultadosForm.push(this.crearFormularioResultado(resultado));
          });
        } else {
          // Si no hay resultados, crear uno vacío
          this.agregarNuevoResultado();
        }
        this.modalEditarVisible = true;
      },
      error: (err) => {
        console.error('Error al cargar resultados del estudiante', err);
        this.mostrarNotificacion('No se pudieron cargar los resultados de orientación', 'error');
        // Crear un resultado vacío incluso en caso de error para permitir la edición
        this.agregarNuevoResultado();
        this.modalEditarVisible = true;
      }
    });
  }

  /**
   * Agrega un nuevo resultado vacío al formulario
   */
  agregarNuevoResultado(): void {
    const nuevoResultado = this.crearFormularioResultado({
      idEstudiante: this.estudianteSeleccionado?.idEstudiante
    });
    this.resultadosForm.push(nuevoResultado);
  }

  /**
   * Elimina un resultado del formulario
   */
  eliminarResultado(index: number): void {
    this.resultadosForm.removeAt(index);
  }

  /**
   * Verifica si el formulario completo (estudiante + resultados) es válido
   */
  esFormularioValido(): boolean {
    if (!this.editarForm || this.editarForm.invalid) {
      return false;
    }

    // Verificar que cada resultado en el FormArray sea válido
    for (let i = 0; i < this.resultadosForm.length; i++) {
      const resultadoForm = this.resultadosForm.at(i) as FormGroup;
      if (resultadoForm.invalid) {
        return false;
      }
    }

    return true;
  }

  /**
   * Guarda la edición completa (estudiante y sus resultados)
   */
  guardarEdicionCompletaEstudiante(): void {
    if (!this.esFormularioValido() || !this.estudianteSeleccionado) {
      this.mostrarNotificacion('Por favor, complete todos los campos requeridos', 'error');
      return;
    }

    this.loading = true;

    // Primero guardar los datos del estudiante
    const estudianteActualizado = {
      ...this.estudianteSeleccionado,
      ...(this.editarForm?.value || {})
    };

    this.estudianteService.update(estudianteActualizado.idEstudiante, estudianteActualizado).subscribe({
      next: (estudianteGuardado) => {
        // Después guardar cada uno de los resultados
        const resultadosOperaciones: Observable<any>[] = [];

        for (let i = 0; i < this.resultadosForm.length; i++) {
          const resultadoForm = this.resultadosForm.at(i) as FormGroup;
          const resultadoData = resultadoForm.value;
          resultadoData.idEstudiante = estudianteActualizado.idEstudiante;

          // Si tiene ID, actualizar; sino, crear nuevo
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

        // Si no hay resultados que guardar, terminar el proceso
        if (resultadosOperaciones.length === 0) {
          this.loading = false;
          this.mostrarNotificacion('Estudiante actualizado con éxito', 'success');
          this.cerrarModalEditar();
          this.cargarEstudiantes();
          return;
        }

        // Procesar todas las operaciones de resultados usando forkJoin
        import('rxjs').then(({ forkJoin, of }) => {
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
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al actualizar estudiante', err);
        this.mostrarNotificacion('No se pudo actualizar el estudiante', 'error');
      }
    });
  }

  /**
   * Cierra el modal de edición
   */
  cerrarModalEditar(): void {
    this.modalEditarVisible = false;
    this.estudianteSeleccionado = null;
    if (this.editarForm) {
      this.editarForm.reset();
    }
    this.resultadosForm = this.inicializarFormArrayResultados();
  }

  verPerfilEstudiante(id: number): void {
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
  /**
   * Cierra el modal de perfil del estudiante
   */

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
  /**
   * Exporta la información del perfil del estudiante a PDF
   */
  exportarPerfilPDF(): void {
    if (!this.estudianteSeleccionado) return;

    const doc = new jsPDF();
    let y = 20;

    // Título
    doc.setFontSize(18);
    doc.text('PERFIL DE ORIENTACIÓN VOCACIONAL', 105, y, { align: 'center' });

    // Logo (opcional)
    // doc.addImage(this.logoUrl, 'PNG', 20, 20, 30, 30);

    // Datos personales
    y += 15;
    doc.setFontSize(14);
    doc.text('Datos Personales', 20, y);

    y += 10;
    doc.setFontSize(10);
    doc.text(`CI: ${this.estudianteSeleccionado.ciEstudiante}`, 20, y);
    y += 7;
    doc.text(`Nombre: ${this.estudianteSeleccionado.nombre} ${this.estudianteSeleccionado.apPaterno} ${this.estudianteSeleccionado.apMaterno || ''}`, 20, y);
    y += 7;
    doc.text(`Edad: ${this.estudianteSeleccionado.edad} años`, 20, y);
    y += 7;
    doc.text(`Colegio: ${this.estudianteSeleccionado.colegio}`, 20, y);
    y += 7;
    doc.text(`Curso: ${this.estudianteSeleccionado.curso}`, 20, y);
    y += 7;
    doc.text(`Celular: ${this.estudianteSeleccionado.celular || 'No especificado'}`, 20, y);

    // Resultados
    if (this.resultadoEstudiante.length > 0) {
      this.resultadoEstudiante.forEach((resultado, index) => {
        y += 15;
        doc.setFontSize(14);
        doc.text(`Resultado #${index + 1}`, 20, y);

        y += 10;
        doc.setFontSize(10);
        doc.text(`Interés: ${resultado.interes}`, 20, y);
        y += 7;
        doc.text(`Aptitud: ${resultado.aptitud}`, 20, y);
        y += 7;
        doc.text(`Puntaje Holland: ${resultado.puntajeHolland}`, 20, y);

        if (resultado.facultad?.nombre) {
          y += 7;
          doc.text(`Facultad recomendada: ${resultado.facultad.nombre}`, 20, y);
        }
      });

      // CHASIDE
      if (this.chasideData) {
        y += 15;
        doc.setFontSize(14);
        doc.text('Datos CHASIDE', 20, y);

        y += 10;
        doc.setFontSize(10);
        doc.text(`Código: ${this.chasideData.codigo}`, 20, y);

        if (this.chasideData.intereses) {
          y += 7;
          doc.text(`Intereses: ${this.chasideData.intereses}`, 20, y);
        }
        if (this.chasideData.aptitudes) {
          y += 7;
          doc.text(`Aptitudes: ${this.chasideData.aptitudes}`, 20, y);
        }
      }

      // Holland
      if (this.hollandData) {
        y += 15;
        doc.setFontSize(14);
        doc.text('Datos Holland', 20, y);

        y += 10;
        doc.setFontSize(10);
        doc.text(`Personalidad: ${this.hollandData.personalidad}`, 20, y);

        if (this.hollandData.puntajes) {
          y += 7;
          doc.text(`Puntajes: ${this.hollandData.puntajes}`, 20, y);
        }
      }

    } else {
      y += 15;
      doc.setFontSize(12);
      doc.text('Este estudiante aún no tiene resultados de orientación vocacional registrados.', 20, y);
    }


    // Fecha de emisión
    y += 30;
    doc.setFontSize(10);
    const fechaEmision = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
    doc.text(`Fecha de emisión: ${fechaEmision}`, 20, y);

    // Guardar PDF
    doc.save(`Perfil_${this.estudianteSeleccionado.nombre}_${this.estudianteSeleccionado.apPaterno}.pdf`);

    this.mostrarNotificacion('Perfil exportado a PDF correctamente', 'success');
  }
  /**
   * Implementación de exportar estudiantes a Excel y PDF
   */
  exportarEstudiantes(formato: 'excel' | 'pdf'): void {
    this.exportando = true;

    if (formato === 'excel') {
      this.exportarExcel();
    } else {
      this.exportarPDF();
    }
  }

  private exportarExcel(): void {
    try {
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
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Estudiantes');

      // Ajustar ancho de columnas
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

      // Generar el archivo
      XLSX.writeFile(workbook, `estudiantes_orientacion_${new Date().toISOString().split('T')[0]}.xlsx`);

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
        await import('jspdf-autotable');
        const doc = new jsPDF('landscape', 'mm', 'a4');
        const headers = ['CI', 'Nombre', 'Apellidos', 'Colegio', 'Curso', 'Edad'];
        const data = this.estudiantesFiltrados.map(est => [
          est.ciEstudiante,
          est.nombre,
          `${est.apPaterno} ${est.apMaterno || ''}`,
          est.colegio,
          est.curso,
          est.edad
        ]);

        autoTable(doc, {
          head: [headers],
          body: data,
          startY: 40,
          styles: { fontSize: 10 },
          margin: { top: 40 }
        });

        doc.setFontSize(18);
        doc.text('Listado de Estudiantes - Orientación Vocacional', 149, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Universidad Mayor de San Andrés', 149, 30, { align: 'center' });
        (doc as any).autoTable({
          head: [headers],
          body: data,
          startY: 40,
          styles: { fontSize: 10 },
          margin: { top: 40 }
        });
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
        const yPos = (doc as any).lastAutoTable.finalY + 10;
        if (hayFiltros) {
          doc.setFontSize(10);
          doc.text(filtrosAplicados.slice(0, -2), 14, yPos);
        }
        const fechaGeneracion = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
        doc.setFontSize(10);
        doc.text(`Total registros: ${this.estudiantesFiltrados.length}`, 14, yPos + 8);
        doc.text(`Generado el: ${fechaGeneracion}`, 14, yPos + 16);
        doc.save(`listado_estudiantes_${new Date().toISOString().split('T')[0]}.pdf`);

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
}