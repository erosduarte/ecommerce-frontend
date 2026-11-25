import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from '../api-service';
import { Product } from '../product.model';
import { Producto } from '../producto/producto';

type Orden = 'precio-asc' | 'precio-desc';

interface Miga {
  texto: string;
  ruta?: string;
  params?: Record<string, string>;
}

const ORDENES: { valor: Orden; texto: string }[] = [
  { valor: 'precio-asc', texto: 'Precio: menor a mayor' },
  { valor: 'precio-desc', texto: 'Precio: mayor a menor' },
];

const DESCRIPCION_GENERAL =
  'Piezas de uso diario con cortes cómodos y materiales pensados para durar. Fáciles de combinar, para el trabajo, el fin de semana y todo lo que hay entre ambos.';

const DESCRIPCIONES: Record<string, string> = {
  camisetas:
    'La base de cualquier look. Camisetas de corte cómodo y tejidos suaves, pensadas para combinar con todo, del trabajo al fin de semana y todo lo que hay entre ambos.',
  jeans:
    'Denim de caída limpia y cortes que funcionan todo el año. Pantalones resistentes y fáciles de combinar, diseñados para el uso diario.',
  zapatos:
    'Calzado cómodo y de líneas simples para caminar la ciudad. Pensado para acompañar cada día, del trabajo a la salida de la noche.',
  ropa: DESCRIPCION_GENERAL,
  calzado:
    'Calzado cómodo y de líneas simples para caminar la ciudad. Pensado para acompañar cada día, del trabajo a la salida de la noche.',
  accesorios:
    'Los detalles que completan el conjunto. Accesorios prácticos y de líneas sobrias, para usar todos los días.',
};

const RANGO_TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function compararTallas(a: string, b: string): number {
  const ia = RANGO_TALLAS.indexOf(a);
  const ib = RANGO_TALLAS.indexOf(b);
  if (ia >= 0 && ib >= 0) return ia - ib;
  if (ia >= 0) return -1;
  if (ib >= 0) return 1;
  const na = Number(a);
  const nb = Number(b);
  if (!isNaN(na) && !isNaN(nb)) return na - nb;
  return a.localeCompare(b);
}

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

