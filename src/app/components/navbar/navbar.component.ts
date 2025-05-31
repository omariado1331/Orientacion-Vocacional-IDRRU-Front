import { Component, AfterViewInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  private ticking = false;
  private lastScrollTop = 0;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private authService: AuthService) {
    this.isBrowser = isPlatformBrowser(this.platformId);

  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.handleScroll();
    }
  }

  ngOnDestroy(): void {

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
}