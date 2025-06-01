import { Component, AfterViewInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
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
export class NavbarComponent implements AfterViewInit, OnDestroy {
  private ticking = false;
  private lastScrollTop = 0;
  private isBrowser: boolean;
  private destroy$ = new Subject<void>();

  // Estado de autenticación
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

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.handleScroll();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (this.isBrowser) {
      this.handleScroll();
    }
  }

  private handleScroll(): void {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const nav = document.querySelector('.custom-navbar') as HTMLElement;
        if (!nav) return;
        if (currentScrollTop > this.lastScrollTop && currentScrollTop > 200) {
          nav.classList.add('navbar-hidden');
        } else {
          nav.classList.remove('navbar-hidden');
        }
        this.lastScrollTop = Math.max(currentScrollTop, 0);
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  /**
   * Cierra la sesión del usuario
   */
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