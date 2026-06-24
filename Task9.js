
document.addEventListener('DOMContentLoaded', function() {
    fetchProducts();
});

function fetchProducts() {
    const productGrid = document.querySelector('#product-grid');
    const totalProductsElement = document.getElementById('total-products');
    const errorMessage = document.getElementById('error-message');
    const finalDiv = document.querySelector('.final');
    
    fetch('https://fakestoreapi.com/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(products => {
            errorMessage.style.display = 'none';
            
            totalProductsElement.textContent = 'Total Products: ' + products.length;
            
            productGrid.innerHTML = '';
            
            products.forEach(product => {
                const productCard = createProductCard(product);
                productGrid.append(productCard);
            });
        })
        .catch(error => {
            errorMessage.textContent = 'Something Went Wrong';
            errorMessage.style.display = 'block';
            errorMessage.style.backgroundColor = 'red';
            errorMessage.style.color = 'white';
            errorMessage.style.textAlign = 'center';
        })
        .finally(() => {
            finalDiv.textContent = 'API Request Completed Successfully';
        });
}

function createProductCard(product) {

    const card = document.createElement('div');
    card.setAttribute('class', 'product-card');
    
    const image = document.createElement('img');
    image.setAttribute('class', 'product-image');
    image.setAttribute('src', product.image);
    image.setAttribute('alt', product.title);
    card.append(image);
    
    const title = document.createElement('div');
    title.setAttribute('class', 'product-title');
    let titleText = product.title;
    if (titleText.length > 30) {
        titleText = titleText.slice(0, 30) + '...';
    }
    title.textContent = titleText;
    card.append(title);
    
    const price = document.createElement('div');
    price.setAttribute('class', 'product-price');
    price.textContent = '$' + product.price;
    card.append(price);

    const category = document.createElement('div');
    category.setAttribute('class', 'product-category');
    category.textContent = 'Category: ' + product.category;
    card.append(category);
    
    const tag = document.createElement('div');
    tag.setAttribute('class', 'product-tag');
    if (product.price > 100) {
        tag.setAttribute('class', 'product-tag tag-expensive');
        tag.textContent = 'Expensive Product';
    } else {
        tag.setAttribute('class', 'product-tag tag-budget');
        tag.textContent = 'Budget Product';
    }
    card.append(tag);
    
    const description = document.createElement('div');
    description.setAttribute('class', 'product-description');
    let descriptionText = product.description;
    if (descriptionText.length > 50) {
        descriptionText = descriptionText.slice(0, 50) + '...';
    }
    description.textContent = descriptionText;
    card.append(description);

    const buttonContainer = document.createElement('div');
    buttonContainer.setAttribute('class', 'button-container');

    const showPriceButton = document.createElement('button');
    showPriceButton.setAttribute('class', 'product-button btn-price');
    showPriceButton.textContent = 'Show Price';
    showPriceButton.addEventListener('click', function() {
        alert(product.price);
    });
    buttonContainer.append(showPriceButton);
    
    const showCategoryButton = document.createElement('button');
    showCategoryButton.setAttribute('class', 'product-button btn-category');
    showCategoryButton.textContent = 'Show Category';
    showCategoryButton.addEventListener('click', function() {
        alert(product.category);
    });
    buttonContainer.append(showCategoryButton);
  
    const viewDetailsButton = document.createElement('button');
    viewDetailsButton.setAttribute('class', 'product-button btn-details');
    viewDetailsButton.textContent = 'View Details';
    viewDetailsButton.addEventListener('click', function() {
        alert('Title: ' + product.title + '\nPrice: $' + product.price + '\nCategory: ' + product.category);
    });
    buttonContainer.append(viewDetailsButton);
    
    card.append(buttonContainer);
    
    return card;
}