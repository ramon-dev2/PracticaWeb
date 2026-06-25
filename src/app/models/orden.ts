import { ItemCarrito } from './carrito';

export interface Orden {
  id: string;
  fecha: string;
  cliente: {
    nombre: string;
    email: string;
    direccion: string;
  };
  items: ItemCarrito[];
  subtotal: number;
  impuestos: number;
  total: number;
}
