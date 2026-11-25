import { AsyncPipe, DatePipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { combineLatest, map, startWith, timer } from "rxjs";
import { ApiService } from "../api-service";
import { ColumnaFooter, RedSocial } from "../contenido.model";

@Component({
  imports: [DatePipe, AsyncPipe, RouterLink],
  selector: "app-footer",
  styleUrl: "./footer.css",
  templateUrl: "./footer.html",
})
export class Footer implements OnInit {
  private readonly api = inject(ApiService);

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

  columnas = signal<ColumnaFooter[]>([]);
  redes = signal<RedSocial[]>([]);

  ngOnInit() {
    this.api.getFooter().subscribe((datos) => {
      this.columnas.set(datos.columnas);
      this.redes.set(datos.redes);
    });
  }

  alternarColumna(titulo: string) {
    this.columnaAbierta.update((actual) => (actual === titulo ? null : titulo));
  }

  suscribir(evento: Event) {
    evento.preventDefault();
    (evento.target as HTMLFormElement).reset();
    this.suscrito.set(true);
  }
}