(function () {
	'use strict';

	const products = [
		{
			id: 'galaxy-a54',
			name: 'Smartphone Galaxy A54 5G',
			category: 'smartphones',
			brand: 'Pixelon',
			price: 499990,
			rating: 4.8,
			reviews: 128,
			image: 'img/prod-phone-1.jpg',
			description: 'Pantalla AMOLED, conectividad 5G y camara triple para uso diario.',
			featured: true
		},
		{
			id: 'ideapad-3',
			name: 'Laptop Lenovo IdeaPad 3',
			category: 'laptops',
			brand: 'NovaTech',
			price: 699990,
			rating: 4.7,
			reviews: 96,
			image: 'img/prod-laptop-1.jpg',
			description: 'Equipo liviano para estudio, trabajo y productividad.',
			featured: true
		},
		{
			id: 'sony-wh-ch720n',
			name: 'Auriculares Sony WH-CH720N',
			category: 'accesorios',
			brand: 'Apex',
			price: 199990,
			rating: 4.6,
			reviews: 73,
			image: 'img/prod-accesorio-1.jpg',
			description: 'Audio inalambrico con cancelacion de ruido y bateria de larga duracion.',
			featured: true
		},
		{
			id: 'xiaomi-watch-2',
			name: 'Smartwatch Xiaomi Watch 2',
			category: 'smartphones',
			brand: 'Pixelon',
			price: 159990,
			rating: 4.5,
			reviews: 45,
			image: 'img/prod-phone-2.jpg',
			description: 'Reloj inteligente para salud, deporte y notificaciones.',
			featured: true
		},
		{
			id: 'xbox-series-control',
			name: 'Control Xbox Series X|S',
			category: 'gaming',
			brand: 'GameForge',
			price: 74990,
			rating: 4.4,
			reviews: 32,
			image: 'img/prod-gaming-1.jpg',
			description: 'Control ergonomico con conexion inalambrica para jugar con precision.',
			featured: true
		},
		{
			id: 'echo-dot-5',
			name: 'Echo Dot (5ta Gen)',
			category: 'hogar',
			brand: 'Apex',
			price: 49990,
			rating: 4.8,
			reviews: 112,
			image: 'img/prod-gaming-2.jpg',
			description: 'Altavoz inteligente compacto para musica, rutinas y hogar conectado.',
			featured: true
		},
		{
			id: 'notebook-air-14',
			name: 'Notebook Air 14',
			category: 'laptops',
			brand: 'NovaTech',
			price: 899990,
			rating: 4.3,
			reviews: 58,
			image: 'img/prod-laptop-2.jpg',
			description: 'Diseno liviano, pantalla Full HD y bateria para todo el dia.',
			featured: false
		},
		{
			id: 'mouse-ultra-dpi',
			name: 'Mouse Ultra DPI',
			category: 'accesorios',
			brand: 'GameForge',
			price: 79990,
			rating: 4.2,
			reviews: 41,
			image: 'img/prod-accesorio-2.jpg',
			description: 'Sensor optico preciso y botones configurables para gaming.',
			featured: false
		}
	];

	const categories = [
		{ value: '', label: 'Todas' },
		{ value: 'smartphones', label: 'Smartphones' },
		{ value: 'laptops', label: 'Laptops' },
		{ value: 'accesorios', label: 'Accesorios' },
		{ value: 'gaming', label: 'Gaming' },
		{ value: 'hogar', label: 'Hogar inteligente' }
	];

	window.TechStoreData = {
		products,
		categories,
		formatCurrency(value) {
			return new Intl.NumberFormat('es-CO', {
				style: 'currency',
				currency: 'COP',
				maximumFractionDigits: 0
			}).format(value);
		}
	};
})();
