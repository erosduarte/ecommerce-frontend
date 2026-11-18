import { Component, inject, OnInit, signal } from "@angular/core";
import { Product } from "../product.model";
import { ApiService } from "../api-service";
import { RouterLink } from "@angular/router";
import { Productos } from "../../../productos";
import { Producto } from "../producto/producto";

@Component({
  imports: [RouterLink, Producto],
  selector: "app-home",
  styleUrl: "./home.css",
  templateUrl: "./home.html",
})
export class Home implements OnInit {
  private readonly api = inject(ApiService);
  productos = signal<Product[]>([]);

  categorias = [
    { nombre: 'Camisetas',  categoria: 'Ropa',       subcategoria: 'camisetas', imagen: 'https://static.bershka.net/assets/public/0357/e7b9/fadc49339a7a/3c1911353943/04628734250-a4o/04628734250-a4o.jpg?ts=1790683053239&w=750&f=auto' },
    { nombre: 'Zapatos',    categoria: 'Calzado',    subcategoria: 'zapatos',   imagen: 'https://static.bershka.net/assets/public/a45d/697c/e92146e794c1/30c10ea7d5ab/03678710711-a4o/03678710711-a4o.jpg?ts=1789572656016&w=750&f=auto' },
    { nombre: 'Accesorios', categoria: 'Accesorios', subcategoria: null,        imagen: 'https://static.bershka.net/assets/public/6352/adea/d3ca447982db/0ef21a48260b/04367678808-a4o/04367678808-a4o.jpg?ts=1791472949778&w=750&f=auto' },
  ];

  ngOnInit() {
    this.api.getCatalogo().subscribe((datos) => this.productos.set(datos));
  }
}


