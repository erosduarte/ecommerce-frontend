import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ItemCarrito } from './carrito.model';
import { Product } from './product.model';
import { Productos } from '../../productos';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private readonly http = inject(HttpClient);

  items = signal<ItemCarrito[]>(JSON.parse(localStorage.getItem('carrito') ?? '[]'));
  saldo = signal(0);
  cargando = signal(false);
  mensaje = signal('');
  error = signal('');
  compraRealizada = signal<number | null>(null);

  total = computed(() => this.redondear(this.items().reduce((suma, i) => suma + i.price * i.cantidad, 0)));
  disponible = computed(() => this.redondear(this.saldo() - this.total()));
  cantidadTotal = computed(() => this.items().reduce((suma, i) => suma + i.cantidad, 0));

  constructor() {
    effect(() => {
      localStorage.setItem('carrito', JSON.stringify(this.items()));
    });
  }

  cargarSaldo() {
    this.http.get<{ saldo: number }>('/api/saldo').subscribe({
      next: (datos) => this.saldo.set(datos.saldo),
      error: (err) => this.mostrarError(err),
    });
  }

  agregar(producto: Product, cantidad: number, talla: string | null, color: string | null) {
    this.limpiarMensajes();

    if (!producto.active || producto.stock <= 0) {
      this.error.set('Producto no disponible');
      return;
    }
    if (producto.size.length && (!talla || !producto.size.includes(talla))) {
      this.error.set('Talla invalida');
      return;
    }
    if (producto.color.length && (!color || !producto.color.includes(color))) {
      this.error.set('Color invalido');
      return;
    }

    const id = `${producto.id}-${talla ?? 'sin'}-${color ?? 'sin'}`;
    const enCarrito = this.items()
      .filter((i) => i.productId === producto.id)
      .reduce((suma, i) => suma + i.cantidad, 0);
    if (enCarrito + cantidad > producto.stock) {
      this.error.set('Stock insuficiente');
      return;
    }

    if (this.redondear(this.total() + producto.price * cantidad) > this.saldo()) {
      this.error.set('Saldo insuficiente, solo tienes 100 USD disponibles');
      return;
    }

    const existente = this.items().find((i) => i.id === id);
    if (existente) {
      this.items.update((lista) =>
        lista.map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + cantidad } : i))
      );
    } else {
      this.items.update((lista) => [
        ...lista,
        {
          id,
          productId: producto.id,
          name: producto.name,
          price: producto.price,
          images: producto.images,
          cantidad,
          talla,
          color,
        },
      ]);
    }
    this.mensaje.set('Producto agregado al carrito');
  }

  actualizar(itemId: string, cantidad: number) {
    this.limpiarMensajes();

    const item = this.items().find((i) => i.id === itemId);
    const producto = Productos.find((p) => p.id === item?.productId);
    if (!item || !producto) return;

    const otros = this.items()
      .filter((i) => i.productId === item.productId && i.id !== item.id)
      .reduce((suma, i) => suma + i.cantidad, 0);
    if (otros + cantidad > producto.stock) {
      this.error.set('Stock insuficiente');
      return;
    }

    const totalNuevo = this.redondear(this.total() - item.price * item.cantidad + item.price * cantidad);
    if (totalNuevo > this.saldo()) {
      this.error.set('Saldo insuficiente, solo tienes 100 USD disponibles en este momento');
      return;
    }

    this.items.update((lista) => lista.map((i) => (i.id === itemId ? { ...i, cantidad } : i)));
  }

  eliminar(itemId: string) {
    this.limpiarMensajes();
    this.items.update((lista) => lista.filter((i) => i.id !== itemId));
  }

  vaciar() {
    this.limpiarMensajes();
    this.items.set([]);
  }

  comprar() {
    this.limpiarMensajes();

    if (!this.items().length) {
      this.error.set('El carrito esta vacio');
      return;
    }

    for (const item of this.items()) {
      const producto = Productos.find((p) => p.id === item.productId);
      const pedido = this.items()
        .filter((i) => i.productId === item.productId)
        .reduce((suma, i) => suma + i.cantidad, 0);
      if (!producto || !producto.active || pedido > producto.stock) {
        this.error.set(`Stock insuficiente de ${item.name}`);
        return;
      }
    }

    const total = this.total();
    this.cargando.set(true);
    this.http.post<{ saldo: number }>('/api/saldo/descontar', { monto: total }).subscribe({
      next: (datos) => {
        for (const item of this.items()) {
          const producto = Productos.find((p) => p.id === item.productId);
          if (producto) producto.stock -= item.cantidad;
        }
        this.saldo.set(datos.saldo);
        this.items.set([]);
        this.compraRealizada.set(total);
        this.cargando.set(false);
      },
      error: (err) => this.mostrarError(err),
    });
  }

  limpiarMensajes() {
    this.mensaje.set('');
    this.error.set('');
    this.compraRealizada.set(null);
  }

  private redondear(valor: number): number {
    return Math.round(valor * 100) / 100;
  }

  private mostrarError(err: HttpErrorResponse) {
    this.error.set(err.error?.mensaje ?? 'No se pudo conectar al servidor');
    this.cargando.set(false);
  }
}
