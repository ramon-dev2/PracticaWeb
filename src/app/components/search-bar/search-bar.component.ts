import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form class="search-form" role="search" (ngSubmit)="buscar()">
      <label for="busqueda" class="sr-only">Buscar productos</label>
      <input id="busqueda" name="busqueda" type="search" placeholder="Buscar productos..." [(ngModel)]="busqueda">
      <button type="submit">Buscar</button>
    </form>
  `
})
export class SearchBarComponent {
  private readonly router = inject(Router);
  busqueda = '';

  buscar(): void {
    void this.router.navigate(['/productos'], { queryParams: { q: this.busqueda || null } });
  }
}
