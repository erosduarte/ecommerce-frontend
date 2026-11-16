import { Component, effect, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from './auth.service';
import { CarritoService } from './carrito.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CurrencyPipe],
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
