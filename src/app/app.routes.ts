import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent), title: 'TechStore | Inicio' },
  { path: 'productos', loadChildren: () => import('./pages/productos/productos.routes').then((m) => m.PRODUCTOS_ROUTES) },
  { path: 'producto/:id', loadComponent: () => import('./pages/detalle-producto/detalle-producto.component').then((m) => m.DetalleProductoComponent), title: 'Detalle de producto' },
  { path: 'carrito', loadComponent: () => import('./pages/carrito/carrito.component').then((m) => m.CarritoComponent), title: 'Carrito' },
  { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('./pages/checkout/checkout.component').then((m) => m.CheckoutComponent), title: 'Checkout' },
  { path: 'contacto', loadComponent: () => import('./pages/contacto/contacto.component').then((m) => m.ContactoComponent), title: 'Contacto' },
  { path: 'admin', canActivate: [authGuard], loadComponent: () => import('./pages/admin/admin.component').then((m) => m.AdminComponent), title: 'Administracion' },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent), title: 'Pagina no encontrada' }
];
