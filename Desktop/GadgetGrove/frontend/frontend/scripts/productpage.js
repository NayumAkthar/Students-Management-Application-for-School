document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productName = urlParams.get('product');

  if (!productName) {
    alert("No product specified.");
    return;
  }


  fetch(`http://localhost:3000/api/product/${encodeURIComponent(productName)}`)
    .then(response => {
      if (!response.ok) throw new Error("Product not found");
      return response.json();
    })
    .then(product => {
      if (product.message === "Out of Stock") {
  alert("This product is currently out of stock.");
  document.getElementById('product-title').textContent = "Out of Stock";
  document.getElementById('product-price').textContent = "";
  document.getElementById('add-to-cart-btn').disabled = true;
  document.getElementById('buy-now-btn').disabled = true;
  return;
}
   
      document.getElementById('product-title').textContent = product.name;


      document.getElementById('product-price').textContent = product.price;

   
      const mainImage = document.getElementById('product-img');
      mainImage.src = product.images[0];

    
      const thumbnailGallery = document.querySelector('.thumbnail-gallery');
      thumbnailGallery.innerHTML = '';
      product.images.forEach((imageSrc, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = imageSrc;
        thumbnail.alt = `Thumbnail ${index + 1}`;
        thumbnail.classList.add('thumbnail');
        if (index === 0) thumbnail.classList.add('active');

        thumbnail.addEventListener('click', () => {
          mainImage.src = imageSrc;
          document.querySelectorAll('.thumbnail-gallery img').forEach(img => img.classList.remove('active'));
          thumbnail.classList.add('active');
        });

        thumbnailGallery.appendChild(thumbnail);
      });

   
      const highlightsList = document.getElementById('product-highlights');
      highlightsList.innerHTML = '';
      product.highlights.forEach(highlight => {
        const li = document.createElement('li');
        const strong = document.createElement('strong');
        strong.textContent = highlight;
        li.appendChild(strong);
        highlightsList.appendChild(li);
      });


      const descriptionDiv = document.getElementById('product-description');
      descriptionDiv.innerHTML = product.description || "No description available.";

     
      const addToCartBtn = document.getElementById('add-to-cart-btn');
      const userId = localStorage.getItem('userId');

      addToCartBtn.addEventListener('click', async () => {
        if (!userId) {
          alert('Please login to add items to your cart.');
          window.location.href = '/frontend/templets/sign-in.html';
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


      const buyNowBtn = document.getElementById('buy-now-btn');
if (buyNowBtn) {
  buyNowBtn.addEventListener('click', () => {
    const productName = encodeURIComponent(product.name);
    window.location.href = `../templets/checkout.html?product=${productName}`;
  });
}

    })
    .catch(err => {
      console.error("Error loading product:", err);
      alert("Product not found or server error.");
    });


  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const searchTerm = e.target.value.trim();
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
