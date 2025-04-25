import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../interfaces/auth.interface';

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
  isAuthenticated = false;
  loading = false;
  error = '';
  logoUrl: String = '';
  /**
   * Datos de ejemplo para el panel de control.
   */
  datosControl = {
    totalEstudiantes: 0,
    facultadesActivas: 0,
    orientacionesCompletadas: 0
  };

  /**
   * Constructor del componente.
   * Inicializa el formulario de login.
   * @param formBuilder Para construir el formulario reactivo.
   * @param authService Servicio de autenticacion.
   */
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  /**
   * Metodo de ciclo de vida que se ejecuta al inicializar.
   * Verifica si el usuario esta autenticado y carga datos si es asi.
   */
  ngOnInit(): void {
    this.logoUrl = 'assets/escudo.png';
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.cargarDatosControl();
    }
  }

  /**
   * Maneja el envio del formulario de login.
   * Intenta autenticar al usuario.
   * @returns void
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
        },
        error: () => {
          this.error = 'Credenciales invalidas. Por favor intente nuevamente.';
          this.loading = false;
        }
      });
  }

  /**
   * Cierra la sesion del usuario.
   */
  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
  }

  /**
   * Carga datos para el panel de control.
   */
  private cargarDatosControl(): void {

    this.datosControl = {
      totalEstudiantes: 250,
      facultadesActivas: 13,
      orientacionesCompletadas: 178
    };
  }
}