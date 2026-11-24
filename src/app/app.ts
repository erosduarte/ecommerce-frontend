import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { CarritoService } from './carrito.service';
import { Header } from './header/header';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
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