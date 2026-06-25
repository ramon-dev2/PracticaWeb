(function () {
	'use strict';

	class Product {
		constructor(data) {
			Object.assign(this, data);
		}

		matches(filters) {
			const term = normalize(filters.term || '');
			const name = normalize(this.name);
			const description = normalize(this.description);
			const brand = normalize(this.brand);
			const matchesTerm = !term || name.includes(term) || description.includes(term) || brand.includes(term);
			const matchesCategory = !filters.category || this.category === filters.category;
			const matchesBrand = !filters.brand || brand.includes(normalize(filters.brand));
			const matchesMin = !filters.min || this.price >= Number(filters.min);
			const matchesMax = !filters.max || this.price <= Number(filters.max);

			return matchesTerm && matchesCategory && matchesBrand && matchesMin && matchesMax;
		}
	}

	class Cart {
		constructor(storageKey, products) {
			this.storageKey = storageKey;
			this.products = products;
			this.items = this.read();
		}

		read() {
			try {
				const saved = localStorage.getItem(this.storageKey);
				return saved ? JSON.parse(saved) : [];
			} catch (error) {
				console.error('No se pudo leer el carrito.', error);
				return [];
			}
		}

		save() {
			try {
				localStorage.setItem(this.storageKey, JSON.stringify(this.items));
			} catch (error) {
				console.error('No se pudo guardar el carrito.', error);
			}
		}

		add(productId) {
			const product = this.products.find((item) => item.id === productId);
			if (!product) {
				throw new Error('Producto no encontrado.');
			}

			const item = this.items.find((entry) => entry.id === productId);
			if (item) {
				item.quantity += 1;
			} else {
				this.items.push({ id: productId, quantity: 1 });
			}
			this.save();
			return product;
		}

		update(productId, quantity) {
			const nextQuantity = Number(quantity);
			if (!Number.isFinite(nextQuantity) || nextQuantity < 1) {
				this.remove(productId);
				return;
			}

			const item = this.items.find((entry) => entry.id === productId);
			if (item) {
				item.quantity = nextQuantity;
				this.save();
			}
		}

		remove(productId) {
			this.items = this.items.filter((entry) => entry.id !== productId);
			this.save();
		}

		clear() {
			this.items = [];
			this.save();
		}

		count() {
			return this.items.reduce((total, item) => total + item.quantity, 0);
		}

		total() {
			return this.details().reduce((total, item) => total + item.subtotal, 0);
		}

		details() {
			return this.items
				.map((item) => {
					const product = this.products.find((entry) => entry.id === item.id);
					if (!product) return null;
					return {
						...product,
						quantity: item.quantity,
						subtotal: product.price * item.quantity
					};
				})
				.filter(Boolean);
		}
	}

	function normalize(value) {
		return String(value)
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '');
	}

	window.TechStoreStore = {
		Product,
		Cart,
		createProducts(rawProducts) {
			return rawProducts.map((item) => new Product(item));
		}
	};
})();
