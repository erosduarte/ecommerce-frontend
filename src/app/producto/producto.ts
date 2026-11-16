import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../product.model';
import { RouterLink } from '@angular/router';
import { EfectoImagenDirective } from '../shared/directives/efecto-imagen';

@Component({
  selector: 'app-producto',
  imports: [CurrencyPipe, RouterLink, EfectoImagenDirective],
  templateUrl: './producto.html',
  styleUrl: './producto.css',
})
export class Producto {
  producto = input.required<Product>();
}