@Component({
  selector: 'app-lista-productos',
  imports: [Producto, RouterLink],
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.css',
})
export class ListaProductos implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly ordenes = ORDENES;

  filtroTalla = signal<string | null>(null);
  filtroColor = signal<string | null>(null);
  filtroCategoria = signal<string | null>(null);
  filtroSubCategoria = signal<string | null>(null);
  filtroBusqueda = signal<string>(``);
  filtroOrden = signal<Orden | null>(null);
  productos = signal<Product[]>([]);

  // Selección temporal dentro del panel de filtros (se aplica con "Aplicar")
  filtrosAbiertos = signal(false);
  borradorTalla = signal<string | null>(null);
  borradorColor = signal<string | null>(null);
  borradorOrden = signal<Orden | null>(null);

  ngOnInit() {
    const saludo$ = of(`Hola mundo`);

    this.api.getCatalogo().subscribe((datos) => {
      this.productos.set(datos);
    });
    this.route.queryParamMap.subscribe((params) => {
      this.filtroTalla.set(params.get('size'));
      this.filtroColor.set(params.get('color'));
      this.filtroCategoria.set(params.get('categoria'));
      this.filtroSubCategoria.set(params.get('subcategoria'));
      this.filtroBusqueda.set(params.get('busqueda') ?? '');
      const orden = params.get('orden');
      this.filtroOrden.set(ORDENES.some((o) => o.valor === orden) ? (orden as Orden) : null);
    });

    saludo$.subscribe((mensaje) => {
      console.log(mensaje);
    });
  }

  // Productos de la colección actual, antes de talla / color / orden
  private readonly coleccion = computed(() => {
    const lista = this.productos();
    const categoria = this.filtroCategoria();
    const subCategoria = this.filtroSubCategoria();
    const busqueda = this.filtroBusqueda().toLowerCase().trim();
    return lista.filter((p) => {
      const cumpleCategoria = categoria ? p.category.includes(categoria) : true;
      const cumpleSubCategoria = subCategoria
        ? p.subcategory?.toLowerCase() === subCategoria.toLowerCase()
        : true;
      const cumpleBusqueda = busqueda
        ? p.name.toLowerCase().includes(busqueda) ||
          p.color.some((c) => c.toLowerCase().includes(busqueda)) ||
          p.size.some((s) => s.toLowerCase().includes(busqueda))
        : true;
      return cumpleCategoria && cumpleSubCategoria && cumpleBusqueda;
    });
  });

  productosFiltrados = computed(() => {
    const talla = this.filtroTalla();
    const color = this.filtroColor();
    const orden = this.filtroOrden();
    const lista = this.coleccion().filter((p) => {
      const cumpleTalla = talla ? p.size.includes(talla) : true;
      const cumpleColor = color ? p.color.includes(color) : true;
      return cumpleTalla && cumpleColor;
    });
    if (orden === 'precio-asc') return [...lista].sort((a, b) => a.price - b.price);
    if (orden === 'precio-desc') return [...lista].sort((a, b) => b.price - a.price);
    return lista;
  });

  tallasDisponibles = computed(() =>
    [...new Set(this.coleccion().flatMap((p) => p.size))].sort(compararTallas)
  );

  coloresDisponibles = computed(() => [
    ...new Set(this.coleccion().flatMap((p) => p.color)),
  ]);

  filtrosActivos = computed(
    () => [this.filtroTalla(), this.filtroColor(), this.filtroOrden()].filter(Boolean).length
  );

  titulo = computed(() => {
    const busqueda = this.filtroBusqueda().trim();
    if (busqueda) return `Resultados: ${busqueda}`;
    const sub = this.filtroSubCategoria();
    if (sub) return capitalizar(sub);
    return this.filtroCategoria() ?? 'Catálogo';
  });

  descripcion = computed(() => {
    const sub = this.filtroSubCategoria()?.toLowerCase();
    const categoria = this.filtroCategoria()?.toLowerCase();
    return (
      (sub && DESCRIPCIONES[sub]) || (categoria && DESCRIPCIONES[categoria]) || DESCRIPCION_GENERAL
    );
  });

  migas = computed<Miga[]>(() => {
    const migas: Miga[] = [{ texto: 'Inicio', ruta: '/' }];
    const categoria = this.filtroCategoria();
    const sub = this.filtroSubCategoria();

    if (this.filtroBusqueda().trim()) {
      migas.push({ texto: 'Catálogo', ruta: '/catalogo' }, { texto: 'Búsqueda' });
    } else if (!categoria && !sub) {
      migas.push({ texto: 'Catálogo' });
    } else {
      if (categoria) {
        migas.push({ texto: categoria, ruta: '/catalogo', params: { categoria } });
      }
      if (sub) migas.push({ texto: capitalizar(sub) });
    }
    return migas;
  });

  abrirFiltros() {
    this.borradorTalla.set(this.filtroTalla());
    this.borradorColor.set(this.filtroColor());
    this.borradorOrden.set(this.filtroOrden());
    this.filtrosAbiertos.set(true);
  }

  @HostListener('document:keydown.escape')
  cerrarFiltros() {
    this.filtrosAbiertos.set(false);
  }

  alternarTalla(talla: string) {
    this.borradorTalla.update((actual) => (actual === talla ? null : talla));
  }

  alternarColor(color: string) {
    this.borradorColor.update((actual) => (actual === color ? null : color));
  }

  alternarOrden(orden: Orden) {
    this.borradorOrden.update((actual) => (actual === orden ? null : orden));
  }

  aplicar() {
    this.navegarConFiltros(this.borradorTalla(), this.borradorColor(), this.borradorOrden());
  }

  limpiar() {
    this.navegarConFiltros(null, null, null);
  }

  aplicarFiltro(talla: string | null, color: string | null) {
    this.navegarConFiltros(talla, color, this.filtroOrden());
  }

  private navegarConFiltros(talla: string | null, color: string | null, orden: Orden | null) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        size: talla || null,
        color: color || null,
        orden: orden || null,
      },
      queryParamsHandling: 'merge',
    });
    this.cerrarFiltros();
  }
}