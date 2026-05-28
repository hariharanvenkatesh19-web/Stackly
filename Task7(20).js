
async function displayProducts() {
  const container = document.getElementById('product-container');
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();

    loading.style.display = 'none';
 
    const html = products.map(function(product) {
      return `
        <div class="product-card">
          <img src="${product.image}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p class="price">$${product.price}</p>
          <p class="category">${product.category}</p>
        </div>
      `;
    }).join('');
    
    container.innerHTML = html;
    
  } catch (error) {
    loading.style.display = 'none';
    error.style.display = 'block';
    error.textContent = 'Error loading products: ' + error.message;
    console.error('Error:', error);
  }
}

displayProducts();