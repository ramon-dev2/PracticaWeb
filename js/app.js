(function () {
	'use strict';

	const { products: rawProducts, formatCurrency } = window.TechStoreData;
	const { createProducts, Cart } = window.TechStoreStore;
	const products = createProducts(rawProducts);
	const cart = new Cart('techstore-cart', products);

	document.addEventListener('DOMContentLoaded', init);

	function init() {
		updateCartCounters();
		setupSearchForms();
		setupFeaturedProducts();
		setupProductCatalog();
		setupCartPage();
		setupContactForm();
		setupNewsletterForm();
		loadApiRecommendations();
	}

	function setupSearchForms() {
		document.querySelectorAll('form.search-form').forEach((form) => {
			form.addEventListener('submit', (event) => {
				event.preventDefault();
				const input = form.querySelector('input[type="search"]');
				const params = new URLSearchParams();
				if (input.value.trim()) {
					params.set('q', input.value.trim());
				}
				window.location.href = `productos.html${params.toString() ? `?${params}` : ''}`;
			});
		});
	}

	function setupFeaturedProducts() {
		const container = document.querySelector('[data-featured-products]');
		if (!container) return;

		container.innerHTML = products
			.filter((product) => product.featured)
			.slice(0, 6)
			.map(renderProductCard)
			.join('');

		bindAddToCart(container);
	}

	function setupProductCatalog() {
		const catalog = document.querySelector('[data-product-catalog]');
		const filterForm = document.querySelector('[data-filter-form]');
		if (!catalog || !filterForm) return;

		const query = new URLSearchParams(window.location.search);
		const searchInput = filterForm.querySelector('[name="q"]');
		if (query.get('q')) {
			searchInput.value = query.get('q');
		}

		const render = () => {
			const formData = new FormData(filterForm);
			const filters = {
				term: formData.get('q'),
				min: formData.get('precio_min'),
				max: formData.get('precio_max'),
				brand: formData.get('marca'),
				category: formData.get('categoria')
			};
			const result = products.filter((product) => product.matches(filters));
			catalog.innerHTML = result.length
				? result.map(renderProductCard).join('')
				: '<p class="empty-state">No se encontraron productos con esos filtros.</p>';
			bindAddToCart(catalog);
			updateResultCount(result.length);
		};

		filterForm.addEventListener('submit', (event) => {
			event.preventDefault();
			render();
		});
		filterForm.addEventListener('input', debounce(render, 180));
		render();
	}

	function setupCartPage() {
		const tableBody = document.querySelector('[data-cart-items]');
		if (!tableBody) return;

		const totalNode = document.querySelector('[data-cart-total]');
		const buyButton = document.querySelector('[data-checkout]');
		const clearButton = document.querySelector('[data-clear-cart]');
		const feedback = document.querySelector('[data-cart-feedback]');

		const render = () => {
			const items = cart.details();
			if (!items.length) {
				tableBody.innerHTML = '<tr><td colspan="5">Tu carrito esta vacio.</td></tr>';
			} else {
				tableBody.innerHTML = items
					.map((item) => `
						<tr>
							<td>${item.name}</td>
							<td>${formatCurrency(item.price)}</td>
							<td><input class="quantity-input" type="number" min="1" value="${item.quantity}" data-cart-quantity="${item.id}" aria-label="Cantidad de ${item.name}"></td>
							<td>${formatCurrency(item.subtotal)}</td>
							<td><button type="button" class="button-ghost" data-remove-item="${item.id}">Eliminar</button></td>
						</tr>
					`)
					.join('');
			}
			totalNode.textContent = formatCurrency(cart.total());
			updateCartCounters();
		};

		tableBody.addEventListener('input', (event) => {
			const input = event.target.closest('[data-cart-quantity]');
			if (!input) return;
			cart.update(input.dataset.cartQuantity, input.value);
			render();
		});

		tableBody.addEventListener('click', (event) => {
			const button = event.target.closest('[data-remove-item]');
			if (!button) return;
			cart.remove(button.dataset.removeItem);
			showMessage(feedback, 'Producto eliminado del carrito.', 'success');
			render();
		});

		clearButton.addEventListener('click', () => {
			cart.clear();
			showMessage(feedback, 'Carrito vaciado correctamente.', 'success');
			render();
		});

		buyButton.addEventListener('click', () => {
			if (!cart.count()) {
				showMessage(feedback, 'Agrega productos antes de finalizar la compra.', 'error');
				return;
			}

			const order = {
				id: `TS-${Date.now()}`,
				date: new Date().toISOString(),
				items: cart.details(),
				total: cart.total()
			};
			try {
				localStorage.setItem('techstore-last-order', JSON.stringify(order));
				cart.clear();
				showMessage(feedback, `Compra simulada con exito. Orden ${order.id}.`, 'success');
				render();
			} catch (error) {
				console.error(error);
				showMessage(feedback, 'No se pudo guardar la orden en este navegador.', 'error');
			}
		});

		render();
	}

	function setupContactForm() {
		const form = document.querySelector('[data-contact-form]');
		if (!form) return;

		const range = form.querySelector('#satisfaccion');
		const output = form.querySelector('#valor-satisfaccion');
		const feedback = document.querySelector('[data-contact-feedback]');

		range.addEventListener('input', () => {
			output.value = range.value;
			output.textContent = range.value;
		});

		form.addEventListener('submit', (event) => {
			event.preventDefault();
			const data = new FormData(form);
			const errors = validateContact(data);
			if (errors.length) {
				showMessage(feedback, errors.join(' '), 'error');
				return;
			}

			const request = Object.fromEntries(data.entries());
			try {
				const saved = JSON.parse(localStorage.getItem('techstore-contact-requests') || '[]');
				saved.push({ ...request, createdAt: new Date().toISOString() });
				localStorage.setItem('techstore-contact-requests', JSON.stringify(saved));
				form.reset();
				output.textContent = '7';
				showMessage(feedback, 'Solicitud guardada localmente. Te contactaremos pronto.', 'success');
			} catch (error) {
				console.error(error);
				showMessage(feedback, 'No se pudo guardar la solicitud.', 'error');
			}
		});
	}

	function setupNewsletterForm() {
		const form = document.querySelector('[data-newsletter-form]');
		if (!form) return;

		const feedback = document.querySelector('[data-newsletter-feedback]');
		form.addEventListener('submit', (event) => {
			event.preventDefault();
			const email = form.email.value.trim();
			if (!isEmail(email)) {
				showMessage(feedback, 'Ingresa un correo electronico valido.', 'error');
				return;
			}

			try {
				const saved = JSON.parse(localStorage.getItem('techstore-newsletter') || '[]');
				if (!saved.includes(email)) {
					saved.push(email);
					localStorage.setItem('techstore-newsletter', JSON.stringify(saved));
				}
				form.reset();
				showMessage(feedback, 'Correo registrado en newsletter.', 'success');
			} catch (error) {
				console.error(error);
				showMessage(feedback, 'No se pudo guardar el correo.', 'error');
			}
		});
	}

	async function loadApiRecommendations() {
		const container = document.querySelector('[data-api-products]');
		if (!container) return;

		try {
			const response = await fetch('https://fakestoreapi.com/products?limit=4');
			if (!response.ok) {
				throw new Error(`Error HTTP ${response.status}`);
			}
			const data = await response.json();
			container.innerHTML = data
				.map((item) => `
					<article class="api-card">
						<img src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy">
						<h3>${escapeHtml(item.title)}</h3>
						<p>${formatCurrency(Math.round(item.price * 4000))}</p>
					</article>
				`)
				.join('');
		} catch (error) {
			console.error('No se pudo consumir la API REST.', error);
			container.innerHTML = '<p class="empty-state">No fue posible cargar recomendaciones externas en este momento.</p>';
		}
	}

	function renderProductCard(product) {
		return `
			<article>
				<img src="${product.image}" alt="${product.name}" width="320" height="220">
				<h3>${product.name}</h3>
				<p>${product.description}</p>
				<p class="price">${formatCurrency(product.price)}</p>
				<p class="rating" aria-label="Calificacion ${product.rating} de 5">${'*'.repeat(Math.round(product.rating))} <span>(${product.reviews})</span></p>
				<button type="button" data-add-cart="${product.id}">Agregar al carrito</button>
			</article>
		`;
	}

	function bindAddToCart(container) {
		container.querySelectorAll('[data-add-cart]').forEach((button) => {
			button.addEventListener('click', () => {
				try {
					const product = cart.add(button.dataset.addCart);
					updateCartCounters();
					button.textContent = 'Agregado';
					window.setTimeout(() => {
						button.textContent = 'Agregar al carrito';
					}, 900);
					showGlobalToast(`${product.name} agregado al carrito.`);
				} catch (error) {
					console.error(error);
					showGlobalToast('No se pudo agregar el producto.', 'error');
				}
			});
		});
	}

	function updateCartCounters() {
		document.querySelectorAll('[data-cart-count]').forEach((node) => {
			node.textContent = cart.count();
		});
	}

	function updateResultCount(count) {
		const node = document.querySelector('[data-result-count]');
		if (node) {
			node.textContent = `${count} producto${count === 1 ? '' : 's'} encontrado${count === 1 ? '' : 's'}`;
		}
	}

	function validateContact(data) {
		const errors = [];
		if (!String(data.get('nombre')).trim()) errors.push('El nombre es obligatorio.');
		if (!isEmail(String(data.get('correo')).trim())) errors.push('El correo no es valido.');
		if (String(data.get('clave')).length < 8) errors.push('La contrasena debe tener al menos 8 caracteres.');
		if (!/^[+0-9 ]{8,20}$/.test(String(data.get('telefono')).trim())) errors.push('El telefono no es valido.');
		if (Number(data.get('edad')) < 18) errors.push('Debes ser mayor de edad.');
		if (!String(data.get('motivo')).trim()) errors.push('Selecciona un motivo de contacto.');
		if (!String(data.get('mensaje')).trim()) errors.push('Escribe un mensaje.');
		return errors;
	}

	function isEmail(value) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
	}

	function showMessage(node, message, type) {
		if (!node) return;
		node.textContent = message;
		node.className = `app-message ${type}`;
	}

	function showGlobalToast(message, type = 'success') {
		let toast = document.querySelector('[data-toast]');
		if (!toast) {
			toast = document.createElement('p');
			toast.dataset.toast = '';
			document.body.appendChild(toast);
		}
		toast.className = `toast ${type}`;
		toast.textContent = message;
		window.setTimeout(() => {
			toast.classList.remove('success', 'error');
			toast.textContent = '';
		}, 1800);
	}

	function debounce(callback, delay) {
		let timer;
		return (...args) => {
			window.clearTimeout(timer);
			timer = window.setTimeout(() => callback(...args), delay);
		};
	}

	function escapeHtml(value) {
		return String(value).replace(/[&<>"']/g, (char) => ({
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		})[char]);
	}
})();
