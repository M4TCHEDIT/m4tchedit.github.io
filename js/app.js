// Configuración
let clientType = 'minorista'; // 'minorista' o 'mayorista'

// Productos de ejemplo
const products = [
  {
    id: 1,
    name: 'Cerveza Artesanal',
    desc: 'Cerveza premium de 500ml',
    img: 'https://via.placeholder.com/300x200/FF6600/FFFFFF?text=Cerveza',
    price: { minorista: 50, mayorista: 40 },
    stock: 100
  },
  {
    id: 2,
    name: 'Vino Tinto',
    desc: 'Vino tinto reserva 750ml',
    img: 'https://via.placeholder.com/300x200/8B0000/FFFFFF?text=Vino',
    price: { minorista: 150, mayorista: 120 },
    stock: 50
  }
];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  updateClientTypeUI();
  renderBestsellers();
  initHeroCarousel();
  loadCartFromStorage();
});

// Carrusel del Hero
let currentSlide = 0;
const totalSlides = 2;

function initHeroCarousel() {
  setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    document.getElementById('hero-slides').style.transform = `translateX(-${currentSlide * 100}%)`;
  }, 5000);
}

// Render productos
function renderBestsellers() {
  const container = document.getElementById('bestsellers-container');
  container.innerHTML = '';
  products.forEach(product => {
    const price = product.price[clientType];
    const unit = clientType === 'mayorista' ? ' por caja' : ' por unidad';
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.desc}</p>
      <div class="price">$${price}${unit}</div>
      <p>Stock: ${product.stock}</p>
      <button onclick="addToCart(${product.id})" ${product.stock <= 0 ? 'disabled' : ''}>
        ${product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
      </button>
    `;
    container.appendChild(div);
  });
}

// Carrito (usando localStorage)
function getCart() {
  const cart = localStorage.getItem('bebidas_cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('bebidas_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product || product.stock <= 0) return;

  let cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price[clientType],
      quantity: 1
    });
  }
  saveCart(cart);
  alert(`✅ ${product.name} agregado al carrito`);
}

function updateCartUI() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-total').textContent = total.toFixed(2);

  const itemsDiv = document.getElementById('cart-items');
  if (count === 0) {
    itemsDiv.innerHTML = 'Tu carrito está vacío';
    return;
  }

  let html = '';
  cart.forEach(item => {
    html += `
      <div style="margin-bottom:1rem; padding-bottom:1rem; border-bottom:1px solid #eee;">
        <p><strong>${item.name}</strong> x${item.quantity}</p>
        <p>$${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    `;
  });
  itemsDiv.innerHTML = html;
}

function loadCartFromStorage() {
  updateCartUI();
}

function checkout() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('El carrito está vacío');
    return;
  }
  alert('¡Gracias por tu compra! (Simulada)');
  localStorage.removeItem('bebidas_cart');
  updateCartUI();
  closeCart();
}

// Cliente tipo
function toggleClientType() {
  clientType = clientType === 'mayorista' ? 'minorista' : 'mayorista';
  updateClientTypeUI();
  renderBestsellers();
}

function updateClientTypeUI() {
  document.getElementById('client-type').textContent = clientType.charAt(0).toUpperCase() + clientType.slice(1);
}

// Carrito UI
function openCart() {
  document.getElementById('cart-panel').classList.add('open');
  document.getElementById('cart-overlay').classList.add('active');
}

function closeCart() {
  document.getElementById('cart-panel').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('active');
}

// Admin
function showAdminPanel() {
  const pass = prompt('Contraseña de administrador:');
  if (pass === 'admin123') {
    document.getElementById('admin-panel').style.display = 'block';
  } else if (pass !== null) {
    alert('❌ Contraseña incorrecta');
  }
}

function closeAdmin() {
  document.getElementById('admin-panel').style.display = 'none';
}

// Menú móvil
function toggleMobileMenu() {
  document.getElementById('nav-links').classList.toggle('active');
}