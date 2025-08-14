import { Component, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnDestroy {
  private isBrowser: boolean;
  private destroy$ = new Subject<void>();

  isAuthenticated = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.isAuthenticated = this.authService.estaAutenticado();
    this.authService.obtenerEstadoAutenticacion()
      .pipe(takeUntil(this.destroy$))
      .subscribe(estado => {
        this.isAuthenticated = estado;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion().subscribe({
      next: () => {
        console.log('Sesión cerrada correctamente');
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    });
  }
}
