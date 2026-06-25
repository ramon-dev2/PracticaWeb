import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly autenticado = signal(localStorage.getItem('techstore-token') !== null);

  login(email: string): void {
    localStorage.setItem('techstore-token', `demo-token-${email}`);
    this.autenticado.set(true);
  }

  logout(): void {
    localStorage.removeItem('techstore-token');
    this.autenticado.set(false);
  }

  token(): string | null {
    return localStorage.getItem('techstore-token');
  }
}
