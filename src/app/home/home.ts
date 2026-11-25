import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../api-service';
import { Categoria, Coleccion, Pilar } from '../contenido.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly api = inject(ApiService);

  categorias = signal<Categoria[]>([]);
  colecciones = signal<Coleccion[]>([]);
  pilares = signal<Pilar[]>([]);

  ngOnInit() {
    this.api.getHome().subscribe((datos) => {
      this.categorias.set(datos.categorias);
      this.colecciones.set(datos.colecciones);
      this.pilares.set(datos.pilares);
    });
  }
}