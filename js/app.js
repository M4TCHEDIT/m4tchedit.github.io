let products = [
    { id: 1, name: 'Cerveza Lager', desc: 'Refrescante cerveza clara', img: 'https://images.unsplash.com/photo-1601007870719-f55a108a73a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', retailPrice: 150, wholesalePrice: 120, stock: 50 },
    { id: 2, name: 'Vino Tinto', desc: 'Vino tinto reserva 750ml', img: 'https://images.unsplash.com/photo-1597405260515-5853b05a761e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', retailPrice: 800, wholesalePrice: 650, stock: 30 },
    { id: 3, name: 'Agua Mineral', desc: 'Agua natural sin gas 1.5L', img: 'https://images.unsplash.com/photo-1605372433065-27a37171d18f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', retailPrice: 50, wholesalePrice: 40, stock: 100 },
    { id: 4, name: 'Jugo Natural Naranja', desc: 'Jugo de naranja exprimido 1L', img: 'https://images.unsplash.com/photo-1600271732559-67d710ce1c8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', retailPrice: 180, wholesalePrice: 150, stock: 40 },
    { id: 5, name: 'Gaseosa Cola', desc: 'Gaseosa sabor cola 2.25L', img: 'https://images.unsplash.com/photo-1579782509177-d46e25774a3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', retailPrice: 120, wholesalePrice: 100, stock: 60 },
    { id: 6, name: 'Cerveza Artesanal IPA', desc: 'IPA con notas cítricas 500ml', img: 'https://images.unsplash.com/photo-1596707328630-f8f946e38234?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', retailPrice: 250, wholesalePrice: 200, stock: 25 },
];

let cart = [];
let clientType = 'retail'; // 'retail' o 'wholesale'

// --- Carrusel Variables y Funciones (Corregido) ---
const heroSlides = document.getElementById('hero-slides');
let currentSlide = 0;
// Asegura que totalSlides se calcule solo si heroSlides existe
const totalSlides = heroSlides ? heroSlides.children.length : 0; 
let carouselInterval;

function showSlide(index) {
    if (heroSlides) {
        heroSlides.style.transform = `translateX(-${index * 100}%)`;
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function startCarousel() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
    // Muestra el primer slide al iniciar, sin esperar
    if (totalSlides > 0) { // Solo si hay slides
      showSlide(currentSlide); 
    }
    carouselInterval = setInterval(nextSlide, 5000); // Cambia cada 5 segundos
}
// --- Fin Carrusel ---

// --- Funciones de Renderizado ---
function renderBestsellers() {
    const container = document.getElementById('bestsellers-container');
    if (!container) return; // Salir si el contenedor no existe

    container.innerHTML = '';
    products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <img src="${p.img}" alt="${p.name}" loading="lazy">
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            <p class="price">$${clientType === 'retail' ? p.retailPrice.toFixed(2) : p.wholesalePrice.toFixed(2)}</p>
            <p>Stock: ${p.stock}</p>
            <button onclick="addToCart(${p.id})">Agregar al Carrito</button>
        `;
        container.appendChild(div);
    });
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const cartCountSpan = document.getElementById('cart-count');

    if (!cartItemsContainer || !cartTotalSpan || !cartCountSpan) return;

    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Tu carrito está vacío</p>';
    } else {
        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                const itemPrice = clientType === 'retail' ? product.retailPrice : product.wholesalePrice;
                const subtotal = itemPrice * item.quantity;
                total += subtotal;

                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <p>${product.name} x ${item.quantity} = $${subtotal.toFixed(2)}</p>
                    <button onclick="removeFromCart(${product.id})" class="btn-secondary">Quitar</button>
                `;
                cartItemsContainer.appendChild(div);
            }
        });
    }

    cartTotalSpan.textContent = total.toFixed(2);
    cartCountSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// --- Funciones de Interacción ---
function toggleMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

function toggleClientType() {
    clientType = clientType === 'retail' ? 'wholesale' : 'retail';
    document.getElementById('client-type').textContent = clientType === 'retail' ? 'Minorista' : 'Mayorista';
    renderBestsellers(); // Volver a renderizar para actualizar precios
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Lógica futura para verificar stock antes de añadir
    if (product.stock <= 0) {
        alert('Producto agotado!');
        return;
    }

    const cartItem = cart.find(item => item.productId === productId);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ productId, quantity: 1 });
    }
    // Lógica futura: reducir stock aquí
    product.stock--; // Reduce el stock al agregar al carrito
    renderBestsellers(); // Para actualizar el stock mostrado
    renderCart();
}

function removeFromCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const itemIndex = cart.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
        product.stock += cart[itemIndex].quantity; // Devuelve el stock
        cart.splice(itemIndex, 1);
    }
    renderBestsellers(); // Para actualizar el stock mostrado
    renderCart();
}

function openCart() {
    document.getElementById('cart-panel').classList.add('open');
    document.getElementById('cart-overlay').classList.add('active');
}

function closeCart() {
    document.getElementById('cart-panel').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('active');
}

function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío!');
        return;
    }
    const total = document.getElementById('cart-total').textContent;
    alert(`Gracias por tu compra! Total: $${total}. Tu pedido ha sido procesado.`);
    cart = []; // Vaciar carrito
    renderBestsellers(); // Actualizar stock final
    renderCart(); // Actualizar vista del carrito
    closeCart();
}

// --- Panel de Administración ---
function showAdminPanel() {
    const password = prompt("Introduce la contraseña de Admin:");
    if (password === "admin123") { // Contraseña simple para demostración
        document.getElementById('admin-panel').style.display = 'block';
        renderAdminProducts();
    } else if (password !== null) {
        alert("Contraseña incorrecta.");
    }
}

function closeAdmin() {
    document.getElementById('admin-panel').style.display = 'none';
}

function renderAdminProducts() {
    const adminProductsContainer = document.getElementById('admin-products');
    if (!adminProductsContainer) return;

    adminProductsContainer.innerHTML = '';
    products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product-item';
        div.innerHTML = `
            ${p.name} - Minorista: $${p.retailPrice.toFixed(2)} / Mayorista: $${p.wholesalePrice.toFixed(2)} / Stock: ${p.stock}
            <button onclick="editProduct(${p.id})" class="edit-btn">Editar</button>
            <button onclick="deleteProduct(${p.id})" class="delete-btn">Borrar</button>
        `;
        adminProductsContainer.appendChild(div);
    });
}

function addProduct() {
    const name = document.getElementById('new-product-name').value;
    const desc = document.getElementById('new-product-desc').value;
    const retailPrice = parseFloat(document.getElementById('new-product-retail').value);
    const wholesalePrice = parseFloat(document.getElementById('new-product-wholesale').value);
    const stock = parseInt(document.getElementById('new-product-stock').value);

    if (name && desc && !isNaN(retailPrice) && !isNaN(wholesalePrice) && !isNaN(stock)) {
        const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, name, desc, img: 'https://via.placeholder.com/300x200', retailPrice, wholesalePrice, stock }); // Placeholder img
        alert('Producto agregado!');
        
        // Limpiar formulario
        document.getElementById('new-product-name').value = '';
        document.getElementById('new-product-desc').value = '';
        document.getElementById('new-product-retail').value = '';
        document.getElementById('new-product-wholesale').value = '';
        document.getElementById('new-product-stock').value = '';
        
        renderBestsellers();
        renderAdminProducts();
    } else {
        alert('Por favor, completa todos los campos para agregar un producto.');
    }
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newName = prompt(`Editar nombre de ${product.name}:`, product.name);
    if (newName === null) return; // Cancelado

    const newDesc = prompt(`Editar descripción de ${newName}:`, product.desc);
    if (newDesc === null) return;

    const newRetailPrice = parseFloat(prompt(`Editar precio minorista de ${newName}:`, product.retailPrice));
    if (isNaN(newRetailPrice)) return;

    const newWholesalePrice = parseFloat(prompt(`Editar precio mayorista de ${newName}:`, product.wholesalePrice));
    if (isNaN(newWholesalePrice)) return;

    const newStock = parseInt(prompt(`Editar stock de ${newName}:`, product.stock));
    if (isNaN(newStock)) return;

    product.name = newName;
    product.desc = newDesc;
    product.retailPrice = newRetailPrice;
    product.wholesalePrice = newWholesalePrice;
    product.stock = newStock;

    alert('Producto actualizado!');
    renderBestsellers();
    renderAdminProducts();
}

function deleteProduct(id) {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
        products = products.filter(p => p.id !== id);
        alert('Producto eliminado!');
        renderBestsellers();
        renderAdminProducts();
    }
}


// --- Inicialización al cargar la página ---
document.addEventListener('DOMContentLoaded', () => {
    renderBestsellers();
    renderCart(); // Asegúrate de que el carrito también se inicialice
    startCarousel(); // <--- ¡Esta línea es CRÍTICA para el carrusel!
});
