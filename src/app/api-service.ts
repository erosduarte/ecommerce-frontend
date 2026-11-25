import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, Service } from '@angular/core';
import { Product } from './product.model';
import { Productos } from '../../productos';
import { FooterContenido, HomeContenido, SeccionMenu } from './contenido.model';
import {of,  Observable, map } from 'rxjs';


@Injectable ({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);

  getCatalogo(): Observable<Product[]> {
    return this.http.get<Product[]>("/api/catalogo");
  }

  getCatalogoById(id: number): Observable<Product | undefined> {
   return this.getCatalogo().pipe(map((productos) => productos.find((p) => p.id === id)));
  }

    getHome(): Observable<HomeContenido> {
    return this.http.get<HomeContenido>('/api/contenido/home');
  }

  getMenu(): Observable<SeccionMenu[]> {
    return this.http.get<SeccionMenu[]>('/api/contenido/menu');
  }

  getFooter(): Observable<FooterContenido> {
    return this.http.get<FooterContenido>('/api/contenido/footer');
  }
}
