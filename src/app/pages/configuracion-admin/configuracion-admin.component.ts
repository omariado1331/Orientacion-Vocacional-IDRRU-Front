import { Component, OnDestroy, OnInit, PLATFORM_ID, Inject} from '@angular/core';
import { ConfiguracionService } from '../../services/configuracion.service';
import { MunicipioService } from '../../services/municipio.service';
import { ColegioService } from '../../services/colegio.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Configuracion } from '../../interfaces/configuracion-interface';
import { Municipio } from '../../interfaces/municipio-interface';
import { Colegio } from '../../interfaces/colegio-interface';
import { Usuario } from '../../interfaces/auth.interface';
import { Provincia } from '../../interfaces/provincia-interface';
import { ProvinciaService } from '../../services/provincia.service';
import { Subject } from 'rxjs';
import { NotificacionService } from '../../services/notificacion.service';

@Component({
  selector: 'app-configuracion-admin',
  imports: [],
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

  // variables de estado
  configuracion!: Configuracion;
  configuracionGuardada = false;

  // variables para listar
  provincias: Provincia[] = [];
  municipios: Municipio[] = [];
  colegios: Colegio[] = [];
  usuarios: Usuario[] = [];

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
      value: 'ADMIN',
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
      idMunicipio: [null, Validators.required]
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
    if (this.authService.esAdministrador()) {
      this.router.navigate(['/']);
      return;
    }
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


}
