import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { ItemCarrito } from '../models/carrito';
import { Producto } from '../models/producto';

const STORAGE_KEY = 'techstore-angular-cart';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly itemsSubject = new BehaviorSubject<ItemCarrito[]>(this.cargar());
  readonly items$ = this.itemsSubject.asObservable();
  readonly cantidad$ = this.items$.pipe(map((items) => items.reduce((total, item) => total + item.cantidad, 0)));
  readonly total$ = this.items$.pipe(map((items) => this.calcularTotal(items)));

  agregar(producto: Producto): void {
    const items = [...this.itemsSubject.value];
    const actual = items.find((item) => item.producto.id === producto.id);
    if (actual) {
      actual.cantidad += 1;
      actual.subtotal = actual.cantidad * actual.producto.precio;
    } else {
      items.push({ producto, cantidad: 1, subtotal: producto.precio });
    }
    this.actualizar(items);
  }

  eliminar(id: string): void {
    this.actualizar(this.itemsSubject.value.filter((item) => item.producto.id !== id));
  }

  cambiarCantidad(id: string, cantidad: number): void {
    const segura = Math.max(1, cantidad);
    this.actualizar(
      this.itemsSubject.value.map((item) =>
        item.producto.id === id ? { ...item, cantidad: segura, subtotal: item.producto.precio * segura } : item
      )
    );
  }

  vaciar(): void {
    this.actualizar([]);
  }

  calcularTotal(items = this.itemsSubject.value): number {
    return items.reduce((total, item) => total + item.subtotal, 0);
  }

  private actualizar(items: ItemCarrito[]): void {
    this.itemsSubject.next(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  private cargar(): ItemCarrito[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as ItemCarrito[];
    } catch {
      return [];
    }
  }
}
