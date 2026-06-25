import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { ApiProducto, Producto } from '../models/producto';

const IMG = 'assets/img/';

const PRODUCTOS: Producto[] = [
  {
    id: 'galaxy-a54',
    nombre: 'Smartphone Galaxy A54 5G',
    categoria: 'smartphones',
    marca: 'Pixelon',
    precio: 499990,
    stock: 15,
    rating: 4.8,
    reviews: 128,
    imagen: `${IMG}prod-phone-1.jpg`,
    descripcion: 'Pantalla AMOLED, conectividad 5G y camara triple para uso diario.',
    destacado: true
  },
  {
    id: 'ideapad-3',
    nombre: 'Laptop Lenovo IdeaPad 3',
    categoria: 'laptops',
    marca: 'NovaTech',
    precio: 699990,
    stock: 8,
    rating: 4.7,
    reviews: 96,
    imagen: `${IMG}prod-laptop-1.jpg`,
    descripcion: 'Equipo liviano para estudio, trabajo y productividad.',
    destacado: true
  },
  {
    id: 'sony-wh-ch720n',
    nombre: 'Auriculares Sony WH-CH720N',
    categoria: 'accesorios',
    marca: 'Apex',
    precio: 199990,
    stock: 22,
    rating: 4.6,
    reviews: 73,
    imagen: `${IMG}prod-accesorio-1.jpg`,
    descripcion: 'Audio inalambrico con cancelacion de ruido y bateria de larga duracion.',
    destacado: true
  },
  {
    id: 'xiaomi-watch-2',
    nombre: 'Smartwatch Xiaomi Watch 2',
    categoria: 'smartphones',
    marca: 'Pixelon',
    precio: 159990,
    stock: 12,
    rating: 4.5,
    reviews: 45,
    imagen: `${IMG}prod-phone-2.jpg`,
    descripcion: 'Reloj inteligente para salud, deporte y notificaciones.',
    destacado: true
  },
  {
    id: 'xbox-series-control',
    nombre: 'Control Xbox Series X|S',
    categoria: 'gaming',
    marca: 'GameForge',
    precio: 74990,
    stock: 30,
    rating: 4.4,
    reviews: 32,
    imagen: `${IMG}prod-gaming-1.jpg`,
    descripcion: 'Control ergonomico con conexion inalambrica para jugar con precision.',
    destacado: true
  },
  {
    id: 'echo-dot-5',
    nombre: 'Echo Dot (5ta Gen)',
    categoria: 'hogar',
    marca: 'Apex',
    precio: 49990,
    stock: 18,
    rating: 4.8,
    reviews: 112,
    imagen: `${IMG}prod-gaming-2.jpg`,
    descripcion: 'Altavoz inteligente compacto para musica, rutinas y hogar conectado.',
    destacado: true
  },
  {
    id: 'notebook-air-14',
    nombre: 'Notebook Air 14',
    categoria: 'laptops',
    marca: 'NovaTech',
    precio: 899990,
    stock: 5,
    rating: 4.3,
    reviews: 58,
    imagen: `${IMG}prod-laptop-2.jpg`,
    descripcion: 'Diseno liviano, pantalla Full HD y bateria para todo el dia.',
    destacado: false
  },
  {
    id: 'mouse-ultra-dpi',
    nombre: 'Mouse Ultra DPI',
    categoria: 'accesorios',
    marca: 'GameForge',
    precio: 79990,
    stock: 25,
    rating: 4.2,
    reviews: 41,
    imagen: `${IMG}prod-accesorio-2.jpg`,
    descripcion: 'Sensor optico preciso y botones configurables para gaming.',
    destacado: false
  }
];

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly http = inject(HttpClient);
  private readonly productosSubject = new BehaviorSubject<Producto[]>(PRODUCTOS);
  readonly productos$ = this.productosSubject.asObservable();

  obtenerProductos(): Observable<Producto[]> {
    return this.productos$.pipe(tap(() => console.info('Productos locales consultados')));
  }

  obtenerProducto(id: string): Observable<Producto | undefined> {
    return this.productos$.pipe(map((productos) => productos.find((producto) => producto.id === id)));
  }

  buscarProducto(term = '', categoria = '', marca = '', precioMax?: number): Observable<Producto[]> {
    const normalizedTerm = term.trim().toLowerCase();
    return this.productos$.pipe(
      map((productos) =>
        productos.filter((producto) => {
          const matchTerm = !normalizedTerm || `${producto.nombre} ${producto.descripcion}`.toLowerCase().includes(normalizedTerm);
          const matchCategoria = !categoria || producto.categoria === categoria;
          const matchMarca = !marca || producto.marca.toLowerCase().includes(marca.toLowerCase());
          const matchPrecio = !precioMax || producto.precio <= precioMax;
          return matchTerm && matchCategoria && matchMarca && matchPrecio;
        })
      )
    );
  }

  recomendacionesApi(): Observable<ApiProducto[]> {
    return this.http.get<ApiProducto[]>('https://fakestoreapi.com/products?limit=4').pipe(
      catchError((error) => {
        console.error('No se pudo consumir Fake Store API', error);
        return of([]);
      })
    );
  }

  guardar(producto: Producto): void {
    const productos = this.productosSubject.value;
    const index = productos.findIndex((item) => item.id === producto.id);
    const siguiente = index >= 0 ? productos.map((item) => (item.id === producto.id ? producto : item)) : [producto, ...productos];
    this.productosSubject.next(siguiente);
  }

  eliminar(id: string): void {
    this.productosSubject.next(this.productosSubject.value.filter((producto) => producto.id !== id));
  }
}
