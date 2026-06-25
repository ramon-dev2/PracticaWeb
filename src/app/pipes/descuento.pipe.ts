import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descuento',
  standalone: true
})
export class DescuentoPipe implements PipeTransform {
  transform(precio: number, porcentaje = 0): number {
    return Math.max(0, precio - precio * (porcentaje / 100));
  }
}
