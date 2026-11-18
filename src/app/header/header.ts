import { Component, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { filter, map } from 'rxjs';
import { AuthService } from '../auth.service';
import { CarritoService } from '../carrito.service';
@Component({
  selector: 'app-header',
  imports: [RouterOutlet, RouterLink, CurrencyPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly auth = inject(AuthService);
  readonly carrito = inject(CarritoService);
  private readonly router = inject(Router);
  esInicio = signal(true);
  scrolled = signal (false);

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 40);
  }
  constructor() {
    this.router.events
    .pipe(filter((e) => e instanceof NavigationEnd))
    .subscribe((e) => this.esInicio.set(e.urlAfterRedirects.split('?')[0] === '/'));
  }


}
