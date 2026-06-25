export interface Producto {
  id: string;
  nombre: string;
  categoria: 'smartphones' | 'laptops' | 'accesorios' | 'gaming' | 'hogar';
  marca: string;
  precio: number;
  stock: number;
  rating: number;
  reviews: number;
  imagen: string;
  descripcion: string;
  destacado: boolean;
}

export interface ApiProducto {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
}
