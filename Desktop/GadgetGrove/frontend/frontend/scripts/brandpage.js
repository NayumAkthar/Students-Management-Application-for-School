document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const brand = urlParams.get('brand');

  if (!brand) {
    console.error('No brand specified in URL');
    return;
  }

  fetch(`http://localhost:3000/api/brands/${encodeURIComponent(brand)}`)
    .then(response => response.json())
    .then(products => {
      const productGrid = document.getElementById('product-grid');
      productGrid.innerHTML = '';

      if (products.length === 0) {
        productGrid.innerHTML = '<p>No products found for this brand.</p>';
        return;
      }

      products.forEach(product => {
        const div = document.createElement('div');
        div.classList.add('product');
        div.setAttribute('data-name', product.name);
        div.setAttribute('data-description', product.name);

        div.innerHTML = `
          <img src="${product.image1}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>₹${product.price}</p>
          
        `;

        div.addEventListener('click', () => {
          window.location.href = `/frontend/templets/productpage.html?product=${encodeURIComponent(product.name)}`;
        });

        productGrid.appendChild(div);
      });
    })
    .catch(err => console.error('Error fetching brand products:', err));
  function searchProducts() {
    const searchInput = document.getElementById('search');
    const searchTerm = searchInput.value.toLowerCase();
    const products = document.querySelectorAll('.product');

    products.forEach(product => {
      const name = product.getAttribute('data-name').toLowerCase();
      const description = product.getAttribute('data-description').toLowerCase();
      if (name.includes(searchTerm) || description.includes(searchTerm)) {
        product.style.display = '';
      } else {
        product.style.display = 'none';
      }
    });
  }
  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const searchTerm = e.target.value.trim();
        console.log('Search term entered:', searchTerm);
        if (searchTerm) {
          window.location.href = `/frontend/templets/searchpage.html?query=${encodeURIComponent(searchTerm)}`;
        }
      }
    });
  } else {
    console.error('Search input not found');
  }

  const userProfile = document.querySelector('.userprofile');
  if (userProfile) {
    userProfile.addEventListener('click', () => {
      const user = localStorage.getItem('user');
      if (user) {
        window.location.href = '/frontend/templets/userprofile.html';
      } else {
        window.location.href = '/frontend/templets/index.html';
      }
    });
  }
  const cart = document.querySelector('.cart');
  if (cart) {
    cart.addEventListener('click', () => {
      window.location.href = '/frontend/templets/cart.html';
    });
  }
});
