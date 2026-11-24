import { AsyncPipe, DatePipe } from "@angular/common";
import { Component, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { combineLatest, map, startWith, timer } from "rxjs";

interface EnlaceFooter {
  texto: string;
  ruta: string;
  params?: Record<string, string>;
}

interface ColumnaFooter {
  titulo: string;
  enlaces: EnlaceFooter[];
}

@Component({
  imports: [DatePipe, AsyncPipe, RouterLink],
  selector: "app-footer",
  styleUrl: "./footer.css",
  templateUrl: "./footer.html",
})
export class Footer {
  private mensaje$ = timer(5000, 5000).pipe(map(() => "Ya se manejar observables:)"), startWith(undefined));
  private contador$ = timer(0, 5000).pipe(map((i) => i + 1));
  private minuto$ = timer(60000, 60000).pipe(map(() => "Ya paso un minuto"), startWith(undefined));

  readonly hora$ = timer(0, 1000).pipe(map(() => new Date()));

  datosCombinados$ = combineLatest({
    mensaje: this.mensaje$,
    contador: this.contador$,
    minutos: this.minuto$,
  }).pipe(
    map(({ mensaje, contador, minutos }) => ({
      ...(mensaje !== undefined && { mensaje }),
      contador,
      ...(minutos !== undefined && { minutos }),
    }))
  );

  anio = new Date().getFullYear();
  suscrito = signal(false);
  columnaAbierta = signal<string | null>(null);

  columnas: ColumnaFooter[] = [
    {
      titulo: "Atención al cliente",
      enlaces: [
        { texto: "Contacto", ruta: "/aboutus" },
        { texto: "Envíos", ruta: "/" },
        { texto: "Devoluciones", ruta: "/" },
        { texto: "Preguntas frecuentes", ruta: "/" },
      ],
    },
    {
      titulo: "Tienda",
      enlaces: [
        { texto: "Catálogo", ruta: "/catalogo" },
        { texto: "Camisetas", ruta: "/catalogo", params: { categoria: "Ropa", subcategoria: "camisetas" } },
        { texto: "Zapatos", ruta: "/catalogo", params: { categoria: "Calzado", subcategoria: "zapatos" } },
        { texto: "Accesorios", ruta: "/catalogo", params: { categoria: "Accesorios" } },
      ],
    },
    {
      titulo: "Nosotros",
      enlaces: [
        { texto: "Nuestra historia", ruta: "/aboutus" },
        { texto: "Carrito", ruta: "/carrito" },
      ],
    },
  ];

  redes = [
    { texto: "Instagram", url: "https://www.instagram.com" },
    { texto: "TikTok", url: "https://www.tiktok.com" },
    { texto: "Facebook", url: "https://www.facebook.com" },
    { texto: "Pinteres", url: "https://es.pinterest.com/" },
  ];

  alternarColumna(titulo: string) {
    this.columnaAbierta.update((actual) => (actual === titulo ? null : titulo));
  }

  suscribir(evento: Event) {
    evento.preventDefault();
    (evento.target as HTMLFormElement).reset();
    this.suscrito.set(true);
  }
}