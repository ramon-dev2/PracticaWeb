import { AsyncPipe, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryMenuComponent } from '../../components/category-menu/category-menu.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Producto } from '../../models/producto';
import { CarritoService } from '../../services/carrito.service';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [AsyncPipe, CategoryMenuComponent, FormsModule, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, ProductCardComponent],
  template: `
    <main class="layout">
      <aside>
        <h2>Filtros</h2>
        <app-category-menu (seleccion)="categoria = $event; filtrar()" />
        <form aria-label="Filtros de productos" (ngSubmit)="filtrar()">
          <fieldset>
            <legend>Busqueda</legend>
            <label for="catalogo-busqueda">Producto o descripcion</label>
            <input id="catalogo-busqueda" name="q" type="search" placeholder="Buscar productos..." [(ngModel)]="busqueda" (ngModelChange)="filtrar()">
          </fieldset>
          <fieldset>
            <legend>Rango de Precio</legend>
            <label for="precio-max">Precio maximo</label>
            <input id="precio-max" name="precioMax" type="number" min="0" max="2000000" step="10000" [(ngModel)]="precioMax" (ngModelChange)="filtrar()">
          </fieldset>
          <fieldset>
            <legend>Marca</legend>
            <label for="marca">Marca</label>
            <input id="marca" name="marca" list="lista-marcas" placeholder="Escribe una marca" [(ngModel)]="marca" (ngModelChange)="filtrar()">
            <datalist id="lista-marcas">
              <option value="Apex"></option>
              <option value="NovaTech"></option>
              <option value="Pixelon"></option>
              <option value="GameForge"></option>
            </datalist>
          </fieldset>
          <fieldset>
            <legend>Categoria</legend>
            <select id="categoria" name="categoria" [(ngModel)]="categoria" (ngModelChange)="filtrar()">
              <option value="">Todas las categorias</option>
              <option value="smartphones">Smartphones</option>
              <option value="laptops">Laptops</option>
              <option value="accesorios">Accesorios</option>
              <option value="gaming">Gaming</option>
              <option value="hogar">Hogar inteligente</option>
            </select>
          </fieldset>
          <button type="submit">Aplicar filtros</button>
        </form>
      </aside>

      <section>
        <h2>Resultados</h2>
        <div [ngSwitch]="categoria" class="result-count">
          <p *ngSwitchCase="'gaming'">Modo gaming activo</p>
          <p *ngSwitchDefault>Explora el catalogo completo</p>
        </div>
        <section class="grid-products catalog-grid" *ngIf="productos$ | async as productos">
          <app-product-card *ngFor="let producto of productos" [producto]="producto" (agregado)="agregar($event)" />
          <p class="empty-state" *ngIf="productos.length === 0">No se encontraron productos con esos filtros.</p>
        </section>
      </section>
    </main>
  `
})
export class ProductosComponent implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly carrito = inject(CarritoService);
  private readonly route = inject(ActivatedRoute);

  busqueda = '';
  categoria = '';
  marca = '';
  precioMax?: number;
  productos$!: Observable<Producto[]>;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.busqueda = params.get('q') ?? '';
      this.categoria = params.get('categoria') ?? '';
      this.filtrar();
    });
  }

  filtrar(): void {
    this.productos$ = this.productoService.buscarProducto(this.busqueda, this.categoria, this.marca, this.precioMax);
  }

  agregar(producto: Producto): void {
    this.carrito.agregar(producto);
  }
}
