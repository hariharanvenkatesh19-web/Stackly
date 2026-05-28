

class ECommerceApp {
  constructor(apiUrl = 'https://fakestoreapi.com/products') {
    this.products = [];
    this.cart = [];
    this.apiUrl = apiUrl;
    this.filteredProducts = [];
  }

  async fetchProducts() {
    try {
      const response = await fetch(this.apiUrl);
      this.products = await response.json();
      this.filteredProducts = [...this.products];
      console.log('Products fetched:', this.products.length);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  filterByCategory(category) {
    if (!category) return [...this.filteredProducts];
    return this.products.filter(function(product) {
      return product.category.toLowerCase() === category.toLowerCase();
    });
  }

  sortByPrice(ascending = true) {
    const sorted = [...this.products];
    return sorted.sort(function(a, b) {
      return ascending ? a.price - b.price : b.price - a.price;
    });
  }

  searchProduct(searchTerm) {
    if (!searchTerm) return [...this.filteredProducts];
    return this.products.filter(function(product) {
      return product.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  addToCart(productId, qty = 1) {
    const product = this.products.find(function(p) {
      return p.id === productId;
    });
    
    if (!product) {
      console.log('Product not found');
      return;
    }

    const existingItem = this.cart.find(function(item) {
      return item.id === productId;
    });
    
    if (existingItem) {
      existingItem.qty += qty;
    } else {
      this.cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        qty: qty
      });
    }
    
    console.log('Added ' + qty + ' x ' + product.title + ' to cart');
  }

  removeFromCart(productId) {
    const index = this.cart.findIndex(function(item) {
      return item.id === productId;
    });
    
    if (index !== -1) {
      this.cart.splice(index, 1);
    }
  }

  updateQuantity(productId, qty) {
    const item = this.cart.find(function(item) {
      return item.id === productId;
    });
    
    if (item && qty > 0) {
      item.qty = qty;
    }
  }

  calculateTotal() {
    return this.cart.reduce(function(sum, item) {
      return sum + (item.price * item.qty);
    }, 0);
  }

  displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (this.cart.length === 0) {
      cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
      cartSummary.style.display = 'none';
      return;
    }
    
    const html = this.cart.map(function(item) {
      return `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-info">
            <div class="cart-item-title">${item.title}</div>
            <div class="cart-item-price">$${item.price}</div>
          </div>
          <div class="cart-item-qty">
            <button class="qty-decrease">-</button>
            <span>${item.qty}</span>
            <button class="qty-increase">+</button>
          </div>
          <div class="cart-item-total">$${(item.price * item.qty).toFixed(2)}</div>
          <button class="cart-item-remove">Remove</button>
        </div>
      `;
    }).join('');
    
    cartItems.innerHTML = html;
    cartSummary.style.display = 'block';

    const total = this.calculateTotal();
    document.getElementById('subtotal').textContent = '$' + total.toFixed(2);
    document.getElementById('tax').textContent = '$' + (total * 0.1).toFixed(2);
    document.getElementById('total').textContent = '$' + (total * 1.1).toFixed(2);
  }
}

const app = new ECommerceApp();
let loading = true;

async function init() {
  await app.fetchProducts();
  loading = false;
  renderProducts(app.products);
  updateProductCount(app.products.length);
}

function renderProducts(products) {
  const container = document.getElementById('product-container');
  const loadingEl = document.getElementById('loading');
  
  if (loading) {
    loadingEl.style.display = 'block';
    return;
  }
  
  loadingEl.style.display = 'none';
  
  if (products.length === 0) {
    container.innerHTML = '<p class="empty-cart">No products found</p>';
    return;
  }
  
  const html = products.map(function(product) {
    return `
      <div class="product-card">
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p class="price">$${product.price}</p>
        <p class="category">${product.category}</p>
        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;

  document.querySelectorAll('.add-to-cart-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const productId = parseInt(this.getAttribute('data-id'));
      app.addToCart(productId, 1);
      app.displayCart();
    });
  });
}

function updateProductCount(count) {
  const countEl = document.getElementById('productCount');
  countEl.textContent = count + ' products available';
}

document.getElementById('searchBtn').addEventListener('click', function() {
  const searchTerm = document.getElementById('searchInput').value;
  const category = document.getElementById('categoryFilter').value;
  
  let filtered = app.searchProduct(searchTerm);
  
  if (category) {
    filtered = filtered.filter(function(product) {
      return product.category.toLowerCase() === category.toLowerCase();
    });
  }
  
  const sortOrder = document.getElementById('sortOrder').value;
  if (sortOrder === 'asc') {
    filtered = app.sortByPrice(true);
  } else {
    filtered = app.sortByPrice(false);
  }
  
  renderProducts(filtered);
  updateProductCount(filtered.length);
});

document.getElementById('resetBtn').addEventListener('click', function() {
  document.getElementById('searchInput').value = '';
  document.getElementById('categoryFilter').value = '';
  document.getElementById('sortOrder').value = 'asc';
  renderProducts(app.products);
  updateProductCount(app.products.length);
});

document.getElementById('checkoutBtn').addEventListener('click', function() {
  const total = app.calculateTotal();
  alert('Checkout! Total: $' + (total * 1.1).toFixed(2));
});

init();