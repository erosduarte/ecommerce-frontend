import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../carrito.service';
import { EfectoImagenDirective } from '../shared/directives/efecto-imagen';

@Component({
  selector: 'app-carrito',
  imports: [CurrencyPipe, RouterLink, EfectoImagenDirective],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito implements OnInit {
  readonly carritoService = inject(CarritoService);

  ngOnInit() {
    this.carritoService.limpiarMensajes();
    this.carritoService.cargarSaldo();
  }

  cambiarCantidad(itemId: string, cantidad: number) {
    if (cantidad < 1) return;
    this.carritoService.actualizar(itemId, cantidad);
  }

  eliminar(itemId: string) {
    this.carritoService.eliminar(itemId);
  }

  vaciar() {
    this.carritoService.vaciar();
  }

  comprar() {
    this.carritoService.comprar();
  }
}
