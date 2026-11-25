import { Component, computed, inject, input, OnDestroy, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../product.model';
import { CarritoService } from '../carrito.service';
import { PrecioPipe } from '../precio.pipe';

const MAX_MUESTRAS = 3;

const COLORES: Record<string, string> = {
  negro: '#151515',
  blanco: '#e6e1d8',
  gris: '#9b9a97',
  azul: '#2f4468',
  celeste: '#9fc0dc',
  beige: '#d9ccb4',
  crema: '#efe6d2',
  marron: '#6a4630',
  camel: '#b98a54',
  rojo: '#9c2a2a',
  rosa: '#d9a7a7',
  verde: '#3f5a45',
  amarillo: '#d4a63a',
  naranja: '#c9692e',
  morado: '#5b3f6e',
  plateado: '#bfc0c2',
  dorado: '#c9a24d',
};
const COLOR_NEUTRO = '#cfc9bf';

@Component({
  selector: 'app-producto',
  imports: [RouterLink, PrecioPipe],
  templateUrl: './producto.html',
  styleUrl: './producto.css',
})
export class Producto implements OnDestroy {
  readonly producto = input.required<Product>();

  private readonly carrito = inject(CarritoService);
  private readonly router = inject(Router);
  private temporizador?: ReturnType<typeof setTimeout>;

  readonly imagenActual = signal(0);
  readonly colorElegido = signal<string | null>(null);
  readonly aviso = signal<string | null>(null);

  readonly disponible = computed(() => this.producto().active && this.producto().stock > 0);
  readonly colorActivo = computed(() => this.colorElegido() ?? this.producto().color[0] ?? null);
  readonly muestras = computed(() => this.producto().color.slice(0, MAX_MUESTRAS));
  readonly hayMasColores = computed(() => this.producto().color.length > MAX_MUESTRAS);
  readonly hayVariasImagenes = computed(() => this.producto().images.length > 1);

  readonly etiqueta = computed(() => {
    const p = this.producto();
    if (!this.disponible()) return 'Agotado';
    if (p.oferta) return 'Oferta';
    if (p.stock <= 5) return 'Poco stock';
    return 'Nuevo';
  });

  readonly textoBoton = computed(() => {
    if (this.aviso()) return this.aviso();
    if (!this.disponible()) return 'Agotado';
    return this.producto().size.length > 1 ? 'Elegir talla' : 'Agregar al carrito';
  });

  hex(color: string): string {
    const clave = color.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return COLORES[clave] ?? COLOR_NEUTRO;
  }

  elegirColor(color: string) {
    this.colorElegido.set(color);
  }

  anterior(evento: Event) {
    evento.preventDefault();
    const total = this.producto().images.length;
    this.imagenActual.update((i) => (i - 1 + total) % total);
  }

  siguiente(evento: Event) {
    evento.preventDefault();
    const total = this.producto().images.length;
    this.imagenActual.update((i) => (i + 1) % total);
  }

  agregar() {
    const p = this.producto();
    if (!this.disponible()) return;

    // Con varias tallas no se puede elegir por el cliente: se abre el detalle.
    if (p.size.length > 1) {
      this.router.navigate(['/productos', p.id]);
      return;
    }

    this.carrito.agregar(p, 1, p.size[0] ?? null, this.colorActivo());
    this.mostrarAviso(this.carrito.error() || 'Agregado');
  }

  ngOnDestroy() {
    clearTimeout(this.temporizador);
  }

  private mostrarAviso(texto: string) {
    clearTimeout(this.temporizador);
    this.aviso.set(texto);
    this.temporizador = setTimeout(() => this.aviso.set(null), 1800);
  }
}