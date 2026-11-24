import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, Service } from '@angular/core';
import { Product } from './product.model';
import { Productos } from '../../productos';
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
}
