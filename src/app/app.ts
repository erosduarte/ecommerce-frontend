import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from './auth.service';
import { CarritoService } from './carrito.service';
import { Footer } from './footer/footer';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CurrencyPipe, Footer],
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
