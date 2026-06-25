import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main>
      <section class="empty-state">
        <h1>Pagina no encontrada</h1>
        <p>La ruta solicitada no existe en TechStore.</p>
        <a class="btn" routerLink="/">Volver al inicio</a>
      </section>
    </main>
  `
})
export class NotFoundComponent {}
