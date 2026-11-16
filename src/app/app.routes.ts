import { Routes } from '@angular/router';
import { ListaProductos } from './lista-productos/lista-productos';
import { DetalleProducto } from './detalle-producto/detalle-producto';
import { Ejemplo } from './ejemplo/ejemplo';
import { Login } from './login/login';
import {Ejemplodos} from "./ejemplodos/ejemplodos";
import { authGuard, loginGuard } from './auth-guard';
import { Carrito } from './carrito/carrito';
export const routes: Routes = [
    { path: 'login', component: Login, canActivate: [loginGuard] },
    { path: '', component: ListaProductos, canActivate: [authGuard] },
    { path: 'productos/:id', component: DetalleProducto, canActivate: [authGuard] },
    { path: 'ejemplo/:id', component: Ejemplo, canActivate: [authGuard] },
    { path: 'carrito', component: Carrito, canActivate: [authGuard] },
    { path: `aboutus`, component: Ejemplodos}
];
