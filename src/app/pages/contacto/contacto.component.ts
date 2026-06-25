import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  template: `
    <main>
      <section>
        <h1>Contacto y acceso</h1>
        <form [formGroup]="form" (ngSubmit)="enviar()">
          <label for="nombre">Nombre</label>
          <input id="nombre" formControlName="nombre">
          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email">
          <label for="mensaje">Mensaje</label>
          <textarea id="mensaje" formControlName="mensaje"></textarea>
          <label for="satisfaccion">Satisfaccion</label>
          <input id="satisfaccion" type="range" min="1" max="10" formControlName="satisfaccion">
          <button type="submit">Enviar</button>
        </form>
        <button type="button" class="button-ghost" (click)="loginDemo()">Login demo para checkout/admin</button>
        <p class="app-message success" *ngIf="mensaje">{{ mensaje }}</p>
      </section>
    </main>
  `
})
export class ContactoComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  mensaje = '';
  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mensaje: ['', [Validators.required, Validators.minLength(10)]],
    satisfaccion: [7]
  });

  enviar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const saved = JSON.parse(localStorage.getItem('techstore-contact-requests') ?? '[]') as unknown[];
    localStorage.setItem('techstore-contact-requests', JSON.stringify([...saved, { ...this.form.getRawValue(), createdAt: new Date().toISOString() }]));
    this.form.reset({ nombre: '', email: '', mensaje: '', satisfaccion: 7 });
    this.mensaje = 'Solicitud guardada localmente.';
  }

  loginDemo(): void {
    this.auth.login('demo@techstore.com');
    this.mensaje = 'Sesion demo iniciada.';
  }
}
