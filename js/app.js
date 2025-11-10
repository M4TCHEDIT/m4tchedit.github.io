// Gestión de productos con localStorage
function getProducts() {
  const saved = localStorage.getItem('bebidas_products');
  if (saved) return JSON.parse(saved);
  
  const defaults = [
    {
      id: 1,
      name: 'Cerveza Artesanal',
      desc: 'Cerveza premium de 500ml',
      img: 'https://plus.unsplash.com/premium_photo-1664391981475-42c0449b7727?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=483',
      price: { minorista: 50, mayorista: 40 },
      stock: 100
    },
    {
      id: 2,
      name: 'Vino Tinto',
      desc: 'Vino tinto reserva 750ml',
      img: 'https://images.unsplash.com/photo-1582673937754-8d0cfed5dcc9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=475',
      price: { minorista: 150, mayorista: 120 },
      stock: 50
    },
    {
      id: 3,
      name: 'Agua Mineral',
      desc: 'Agua natural sin gas 1.5L',
      img: 'https://images.unsplash.com/photo-1652491285696-472cec79a77a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387',
      price: { minorista: 20, mayorista: 15 },
      stock: 200
    }
  ];
  localStorage.setItem('bebidas_products', JSON.stringify(defaults));
  return defaults;
}

function saveProducts(products) {
  localStorage.setItem('bebidas_products', JSON.stringify(products));
}

let clientType = 'minorista';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  updateClientTypeUI();
  renderBestsellers();
  loadCartFromStorage();
  initHeroCarousel();
});

// Carrusel
let currentSlide = 0;
function initHeroCarousel() {
  setInterval(() => {
    currentSlide = (currentSlide + 1) % 2;
    document.getElementById('hero-slides').style.transform = `translateX(-${currentSlide * 100}%)`;
  }, 5000);
}

// Render productos
function renderBestsellers() {
  const container = document.getElementById('bestsellers-container');
  const products = getProducts();
  container.innerHTML = '';
  products.forEach(p => {
    const price = p.price[clientType];
    const unit = clientType === 'mayorista' ? ' por caja' : ' por unidad';
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="price">$${price}${unit}</div>
      <p>Stock: ${p.stock}</p>
      <button onclick="addToCart(${p.id})" ${p.stock <= 0 ? 'disabled' : ''}>
        ${p.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
      </button>
    `;
    container.appendChild(div);
  });
}

// Agregar producto
function addProduct() {
  const name = document.getElementById('new-product-name').value.trim();
  const desc = document.getElementById('new-product-desc').value.trim();
  const retail = parseFloat(document.getElementById('new-product-retail').value);
  const wholesale = parseFloat(document.getElementById('new-product-wholesale').value);
  const stock = parseInt(document.getElementById('new-product-stock').value);
  
  if (!name || !desc || isNaN(retail) || isNaN(wholesale) || isNaN(stock) || stock < 0) {
    alert('⚠️ Por favor, completa todos los campos correctamente.');
    return;
  }

  const products = getProducts();
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  
  products.push({
    id: newId,
    name,
    desc,
    img: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    price: { minorista: retail, mayorista: wholesale },
    stock
  });
  
  saveProducts(products);
  alert(`✅ ¡Producto "${name}" agregado con éxito!`);
  
  // Limpiar formulario
  document.getElementById('new-product-name').value = '';
  document.getElementById('new-product-desc').value = '';
  document.getElementById('new-product-retail').value = '';
  document.getElementById('new-product-wholesale').value = '';
  document.getElementById('new-product-stock').value = '';
  
  renderBestsellers();
  updateAdminProductList();
}

// Editar producto
function editProduct(id) {
  const products = getProducts();
  const product = products.find(p => p.id == id);
  if (!product) return;

  const newName = prompt('Nombre:', product.name);
  const newDesc = prompt('Descripción:', product.desc);
  const newRetail = prompt('Precio Minorista ($):', product.price.minorista);
  const newWholesale = prompt('Precio Mayorista ($):', product.price.mayorista);
  const newStock = prompt('Stock:', product.stock);

  if (newName !== null && newDesc !== null && newRetail !== null && newWholesale !== null && newStock !== null) {
    product.name = newName.trim() || product.name;
    product.desc = newDesc.trim() || product.desc;
    product.price.minorista = parseFloat(newRetail) || product.price.minorista;
    product.price.mayorista = parseFloat(newWholesale) || product.price.mayorista;
    product.stock = parseInt(newStock) || product.stock;

    saveProducts(products);
    alert('✅ Producto actualizado');
    renderBestsellers();
    updateAdminProductList();
  }
}

// Eliminar producto
function deleteProduct(id) {
  if (!confirm('¿Eliminar este producto?')) return;
  
  let products = getProducts();
  products = products.filter(p => p.id != id);
  saveProducts(products);
  alert('✅ Producto eliminado');
  renderBestsellers();
  updateAdminProductList();
}

// Actualiza lista en admin
function updateAdminProductList() {
  const adminDiv = document.getElementById('admin-products');
  const products = getProducts();
  adminDiv.innerHTML = products.map(p => `
    <div class="product-item">
      <strong>${p.name}</strong><br>
      Stock: ${p.stock} | Minorista: $${p.price.minorista} | Mayorista: $${p.price.mayorista}
      <button class="edit-btn" onclick="editProduct(${p.id})">Editar</button>
      <button class="delete-btn" onclick="deleteProduct(${p.id})">Eliminar</button>
    </div>
  `).join('');
}

// Carrito
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('bebidas_cart')) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem('bebidas_cart', JSON.stringify(cart));
    updateCartUI();
  } catch (e) {
    alert('Error al guardar el carrito.');
  }
}

function addToCart(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product || product.stock <= 0) return alert('Producto sin stock');
  
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
        <button onclick="removeFromCart(${item.id})" style="background:#d9534f;">Eliminar</button>
      </div>
    `;
  });
  itemsDiv.innerHTML = html;
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
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

// Cliente
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
    updateAdminProductList();
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

