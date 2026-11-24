import { Routes } from '@angular/router';
import { ListaProductos } from './lista-productos/lista-productos';
import { DetalleProducto } from './detalle-producto/detalle-producto';
import { Login } from './login/login';
import { authGuard, loginGuard } from './auth-guard';
import { Carrito } from './carrito/carrito';
import { Home } from './home/home';
export const routes: Routes = [
    { path: 'login', component: Login, canActivate: [loginGuard] },
    { path: '', component: Home, canActivate: [authGuard] },
    { path: "catalogo", component: ListaProductos, canActivate: [authGuard]},
    { path: 'productos/:id', component: DetalleProducto, canActivate: [authGuard] },
    { path: 'carrito', component: Carrito, canActivate: [authGuard] },
];