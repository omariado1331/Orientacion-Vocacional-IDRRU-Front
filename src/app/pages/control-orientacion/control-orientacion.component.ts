import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../interfaces/auth.interface';
import { EstudianteService } from '../../services/studiante.service';

/**
 * Componente para manejar el inicio de sesion
 * y mostrar datos basicos de control.
 */
@Component({
  selector: 'app-control-orientacion',
  templateUrl: './control-orientacion.component.html',
  styleUrls: ['./control-orientacion.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ControlOrientacionComponent implements OnInit {
  loginForm: FormGroup;
  estudianteForm: FormGroup;
  isAuthenticated = false;
  loading = false;
  error = '';
  logoUrl: String = '';
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  estudianteEditId: number | null = null;
  datosControl = {
    totalEstudiantes: 0,
    facultadesActivas: 0,
    orientacionesCompletadas: 0
  };
  estudiantes: any[] = [];
  estudiantesFiltrados: any[] = [];
  opcionesFiltros = {
    provincias: [] as { nombre: string; idProvincia: number }[],
    colegios: [] as string[],
    cursos: [] as string[],
    fechasRegistro: [] as string[]
  };
  filtros: { [key in 'provincia' | 'colegio' | 'curso' | 'fecha']: string } = {
    provincia: '',
    colegio: '',
    curso: '',
    fecha: ''
  };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private estudianteService: EstudianteService,

  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    
    this.estudianteForm = this.formBuilder.group({
      ciEstudiante: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apPaterno: ['', [Validators.required]],
      apMaterno: [''],
      colegio: ['', [Validators.required]],
      curso: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.min(10), Validators.max(30)]],
      celular: ['', [Validators.required]],
      idProvincia: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.logoUrl = 'assets/escudo.png';
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.cargarDatosControl();
      this.cargarEstudiantes();
    }
  }

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
          this.cargarDatosControl();
          this.cargarEstudiantes();
        },
        error: () => {
          this.error = 'Credenciales invalidas. Por favor intente nuevamente.';
          this.loading = false;
        }
      });
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
  }

  private cargarDatosControl(): void {
    this.datosControl = {
      totalEstudiantes: 0,
      facultadesActivas: 0,
      orientacionesCompletadas: 0
    };
  }
  cargarEstudiantes(): void {
    this.estudianteService.getAll().subscribe({
      next: (data) => {
        this.estudiantes = data;
        // this.estudiantesFiltrados = [...data];
        this.datosControl.totalEstudiantes = data.length;
        this.actualizarOpcionesFiltros();
      },
      error: (err) => {
        console.error('Error al cargar estudiantes', err);
      }
    });
  }
  actualizarOpcionesFiltros(): void {
    this.opcionesFiltros.provincias = Array.from(
      new Set(this.estudiantes.map(e => e.provincia.nombre))
    ).map(nombre => {
      return { nombre, idProvincia: this.estudiantes.find(e => e.provincia.nombre === nombre).provincia.idProvincia };
    });
    
    this.opcionesFiltros.colegios = Array.from(
      new Set(this.estudiantes.map(e => e.colegio))
    );
    
    this.opcionesFiltros.cursos = Array.from(
      new Set(this.estudiantes.map(e => e.curso))
    );
    this.opcionesFiltros.fechasRegistro = Array.from(
      new Set(this.estudiantes.map(e => this.formatDate(e.createdAt)))
    );
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
  aplicarFiltro(tipo: keyof typeof this.filtros, valor: string): void {
    this.filtros[tipo] = valor;
    this.filtrarEstudiantes();
  }
  limpiarFiltro(tipo: keyof typeof this.filtros): void {
    this.filtros[tipo] = '';
    this.filtrarEstudiantes();
  }
  
  limpiarTodosFiltros(): void {
    this.filtros = {
      provincia: '',
      colegio: '',
      curso: '',
      fecha: ''
    };
    this.estudiantesFiltrados = [...this.estudiantes];
  }
  filtrarEstudiantes(): void {
    this.estudiantesFiltrados = this.estudiantes.filter(estudiante => {
      if (this.filtros.provincia && estudiante.provincia.nombre !== this.filtros.provincia) {
        return false;
      }
      if (this.filtros.colegio && estudiante.colegio !== this.filtros.colegio) {
        return false;
      }
      if (this.filtros.curso && estudiante.curso !== this.filtros.curso) {
        return false;
      }
      if (this.filtros.fecha && this.formatDate(estudiante.createdAt) !== this.filtros.fecha) {
        return false;
      }
      return true;
    });
  }
  abrirModalCrear(): void {
    this.modalMode = 'create';
    this.estudianteEditId = null;
    this.estudianteForm.reset();
    this.showModal = true;
  }
  abrirModalEditar(estudiante: any): void {
    this.modalMode = 'edit';
    this.estudianteEditId = estudiante.idEstudiante;
    
    this.estudianteForm.patchValue({
      ciEstudiante: estudiante.ciEstudiante,
      nombre: estudiante.nombre,
      apPaterno: estudiante.apPaterno,
      apMaterno: estudiante.apMaterno,
      colegio: estudiante.colegio,
      curso: estudiante.curso,
      edad: estudiante.edad,
      celular: estudiante.celular,
      idProvincia: estudiante.provincia.idProvincia
    });
    
    this.showModal = true;
  }
  cerrarModal(): void {
    this.showModal = false;
  }
  guardarEstudiante(): void {
    if (this.estudianteForm.invalid) {
      Object.keys(this.estudianteForm.controls).forEach(key => {
        this.estudianteForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    const estudianteDto = {
      ciEstudiante: this.estudianteForm.get('ciEstudiante')?.value,
      nombre: this.estudianteForm.get('nombre')?.value,
      apPaterno: this.estudianteForm.get('apPaterno')?.value,
      apMaterno: this.estudianteForm.get('apMaterno')?.value,
      colegio: this.estudianteForm.get('colegio')?.value,
      curso: this.estudianteForm.get('curso')?.value,
      edad: this.estudianteForm.get('edad')?.value,
      celular: this.estudianteForm.get('celular')?.value,
      idProvincia: this.estudianteForm.get('idProvincia')?.value
    };
    
    if (this.modalMode === 'create') {
      this.estudianteService.create(estudianteDto).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarEstudiantes(); 
        },
        error: (err) => {
          console.error('Error al crear estudiante', err);
        }
      });
    } else {
      if (this.estudianteEditId !== null) {
        this.estudianteService.update(this.estudianteEditId, estudianteDto).subscribe({
          next: () => {
            this.cerrarModal();
            this.cargarEstudiantes();
          },
          error: (err) => {
            console.error('Error al actualizar estudiante', err);
          }
        });
      } else {
        console.error('Error: estudianteEditId es null en modo actualización.');
      }
    }
  }
  eliminarEstudiante(id: number): void {
    if (confirm('¿Está seguro de eliminar este estudiante?')) {
      this.estudianteService.delete(id).subscribe({
        next: () => {
          this.cargarEstudiantes(); // Recargar lista
        },
        error: (err) => {
          console.error('Error al eliminar estudiante', err);
        }
      });
    }
  }
}