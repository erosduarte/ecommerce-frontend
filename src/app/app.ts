import { Component, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from './auth.service';
import { CarritoService } from './carrito.service';
import { Footer } from './footer/footer';
import { filter, map } from 'rxjs';
import { Header } from './header/header';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CurrencyPipe, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly auth = inject(AuthService);
  readonly carrito = inject(CarritoService);

  constructor() {
    
    effect(() => {
      if (this.auth.isLoggedIn()) {
        this.carrito.cargarSaldo();
      }
    });
  }


}
