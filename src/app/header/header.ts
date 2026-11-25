import { Component, computed, effect, ElementRef, HostListener, inject, OnInit, signal, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../auth.service';
import { CarritoService } from '../carrito.service';
import { MonedaService } from '../moneda.service';
import { PrecioPipe } from '../precio.pipe';
import { ApiService } from '../api-service';
import { SeccionMenu } from '../contenido.model';

@Component({
  selector: 'app-header',
  imports: [RouterLink, PrecioPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  readonly auth = inject(AuthService);
  readonly carrito = inject(CarritoService);
  readonly moneda = inject(MonedaService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  esInicio = signal(true);
  scrolled = signal(false);
  sobreHero = signal(true);
  menuAbierto = signal<string | null>(null);
  subMenuMovilAbierto = signal<string | null>(null);
  menuMovil = signal(false);
  buscando = signal(false);
  entrada = viewChild<ElementRef<HTMLInputElement>>('entrada');

  secciones = signal<SeccionMenu[]>([]);

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
    () => this.secciones().find((s) => s.nombre === this.menuAbierto()) ?? null
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

  ngOnInit() {
    this.api.getMenu().subscribe((datos) => this.secciones.set(datos));
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