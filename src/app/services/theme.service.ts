import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly darkMode = signal(localStorage.getItem('techstore-theme') === 'dark');

  toggle(): void {
    this.darkMode.update((value) => {
      const next = !value;
      localStorage.setItem('techstore-theme', next ? 'dark' : 'light');
      return next;
    });
  }
}
