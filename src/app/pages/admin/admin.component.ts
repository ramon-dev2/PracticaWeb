import { AsyncPipe, CurrencyPipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, NgFor, ReactiveFormsModule],
  template: `
    <main class="layout">
      <section>
        <h1>Panel administrativo</h1>
        <form [formGroup]="form" (ngSubmit)="guardar()">
          <label for="nombre">Producto</label>
          <input id="nombre" formControlName="nombre">
          <label for="precio">Precio</label>
          <input id="precio" type="number" formControlName="precio">
          <label for="stock">Inventario</label>
          <input id="stock" type="number" formControlName="stock">
          <label for="categoria">Categoria</label>
          <select id="categoria" formControlName="categoria">
            <option value="smartphones">Smartphones</option>
            <option value="laptops">Laptops</option>
            <option value="accesorios">Accesorios</option>
            <option value="gaming">Gaming</option>
            <option value="hogar">Hogar inteligente</option>
          </select>
          <button type="submit">Guardar producto</button>
        </form>
      </section>

      <section>
        <h2>Inventario</h2>
        <table>
          <thead>
            <tr><th>Producto</th><th>Precio</th><th>Stock</th><th>Accion</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let producto of productos$ | async">
              <td>{{ producto.nombre }}</td>
              <td>{{ producto.precio | currency:'COP':'symbol-narrow':'1.0-0':'es-CO' }}</td>
              <td>{{ producto.stock }}</td>
              <td>
                <button type="button" class="button-ghost" (click)="editar(producto)">Editar</button>
                <button type="button" class="button-ghost" (click)="productoService.eliminar(producto.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  `
})
export class AdminComponent {
  protected readonly productoService = inject(ProductoService);
  private readonly fb = inject(FormBuilder);
  protected readonly productos$ = this.productoService.obtenerProductos();
  private editandoId = '';

  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(1)]],
    stock: [1, [Validators.required, Validators.min(0)]],
    categoria: ['accesorios' as Producto['categoria'], Validators.required]
  });

  editar(producto: Producto): void {
    this.editandoId = producto.id;
    this.form.patchValue({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      categoria: producto.categoria
    });
  }

  guardar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const value = this.form.getRawValue();
    this.productoService.guardar({
      id: this.editandoId || value.nombre.toLowerCase().replaceAll(' ', '-'),
      nombre: value.nombre,
      categoria: value.categoria,
      marca: 'TechStore',
      precio: value.precio,
      stock: value.stock,
      rating: 4.5,
      reviews: 0,
      imagen: 'assets/img/prod-accesorio-2.jpg',
      descripcion: 'Producto gestionado desde el panel administrativo.',
      destacado: false
    });
    this.editandoId = '';
    this.form.reset({ nombre: '', precio: 0, stock: 1, categoria: 'accesorios' });
  }
}
