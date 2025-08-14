document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3000/api/slides')
    .then(response => response.json())
    .then(slidesData => {
      const carousel = document.querySelector('.carousel');
      carousel.innerHTML = '';

      slidesData.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'slide' + (index === 0 ? ' active' : '');
        slideDiv.innerHTML = `<img src="${slide.image}" alt="Slide ${index + 1}">`;
        carousel.appendChild(slideDiv);
      });

      setupCarousel();
    })
    .catch(err => console.error('Error loading slides:', err));
  function setupCarousel() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const totalSlides = slides.length;

    function showSlide(n) {
      if (n >= totalSlides) {
        currentSlide = 0;
      } else if (n < 0) {
        currentSlide = totalSlides - 1;
      } else {
        currentSlide = n;
      }
      slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
      });
    }

    document.querySelector('.next').addEventListener('click', () => {
      showSlide(currentSlide + 1);
    });

    document.querySelector('.prev').addEventListener('click', () => {
      showSlide(currentSlide - 1);
    });

    setInterval(() => {
      showSlide(currentSlide + 1);
    }, 3000);

    showSlide(currentSlide);
  }
  fetch('http://localhost:3000/api/suggestions')
    .then(response => response.json())
    .then(products => {
      const productList = document.querySelector('.product-list');
      productList.innerHTML = '';

      products.forEach(product => {
        const div = document.createElement('div');
        div.classList.add('product');
        div.setAttribute('data-product', product.name);
        div.innerHTML = `
  <img src="${product.image1}" alt="${product.name}" class="product-link">
  <h3 class="product-link">${product.name}</h3>
  <p>₹${product.price}</p>
  <button class="add-to-cart">Add to Cart</button>
`;

        productList.appendChild(div);
      });

      setupProductEventListeners(products);
    })
    .catch(err => console.error('Error loading suggestions:', err));

  function setupProductEventListeners(products) {
    document.querySelectorAll('.product').forEach(productEl => {
      const productName = productEl.getAttribute('data-product');
      const product = products.find(p => p.name === productName);
      const links = productEl.querySelectorAll('.product-link');

      links.forEach(link => {
        link.addEventListener('click', () => {
          window.location.href = `/frontend/templets/productpage.html?product=${encodeURIComponent(productName)}`;
        });
      });


      const addToCartBtn = productEl.querySelector('.add-to-cart');
      addToCartBtn.addEventListener('click', async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          alert('Please login to add items to your cart.');
          window.location.href = '/frontend/templets/index.html';
          return;
        }

        try {
          const res = await fetch('http://localhost:3000/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: userId,
              productId: product.id,
              quantity: 1
            })
          });

          const data = await res.json();
          if (res.ok) {
            alert(`${product.name} has been added to your cart!`);
            window.location.href = '/frontend/templets/cart.html';
          } else {
            console.error('Add to cart error:', data.message);
            alert('Failed to add item to cart. Please try again.');
          }
        } catch (err) {
          console.error('Add to cart fetch error:', err);
          alert('Server error. Please try again later.');
        }
      });
    });
  }

  document.querySelectorAll('.brand-button').forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const brand = button.getAttribute('data-brand');
      if (brand) {
        window.location.href = `brandpage.html?brand=${encodeURIComponent(brand)}`;
      } else {
        console.error('Brand not found for button:', button);
      }
    });
  });


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
      window.location.href = '/frontend/templets/userprofile.html';
    });
  }

  const cart = document.querySelector('.cart');
  if (cart) {
    cart.addEventListener('click', () => {
      window.location.href = '/frontend/templets/cart.html';
    });
  }
});
