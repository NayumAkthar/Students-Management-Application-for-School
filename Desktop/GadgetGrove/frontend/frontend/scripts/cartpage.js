document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const clearCartBtn = document.getElementById('clear-cart-btn');
  const proceedBtn = document.getElementById('proceed-to-checkout-btn');

  const removeModal = document.getElementById('remove-modal');
  const removeProductNameSpan = document.getElementById('remove-product-name');
  const confirmRemoveBtn = document.getElementById('confirm-remove-btn');
  const cancelRemoveBtn = document.getElementById('cancel-remove-btn');

  let userId = localStorage.getItem('userId');
  let cartItems = [];
  let itemToRemove = null;


  async function fetchCart() {
    if (!userId) {
      cartItemsContainer.innerHTML = '<p>Please login to view your cart.</p>';
      cartTotal.textContent = '₹0.00';
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/cart/${userId}`);
      const data = await res.json();
      cartItems = data;
      renderCartItems();
    } catch (err) {
      console.error('Error fetching cart:', err);
      cartItemsContainer.innerHTML = '<p>Error loading cart items.</p>';
    }
  }


  function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
      cartTotal.textContent = '₹0.00';
      return;
    }

    cartItems.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('cart-item');

      const itemHTML = `
        <img src="${item.image.replace(/^.*\\public/, '').replace(/\\/g, '/')}" alt="${item.name}" class="item-image">
        <div class="item-details">
          <h4>${item.name}</h4>
          <p>Price: ₹${item.price}</p>
          <p>Quantity: ${item.quantity}</p>
          <button class="remove-btn" data-id="${item.id}" data-name="${item.name}">Remove</button>
        </div>
      `;
      itemDiv.innerHTML = itemHTML;
      cartItemsContainer.appendChild(itemDiv);

      total += item.price * item.quantity;
    });

    cartTotal.textContent = `₹${total.toFixed(2)}`;
    attachRemoveListeners();
  }

  function attachRemoveListeners() {
    const removeBtns = document.querySelectorAll('.remove-btn');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        itemToRemove = btn.getAttribute('data-id');
        removeProductNameSpan.textContent = btn.getAttribute('data-name');

        removeModal.classList.add('show');





      });
    });
  }


  confirmRemoveBtn.addEventListener('click', async () => {
    if (itemToRemove) {
      try {
        await fetch(`http://localhost:3000/api/cart/${itemToRemove}`, { method: 'DELETE' });
        removeModal.style.display = 'none';
        fetchCart();
      } catch (err) {
        console.error('Error removing item:', err);
      }
    }
  });


  cancelRemoveBtn.addEventListener('click', () => {
    removeModal.style.display = 'none';

    itemToRemove = null;
  });

  clearCartBtn.addEventListener('click', async () => {
    if (cartItems.length === 0) return;

    for (let item of cartItems) {
      await fetch(`http://localhost:3000/api/cart/${item.id}`, { method: 'DELETE' });
    }
    fetchCart();
  });


  proceedBtn.addEventListener('click', () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    window.location.href = 'checkout.html';
  });

  fetchCart();
});

document.addEventListener('DOMContentLoaded', () => {
  const loginProfileLink = document.getElementById("userprofile");
  const userId = localStorage.getItem('userId');

  if (userId) {
    loginProfileLink.textContent = 'Profile';
    loginProfileLink.href = '/frontend/templets/userprofile.html';
  } else {
    loginProfileLink.textContent = 'Login';
    loginProfileLink.href = 'index.html';
  }
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


