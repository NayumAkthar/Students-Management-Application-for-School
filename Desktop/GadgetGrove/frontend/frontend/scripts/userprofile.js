document.addEventListener('DOMContentLoaded', () => {
  const userId = localStorage.getItem('userId');

  if (!userId) {
    window.location.href = 'index.html';
    return;
  }


  fetch(`http://localhost:3000/api/users/${userId}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('name').value = data.name;
      document.getElementById('user-name').textContent = data.name;
      document.getElementById('user-email').textContent = data.email;
    })
    .catch(err => console.error('Error fetching user:', err));


  fetch(`http://localhost:3000/api/address/${userId}`)
    .then(res => res.json())
    .then(addresses => {
      const address = addresses[0];
      if (address) {
        document.querySelector('.display-address').textContent =
          `${address.address}, ${address.locality}, ${address.city}, ${address.state}, ${address.pincode}`;
      } else {
        document.querySelector('.display-address').textContent = 'No address found. Please add.';
      }
    })
    .catch(err => console.error('Error fetching address:', err));



  fetch(`http://localhost:3000/api/orders/${userId}`)
    .then(res => res.json())
    .then(orders => {
      const orderList = document.querySelector('.orders ul');
      orderList.innerHTML = '';

      orders.forEach(order => {
        console.log('Order image path:', order.product_image);

        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.marginBottom = '15px';
        li.style.padding = '20px';
        li.style.border = '1px solid #ddd';
        li.style.borderRadius = '8px';
        li.style.backgroundColor = '#f9f9f9';

        li.innerHTML = `
        <img src="${order.product_image}" alt="${order.product_name}" style="width: 120px; height: auto; margin-right: 10px;" onerror="this.src='../images/default.png'">
        <div>
          <p><strong>Product:</strong> ${order.product_name}</p>
          <p><strong>Order ID:</strong> ${order.order_id}</p>
          <p><strong>Price:</strong> ₹${order.total_amount}</p>
          <p><strong>Payment Method:</strong> ${order.payment_method}</p>
          <p><strong>Payment Status:</strong> ${order.payment_status}</p>
          <p><strong>Date:</strong> ${new Date(order.order_date).toLocaleDateString()}</p>
        </div>
      `;

        orderList.appendChild(li);
      });
    })
    .catch(err => console.error('Error fetching orders:', err));



  const editBtn = document.querySelector('.edit-btn');
  const addressForm = document.querySelector('.address-form');

  if (editBtn && addressForm) {
    editBtn.addEventListener('click', () => {
      addressForm.style.display = 'block';
    });


    document.querySelector('.save-btn').addEventListener('click', () => {
      const name = document.getElementById('name').value.trim();
      const pincode = document.getElementById('pincode').value.trim();
      const locality = document.getElementById('locality').value.trim();
      const address = document.getElementById('address').value.trim();
      const city = document.getElementById('city').value.trim();
      const state = document.getElementById('state').value.trim();

      if (!name || !pincode || !locality || !address || !city || !state) {
        alert('Please fill all required fields.');
        return;
      }

      fetch('http://localhost:3000/api/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name, pincode, locality, address, city, state })
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message);
          addressForm.style.display = 'none';
          document.querySelector('.display-address').textContent =
            `${address}, ${locality}, ${city}, ${state}, ${pincode}`;
        })
        .catch(err => {
          console.error('Error saving address:', err);
          alert('Server error saving address.');
        });
    });


    document.querySelector('.cancel-btn').addEventListener('click', () => {
      addressForm.style.display = 'none';
    });
  }

  const signoutBtn = document.querySelector('.signout-btn');
  if (signoutBtn) {
    signoutBtn.addEventListener('click', () => {
      localStorage.removeItem('userId');
      window.location.href = 'index.html';
    });
  }

  const userProfileNav = document.querySelector('.userprofile');
  if (userProfileNav) {
    userProfileNav.addEventListener('click', () => {
      window.location.href = 'userprofile.html';
    });
  }

  const cartNav = document.querySelector('.cart');
  if (cartNav) {
    cartNav.addEventListener('click', () => {
      window.location.href = 'cart.html';
    });
  }
});
