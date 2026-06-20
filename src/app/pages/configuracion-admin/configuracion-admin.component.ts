import { Component, OnDestroy, OnInit, PLATFORM_ID, Inject} from '@angular/core';
import { ConfiguracionService } from '../../services/configuracion.service';
import { MunicipioService } from '../../services/municipio.service';
import { ColegioService } from '../../services/colegio.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Configuracion } from '../../interfaces/configuracion-interface';
import { Municipio } from '../../interfaces/municipio-interface';
import { Colegio } from '../../interfaces/colegio-interface';
import { Usuario, UsuarioRegistrado } from '../../interfaces/auth.interface';
import { Provincia } from '../../interfaces/provincia-interface';
import { ProvinciaService } from '../../services/provincia.service';
import { Subject } from 'rxjs';
import { NotificacionService } from '../../services/notificacion.service';

@Component({
  selector: 'app-configuracion-admin',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './configuracion-admin.component.html',
  styleUrl: './configuracion-admin.component.css'
})
export class ConfiguracionAdminComponent implements OnInit, OnDestroy{

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private configuracionService: ConfiguracionService,
    private provinciaService: ProvinciaService,
    private municipioService: MunicipioService,
    private colegioService: ColegioService,
    private authService: AuthService,
    private notificacionService: NotificacionService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.inicializarFormularios;
  }

  private destroy$ = new Subject<void>();

  // navegacion entre PESTAÑAS
  tabActiva: 'configuracion' | 'usuarios' | 'municipios' | 'colegios' = 'configuracion';

  cambiarTab(tab: 'configuracion' | 'usuarios' | 'municipios' | 'colegios'): void {
    this.tabActiva = tab;
  }

  // variables de estado
  configuracion!: Configuracion;
  configuracionGuardada = false;

  // inicializacion de variables para listar
  provincias: Provincia[] = [];
  municipios: Municipio[] = [];
  colegios: Colegio[] = [];
  usuarios: UsuarioRegistrado[] = [];

  // variables de seleccion
  provinciaSeleccionada: number | null = null;
  municipioSeleccionado: number | null = null; 
  usuarioSeleccionado: number | null = null;
  colegioSeleccionado: number | null = null;

  // inicializacion de variables para filtrar
  municipiosFiltrados: Municipio[] = [];
  colegiosFiltrados: Colegio[] = [];
  usuariosFiltrados: Usuario[] = [];

  // formularios
  configuracionForm!: FormGroup;
  municipioForm!: FormGroup;
  colegioForm!: FormGroup;
  usuarioForm!: FormGroup;

  // variables para editar 
  idMunicipioEditar: number | null = null;
  idColegioEditar: number | null = null;
  idUsuarioEditar: number | null = null;

  // variable para roles
  roles = [
    {
      value: 'ADMINISTRADOR',
      label: 'Administrador'
    },
    {
      value: 'EVALUADOR',
      label: 'Evaluador'
    }
  ];

  // Autenticacion
  isAuthenticated = false;

  private inicializarFormularios(): void{
    //  inicio de formularios
    this.configuracionForm = this.fb.group({
      guardarResultados: [false],
      formularioHabilitado: [true]
    });

    this.municipioForm = this.fb.group({
      nombre: ['', Validators.required],
      idProvincia: [null, Validators.required]
    });

    this.colegioForm = this.fb.group({
      nombre: ['', Validators.required],
      idMunicipio: [null, Validators.required],
      idProvincia: [null, Validators.required]
    })

    this.usuarioForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      nombre: ['', Validators.required],
      rol: ['EVALUADOR', Validators.required]
    })
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.estaAutenticado();
    if (!this.authService.esAdministrador()) {
      this.router.navigate(['/']);
      return;
    }
    this.inicializarFormularios();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // cargamos la configuracion del sistema
  cargarConfiguracion(): void {
    this.configuracionService.getConfiguracion().subscribe({
      next: (data) => {
        this.configuracion = data;
        this.configuracionForm.patchValue({
          guardarResultados: data.guardarResultados,
          formularioHabilitado: data.formularioHabilitado
        });
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // guardado de configuracion
  guardarConfiguracion(): void {
    const configuracion: Configuracion = {
      ...this.configuracion,
      ...this.configuracionForm.value
    };
    this.configuracionService.updateConfiguracion(configuracion).subscribe({
      next: () => {
        this.notificacionService.mostrar("Configuracion Guardada", "success")
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  // cargar todos los usuarios:
  cargarUsuarios(): void {
    this.authService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // creacion de usuario
  crearUsuario(): void {
    if (this.usuarioForm.invalid) {
      return;
    }

    this.authService.create(this.usuarioForm.value).subscribe({
      next: () => {
        this.usuarioForm.reset();
        this.cargarUsuarios();
        this.notificacionService.mostrar('Usuario creado exitosamente', 'success');
      },
      error: (err) => {
        console.error(err);
        this.notificacionService.mostrar('Error al crear usuario', 'error');
      }
    })
  }

  // modificar un USUARIO
  editarUsuario(id: number): void {
    
  }

  // eliminar un USUARIO
  eliminarUsuario(id: number): void{
    if (!confirm("¿Esta segur@ de eliminar el usuario?")){
      return;
    }

    this.authService.delete(id).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.notificacionService.mostrar('Usuario elminado', 'success');
      },
      error: (err) => {
        console.error(err);
        this.notificacionService.mostrar('Error al eliminar usuario', 'error');
      }
    });
  }

  // Cargar las PROVINCIAS
  cargarProvincias(): void {
    this.provinciaService.getProvincias().subscribe({
      next: (data) => {
        this.provincias= data;
      },
      error : (err) => {
        console.error(err)
      }
    });
  }

  // Cargar los MUNICIPIOS
  cargarMunicipios(): void {
    this.municipioService.getAllMunicipios().subscribe({
      next: (data) => {
        this.municipios = data;
      },
      error : (err) => {
        console.error(err);
      }
    });
  }

  // crear un MUNICIPIO
  crearMunicipio(): void {
    if (this.municipioForm.invalid) {
      return;
    }

    this.municipioService.create(this.municipioForm.value).subscribe({
      next: () =>{
        this.municipioForm.reset();
        this.cargarMunicipios();

        this.notificacionService.mostrar("Municipio creado exitosamente", 'success');
      },
      error: (err) => {
        console.error(err);
        this.notificacionService.mostrar("Error al crear el municipio", 'error');
      }
    })
  }

  // Modificar un MUNICIPIO
  editarMunicipio(id: number): void {
    // por determinar
  }

  // Eliminar un MUNICIPIO
  eliminarMunicipio(id: number): void {
    if (!confirm("¿Esta segur@ de eliminar el municipio?")){
      return;
    }

    this.municipioService.delete(id).subscribe({
      next: ()=> {
        this.cargarMunicipios();
        this.notificacionService.mostrar('Municipio eliminado', 'success');
      },
      error: (err) => {
        console.error(err);
        this.notificacionService.mostrar('Error al eliminar el municipio', 'error');
      }
    });
  }

  // listar los COLEGIOS
  cargarColegios(): void {
    this.colegioService.getAllColegios().subscribe({
      next: (data) => {
        this.colegios = data;
      },
      error : (err) => {
        console.error(err);
      }
    })
  }

  // crear COLEGIO
  crearColegio(): void{
    if (this.colegioForm.invalid){
      return;
    }

    this.colegioService.create(this.colegioForm.value).subscribe({
      next: () => {
        this.colegioForm.reset();
        this.cargarColegios();

        this.notificacionService.mostrar('Colegio creado', 'success');
      },
      error: (err) => {
        console.error(err);
        this.notificacionService.mostrar('error al crear el Colegio', 'error');
      }
    });
  }

  // modificar un COLEGIO
  editarColegio(id: number): void {
    // falta
  }

  // eliminar un colegio
  eliminarColegio(id: number): void {
    if (!confirm("¿Esta segur@ de eliminar el colegio? \n SE ELIMINARAN LAS EVALUACIONES DE ESTUDIANTES ASOCIADOS AL COLEGIO")){
      return;
    }

    this.colegioService.delete(id).subscribe({
      next: () => {
        this.cargarColegios();
        this.notificacionService.mostrar('Colegio eliminado exitosamente', 'success');
      },
      error: (err) => {
        console.error(err);
        this.notificacionService.mostrar('Error al eliminar el colegio', 'error');
      }
    })
  }

}
