# TechStore Angular

Migracion de la maqueta `XTechStore` a una SPA con Angular, siguiendo la practica de Front-End Ecommerce con Angular.

## Ejecucion

```bash
npm install
npm start
```

La app queda disponible por defecto en `http://localhost:4200/`.

## Arquitectura

- `src/app/components`: navbar, footer, buscador, menu de categorias y tarjeta de producto.
- `src/app/pages`: home, productos, detalle, carrito, checkout, contacto, admin y not-found.
- `src/app/services`: productos, carrito, autenticacion demo y tema.
- `src/app/models`: Producto, Cliente, Orden e ItemCarrito.
- `src/app/guards`: proteccion de checkout y admin.
- `src/app/interceptors`: interceptor HTTP para token JWT demo y manejo global de errores.
- `src/app/pipes`: pipe `descuento`.

## Requisitos cubiertos

- Routing SPA con `router-outlet`.
- Lazy loading en la ruta `productos`.
- Data binding: interpolacion, property binding, event binding y two-way binding.
- Directivas: `*ngIf`, `*ngFor`, `*ngSwitch`, `[ngClass]` y `[ngStyle]`.
- Servicios con `Observable`, `BehaviorSubject`, `map`, `tap`, `catchError` y carrito en tiempo real.
- Consumo de Fake Store API con `HttpClient`.
- Formularios reactivos con validaciones dinamicas en checkout y contacto.
- Persistencia en `localStorage` para carrito, tema, newsletter, contacto y ordenes.
- Panel administrativo para agregar, editar, eliminar y revisar inventario.
- Bonus incluidos: tema oscuro, login demo, historial de compras local y favoritos visuales.
