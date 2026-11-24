import { Component, computed, effect, ElementRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../auth.service';
import { CarritoService } from '../carrito.service';
import { MonedaService } from '../moneda.service';
import { PrecioPipe } from '../precio.pipe';

type Filtro = Record<string, string>;

interface EnlaceMenu {
  texto: string;
  params: Filtro;
}

interface ColumnaMenu {
  titulo: string;
  enlaces: EnlaceMenu[];
}

interface DestacadoMenu extends EnlaceMenu {
  imagen: string;
}

interface SeccionMenu {
  nombre: string;
  params: Filtro;
  columnas: ColumnaMenu[];
  destacados: DestacadoMenu[];
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, PrecioPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly auth = inject(AuthService);
  readonly carrito = inject(CarritoService);
  readonly moneda = inject(MonedaService);
  private readonly router = inject(Router);

  esInicio = signal(true);
  scrolled = signal(false);
  sobreHero = signal(true);
  menuAbierto = signal<string | null>(null);
  subMenuMovilAbierto = signal<string | null>(null);
  menuMovil = signal(false);
  buscando = signal(false);
  entrada = viewChild<ElementRef<HTMLInputElement>>('entrada');

  secciones: SeccionMenu[] = [
    {
      nombre: 'Camisetas',
      params: { categoria: 'Ropa', subcategoria: 'camisetas' },
      columnas: [
        {
          titulo: 'Categoría',
          enlaces: [
            { texto: 'Ver todo', params: { categoria: 'Ropa' } },
            { texto: 'Camisetas', params: { categoria: 'Ropa', subcategoria: 'camisetas' } },
          ],
        },
      ],
      destacados: [
        { texto: 'Camisetas', imagen: 'https://static.bershka.net/assets/public/a1ec/e606/d3734ae9ba90/f2332a656f4d/04559071250-a4o/04559071250-a4o.jpg?ts=1794478930807&w=750&f=auto', params: { categoria: 'Ropa', subcategoria: 'camisetas' } },
        { texto: 'Ropa', imagen: 'https://static.bershka.net/assets/public/d5f9/13a2/77bf4423b239/c33e2990e868/02997116420-a4o/02997116420-a4o.jpg?ts=1793635944554&w=750&f=auto', params: { categoria: 'Ropa' } },
      ],
    },
    {
      nombre: 'Jeans',
      params: { categoria: 'Ropa', subcategoria: 'jeans' },
      columnas: [
        {
          titulo: 'Categoría',
          enlaces: [
            { texto: 'Ver todo', params: { categoria: 'Ropa' } },
            { texto: 'Jeans', params: { categoria: 'Ropa', subcategoria: 'jeans' } },
          ],
        },
      ],
      destacados: [
        { texto: 'Flared jeans', imagen: 'https://static.bershka.net/assets/public/0470/d118/e70c4ead8beb/80122f0fde1c/02892054800-a4o/02892054800-a4o.jpg?ts=1781684157786&w=850&f=auto', params: { categoria: 'Ropa', subcategoria: 'jeans' } },
      ],
    },
    {
      nombre: 'Zapatos',
      params: { categoria: 'Calzado', subcategoria: 'zapatos' },
      columnas: [
        {
          titulo: 'Categoría',
          enlaces: [
            { texto: 'Ver todo', params: { categoria: 'Calzado' } },
            { texto: 'Zapatos', params: { categoria: 'Calzado', subcategoria: 'zapatos' } },
          ],
        },
      ],
      destacados: [
        { texto: 'Zapatos', imagen: 'https://static.bershka.net/assets/public/45a9/a04e/20f34203b04f/f739974d384c/12314864040-01-a4o/12314864040-01-a4o.jpg?ts=1781854696527&w=750&f=auto', params: { categoria: 'Calzado', subcategoria: 'zapatos' } },
        { texto: 'Calzado', imagen: 'https://static.bershka.net/assets/public/3c7b/2aa5/b85b42968d1e/cf6708dbccab/12422864040-a4o/12422864040-a4o.jpg?ts=1789118082738&w=750&f=auto', params: { categoria: 'Calzado' } },
      ],
    },
    {
      nombre: 'Accesorios',
      params: { categoria: 'Accesorios' },
      columnas: [
        {
          titulo: 'Categoría',
          enlaces: [{ texto: 'Ver todo', params: { categoria: 'Accesorios' } }],
        },
      ],
      destacados: [
        { texto: 'Accesorios', imagen: 'https://static.bershka.net/assets/public/07b7/e0e8/5b8a4e7690d8/302e5a4c7f56/02692419800-a4o/02692419800-a4o.jpg?ts=1782986482905&w=750&f=auto', params: { categoria: 'Accesorios' } },
      ],
    },
  ];

  transparente = computed(
    () =>
      this.esInicio() &&
      this.sobreHero() &&
      !this.menuAbierto() &&
      !this.menuMovil() &&
      !this.buscando()
  );

  logoGrande = computed(() => this.transparente() && !this.scrolled());

  seccionActual = computed(
    () => this.secciones.find((s) => s.nombre === this.menuAbierto()) ?? null
  );

  constructor() {
    effect(() => {
      if (this.buscando()) {
        setTimeout(() => this.entrada()?.nativeElement.focus());
      }
    });

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.esInicio.set(e.urlAfterRedirects.split('?')[0] === '/');
        this.cerrar();
        this.menuMovil.set(false);
        this.subMenuMovilAbierto.set(null);
        this.buscando.set(false);
        this.onScroll();
      });
  }

  alternarMovil() {
    this.menuMovil.update((v) => {
      const siguiente = !v;
      if (!siguiente) {
        this.subMenuMovilAbierto.set(null);
      }
      return siguiente;
    });
  }

  alternarSubMenuMovil(nombre: string) {
    this.subMenuMovilAbierto.update((actual) => (actual === nombre ? null : nombre));
  }

  abrir(nombre: string) {
    this.buscando.set(false);
    this.menuAbierto.set(nombre);
  }

  alternarBusqueda() {
    this.menuAbierto.set(null);
    this.menuMovil.set(false);
    this.subMenuMovilAbierto.set(null);
    this.buscando.update((v) => !v);
  }

  cerrarBusqueda() {
    this.buscando.set(false);
  }

  buscar(evento: Event, texto: string) {
    evento.preventDefault();
    const termino = texto.trim();
    this.router.navigate(['/catalogo'], {
      queryParams: { busqueda: termino },
    });
    this.buscando.set(false);
  }

  cambiarMoneda(evento: Event) {
    this.moneda.elegir((evento.target as HTMLSelectElement).value);
  }

  cerrarSesion() {
    this.auth.logout();
    this.menuMovil.set(false);
    this.subMenuMovilAbierto.set(null);
    this.router.navigate(['/login']);
  }

  @HostListener('mouseleave')
  cerrar() {
    this.menuAbierto.set(null);
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onScroll() {
    const y = window.scrollY;
    const movil = window.innerWidth <= 768;
    const alturaHero = window.innerHeight * (movil ? 0.65 : 0.9);
    this.scrolled.set(y > 40);
    this.sobreHero.set(y < alturaHero - 46);
  }
}