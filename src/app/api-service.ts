import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, Service } from '@angular/core';
import { Product } from './product.model';
import { Productos } from '../../productos';
import {of,  Observable } from 'rxjs';


@Injectable ({
  providedIn: 'root'
})
export class ApiService {


  getCatalogo(): Observable<Product[]> {
    return of(Productos);
  }

  getCatalogoById(id: number): Observable<Product | undefined> {
   const producto = Productos.find((p) => p.id === id);
   return of(producto);
  }
}
