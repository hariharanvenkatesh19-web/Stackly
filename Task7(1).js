async function filterProducts() {
  const container = document.getElementById('product-container');
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const filterInfo = document.getElementById('filterInfo');
  const filterCount = document.getElementById('filterCount');
  
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();
    
    // Higher order function: filter with callback function
    const filtered = products.filter(function(product) {
      return product.price > 100 && product.category === 'electronics';
    });
    
    // Hide loading
    loading.style.display = 'none';
    
    // Show filter info
    if (filtered.length > 0) {
      filterInfo.style.display = 'block';
      filterCount.textContent = '✓ Found ' + filtered.length + ' electronics products (Price > $100)';
      
      // forEach (callback function)
      const html = filtered.map(function(product) {
        return `
          <div class="product-card">
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="price">${product.price}</p>
            <p class="category">${product.category}</p>
            <span class="filter-badge">✓ Filtered</span>
          </div>
        `;
      }).join('');
      
      container.innerHTML = html;
    } else {
      container.innerHTML = '<div class="emptyResult">⚠️ No electronics products found with price > $100</div>';
    }
    
  } catch (error) {
    loading.style.display = 'none';
    error.style.display = 'block';
    error.textContent = '❌ Error loading products: ' + error.message;
    console.error('Error:', error);
  }
}

filterProducts();