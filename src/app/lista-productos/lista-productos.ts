import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../api-service';
import { Product } from '../product.model';
import { Producto } from '../producto/producto';
import {computed} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from "rxjs";
@Component({
  selector: 'app-lista-productos',
  imports: [Producto],
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.css',
})
export class ListaProductos implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  filtroTalla = signal<string | null>(null);
  filtroColor = signal<string | null>(null);
  filtroBusqueda = signal<string>(``);
  productos = signal<Product[]>([]);

  ngOnInit() {
      const saludo$ = of(`Hola mundo`);

    this.api.getCatalogo().subscribe((datos) => {
      this.productos.set(datos);

    });
    this.route.queryParamMap.subscribe((params) => {
      this.filtroTalla.set(params.get('size'));
      this.filtroColor.set(params.get('color'));
    });

    saludo$.subscribe((mensaje)=>{
      console.log(mensaje)
    });
  }

  productosFiltrados = computed(() => {
    const lista = this.productos();
    const talla = this.filtroTalla();
    const color = this.filtroColor();
    const busqueda = this.filtroBusqueda().toLowerCase().trim();
    return lista.filter((p) => {
      const cumpleTalla = talla ? p.size.includes(talla) : true;

      const cumpleColor = color  ? p.color.includes(color) : true;
      const cumpleBusqueda = busqueda ? p.name.toLowerCase().includes(busqueda) : true;
      return cumpleTalla && cumpleColor && cumpleBusqueda;
    });
  });

  aplicarFiltro(talla: string | null, color: string | null) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        size: talla || null,
        color: color || null
      },
      queryParamsHandling: 'merge',
    });
  }

  onBuscar(event: Event){
    const input = event.target as HTMLInputElement;
     this.filtroBusqueda.set(input.value);
  }
}
