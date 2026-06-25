import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ItemCarrito } from '../../models/carrito';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, FormsModule, NgFor, NgIf, RouterLink],
  template: `
    <main>
      <section>
        <h1>Carrito de Compras</h1>
        <table *ngIf="items$ | async as items">
          <caption>Resumen del carrito actual</caption>
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Precio Unitario</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Subtotal</th>
              <th scope="col">Accion</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of items">
              <td>{{ item.producto.nombre }}</td>
              <td>{{ item.producto.precio | currency:'COP':'symbol-narrow':'1.0-0':'es-CO' }}</td>
              <td><input class="quantity-input" type="number" min="1" [ngModel]="item.cantidad" (ngModelChange)="cantidad(item, $event)"></td>
              <td>{{ item.subtotal | currency:'COP':'symbol-narrow':'1.0-0':'es-CO' }}</td>
              <td><button type="button" class="button-ghost" (click)="carrito.eliminar(item.producto.id)">Eliminar</button></td>
            </tr>
            <tr *ngIf="items.length === 0"><td colspan="5">Tu carrito esta vacio.</td></tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colspan="4">Total de compra</th>
              <td><strong>{{ total$ | async | currency:'COP':'symbol-narrow':'1.0-0':'es-CO' }}</strong></td>
            </tr>
          </tfoot>
        </table>
        <div class="cart-actions">
          <a class="btn" routerLink="/checkout">Finalizar compra</a>
          <button type="button" class="button-ghost" (click)="carrito.vaciar()">Vaciar carrito</button>
        </div>
      </section>
      <section>
        <h2>Indicadores del pedido</h2>
        <p>Descuento aplicado: <meter value="75" min="0" max="100">75%</meter></p>
        <p>Progreso del pedido: <progress value="3" max="10">3 de 10</progress></p>
      </section>
    </main>
  `
})
export class CarritoComponent {
  protected readonly carrito = inject(CarritoService);
  protected readonly items$ = this.carrito.items$;
  protected readonly total$ = this.carrito.total$;

  cantidad(item: ItemCarrito, value: number): void {
    this.carrito.cambiarCantidad(item.producto.id, Number(value));
  }
}
