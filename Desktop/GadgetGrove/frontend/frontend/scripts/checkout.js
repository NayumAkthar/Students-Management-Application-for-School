document.addEventListener('DOMContentLoaded', async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('Please login to continue.');
    window.location.href = '../templets/index.html';
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const productName = urlParams.get('product');

  if (!productName) {
    alert('No product selected.');
    window.location.href = './homepage.html';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/product/${encodeURIComponent(productName)}`);
    if (!response.ok) throw new Error('Product fetch failed');

    const product = await response.json();
    if (!product || product.error) {
      alert('Product not found.');
      window.location.href = './homepage.html';
      return;
    }


    renderProduct(product);
  } catch (error) {
    console.error('Fetch product error:', error);
    alert('Failed to load product details.');
  }


  fetchAddress(userId);
});


function renderProduct(product) {
  const productImage = document.getElementById('product-image');
  const productNameEl = document.getElementById('product-name');
  const priceEl = document.getElementById('price');
  const deliveryChargesEl = document.getElementById('delivery-charges');
  const protectionFeeEl = document.getElementById('protection-fee');
  const totalEl = document.getElementById('total');

  const priceValue = parseFloat(product.price.replace('₹', '').replace(/,/g, '')) || 0;
  const deliveryCharges = 10;
  const protectionFee = 5;
  const total = priceValue + deliveryCharges + protectionFee;

  productImage.src = product.images[0] || '../images/default.png';
  productNameEl.textContent = product.name;
  priceEl.textContent = `₹${priceValue.toLocaleString()}`;
  deliveryChargesEl.textContent = `₹${deliveryCharges}`;
  protectionFeeEl.textContent = `₹${protectionFee}`;
  totalEl.textContent = `₹${total.toLocaleString()}`;
}


function showAddressForm() {
  document.getElementById('addressForm').style.display = 'block';
}


function cancelForm() {
  document.getElementById('addressForm').style.display = 'none';
}


async function saveAddress() {
  const userId = localStorage.getItem('userId');
  const name = document.getElementById('name').value.trim();
  const pincode = document.getElementById('pincode').value.trim();
  const locality = document.getElementById('locality').value.trim();
  const address = document.getElementById('address').value.trim();
  const city = document.getElementById('city').value.trim();
  const state = document.getElementById('state').value.trim();

  if (!name || !pincode || !locality || !address || !city || !state) {
    alert('Please fill all fields.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name, pincode, locality, address, city, state })
    });

    const data = await response.json();

    if (data.message === 'Address saved successfully') {
      alert('Address saved.');
      document.getElementById('addressForm').style.display = 'none';
      fetchAddress(userId);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Save address error:', error);
    alert('Failed to save address.');
  }
}


async function fetchAddress(userId) {
  try {
    const response = await fetch(`http://localhost:3000/api/address/${userId}`);
    const data = await response.json();

    const currentAddress = document.getElementById('currentAddress');
    if (data.length > 0) {
      const address = data[0];
      currentAddress.innerHTML = `
        <p><strong>${address.name}</strong></p>
        <p>${address.address}, ${address.locality}</p>
        <p>${address.city}, ${address.state} - ${address.pincode}</p>
      `;
    } else {
      currentAddress.innerHTML = '<p>No address found. Please add an address.</p>';
    }
  } catch (error) {
    console.error('Fetch address error:', error);
    document.getElementById('currentAddress').innerHTML = '<p>Failed to load address.</p>';
  }
}

function continueCheckout() {
  const total = document.getElementById('total').textContent.replace('₹', '').replace(',', '');
  const productName = encodeURIComponent(document.getElementById('product-name').textContent);
  const productImage = encodeURIComponent(document.getElementById('product-image').src);

  window.location.href = `/frontend/templets/payment.html?total=${total}&product=${productName}&image=${productImage}`;
}


const userProfile = document.getElementById('userprofile');
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
}
