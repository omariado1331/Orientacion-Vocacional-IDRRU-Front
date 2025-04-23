// control-orientacion.component.ts - Componente que maneja login y muestra información del control
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-control-orientacion',
  templateUrl: './control-orientacion.component.html',
  styleUrls: ['./control-orientacion.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ControlOrientacionComponent implements OnInit {
  loginForm: FormGroup;
  isAuthenticated = false;
  loading = false;
  error = '';
  returnUrl: string = '/';
  
  // Datos de control que se mostrarán después del login
  datosControl = {
    totalEstudiantes: 0,
    facultadesActivas: 0,
    orientacionesCompletadas: 0
  };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/control-orientacion';
    if (this.isAuthenticated) {
      this.cargarDatosControl();
    }
  }

  /**
   * Manejar envío del formulario de login
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
          this.cargarDatosControl();
          
          if (this.returnUrl !== '/control-orientacion') {
            this.router.navigateByUrl(this.returnUrl);
          }
        },
        error: err => {
          this.error = 'Credenciales inválidas. Por favor intente nuevamente.';
          this.loading = false;
          console.error('Error de autenticación:', err);
        }
      });
  }

  /**
   * Cerrar sesión del usuario
   */
  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
  }

  /**
   * Cargar datos para el panel de control
   * En un caso real, esto debería obtener datos de un servicio
   */
  private cargarDatosControl(): void {
    this.datosControl = {
      totalEstudiantes: 250,
      facultadesActivas: 13,
      orientacionesCompletadas: 178
    };
  }
}