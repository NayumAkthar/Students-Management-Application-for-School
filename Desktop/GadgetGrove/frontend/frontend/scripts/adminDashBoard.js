console.log('adminDashBoard.js loaded');
document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.content-section');
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();

      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      sections.forEach(section => section.classList.add('hidden'));
      const sectionId = item.getAttribute('data-section');
      document.getElementById(sectionId).classList.remove('hidden');

      window.location.hash = sectionId;
    });
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    alert('Logging out...');
    window.location.href = './adminlogin.html';
  });

  document.getElementById('addItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const response = await fetch('http://localhost:3000/api/adminfunctions/add-mobile', {
  method: 'POST',
  body: formData
});
      if (response.ok) {
        alert('Mobile added successfully!');
        e.target.reset();
        loadOrders();
      } else {
        alert('Error adding mobile');
      }
    } catch (err) {
      console.error(err);
    }
  });

  window.searchMobile = async function() {
    const searchTerm = document.getElementById('search-mobile').value.trim();
    if (!searchTerm) {
      alert('Please enter a mobile name to search');
      return;
    }

    try {
     const response = await fetch(`http://localhost:3000/api/adminfunctions/search-mobile/${searchTerm}`);

      const mobile = await response.json();

      if (mobile) {
        document.getElementById('edit-id').value = mobile.id;
        document.getElementById('edit-name').value = mobile.name;
        document.getElementById('edit-brand').value = mobile.brand;
        document.getElementById('edit-price').value = mobile.price;
        document.getElementById('edit-stock').value = mobile.stock;
        document.getElementById('edit-description').value = mobile.description;
        document.getElementById('edit-highlights').value = mobile.highlights;
        document.getElementById('editItemForm').classList.remove('hidden');
      } else {
        alert('Mobile not found');
      }
    } catch (err) {
      console.error(err);
      alert('Error searching for mobile');
    }
  };


  document.getElementById('editItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const price = document.getElementById('edit-price').value;
    const stock = document.getElementById('edit-stock').value;

    try {
      const response = await fetch(`http://localhost:3000/api/adminfunctions/update-mobile`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id, price, stock })
});


      if (response.ok) {
        alert('Mobile updated successfully!');
        e.target.reset();
        document.getElementById('editItemForm').classList.add('hidden');
        loadOrders();
      } else {
        alert('Error updating mobile');
      }
    } catch (err) {
      console.error(err);

    }
  });

  // Remove Mobile
  // window.removeMobile = async function() {
  //   const id = document.getElementById('edit-id').value;
  //   if (!confirm('Are you sure you want to delete this mobile?')) return;

  //   try {
  //     const response = await fetch(`/api/adminfunctions/delete-mobile/${id}`, { method: 'DELETE' });
  //     if (response.ok) {
  //       alert('Mobile deleted successfully!');
  //       document.getElementById('editItemForm').reset();
  //       document.getElementById('editItemForm').classList.add('hidden');
  //       loadOrders();
  //     } else {
  //       alert('Error deleting mobile');
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert('Error deleting mobile');
  //   }
  // };
  document.getElementById('addSlidesForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const response = await fetch('http://localhost:3000/api/adminfunctions/add-slide', {
  method: 'POST',
  body: formData
});

      if (response.ok) {
        alert('Slide added successfully!');
        e.target.reset();
        loadSlides();
      } else {
        alert('Error adding slide');
      }
    } catch (err) {
      console.error(err);

    }
  });

window.editSlide = function(id, imageUrl) {
  document.getElementById('edit-slide-id').value = id;
  document.getElementById('current-slide-image').src = imageUrl;
  document.getElementById('editSlideForm').classList.remove('hidden');
};


document.getElementById('editSlideForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const slideId = document.getElementById('edit-slide-id').value;
  const formData = new FormData(e.target);

  try {
    const response = await fetch(`http://localhost:3000/api/adminfunctions/update-slide/${slideId}`, {
      method: 'PUT',
      body: formData
    });

    if (response.ok) {
      alert('Slide updated successfully!');
      e.target.reset();
      document.getElementById('editSlideForm').classList.add('hidden');
      loadSlides(); 
    } else {
      alert('Error updating slide');
    }
  } catch (err) {
    console.error(err);
  }
});

async function loadSlides() {
  try {
    const response = await fetch('http://localhost:3000/api/adminfunctions/slides');
    const slides = await response.json();

    const slideList = document.getElementById('slide-list');
    slideList.innerHTML = '';

    slides.forEach(slide => {
      const imageUrl = `${slide.image}`;

      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <img src="${imageUrl}" alt="Slide Image" style="max-width: 80px;">
          <span>Slide ${slide.id}</span>
        </div>
        <div>
          <button type="button" onclick="editSlide(${slide.id}, '${imageUrl}')">Edit</button>
          <button type="button" onclick="deleteSlide(${slide.id})">Delete</button>
        </div>
      `;
      slideList.appendChild(li);
    });

  } catch (err) {
    console.error(err);
    alert('Error loading slides');
  }
}
  window.deleteSlide = async function(slideId) {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/adminfunctions/delete-slide/${slideId}`, { method: 'DELETE' });

      if (response.ok) {
        alert('Slide deleted successfully!');
        loadSlides();
      } else {
        alert('Error deleting slide');
      }
    } catch (err) {
      console.error(err);
    }
  };

  document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;

    try {
     const response = await fetch('http://localhost:3000/api/adminfunctions/change-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ oldPassword, newPassword })
});

      if (response.ok) {
        alert('Password changed successfully!');
        e.target.reset();
      } else {
        alert('Error changing password');
      }
    } catch (err) {
      console.error(err);
      alert('Error changing password');
    }
  });
async function loadOrders() {
  try {
    const response = await fetch('http://localhost:3000/api/adminfunctions/orders');
    const orders = await response.json();

    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';

    orders.forEach(order => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <strong>Order ID:</strong> ${order.order_id} <br>
          <strong>Product:</strong> ${order.product_name} <br>
          <strong>Total:</strong> ₹${order.total_amount} <br>
          <strong>Status:</strong> ${order.order_status}
        </div>
        <button onclick="viewOrderDetails(${order.order_id})" style="color:white;background-color:black; border-radius:10px; width:100px; height:30px;">View Details</button>
      `;
      orderList.appendChild(li);
    });

  } catch (err) {
    console.error(err);
    alert('Error loading orders');
  }
}

window.viewOrderDetails = async function(orderId) {
  try {
    const response = await fetch(`http://localhost:3000/api/adminfunctions/order/${orderId}`);
    const order = await response.json();

    const modalBody = document.getElementById('order-details-body');
    modalBody.innerHTML = `
     <img src="${order.product_image}" alt="${order.product_name}" style="width: 100%; max-width: 200px; border: 1px solid #ccc; border-radius: 5px; align-item:center">
      <h4>Order ID: ${order.order_id}</h4>
      <p><strong>Product Name:</strong> ${order.product_name}</p>
      <p><strong>Price:</strong> ₹${order.total_amount}</p>
      <p><strong>Payment Method:</strong> ${order.payment_method}</p>
      <p><strong>Payment Status:</strong> ${order.payment_status}</p>
      <p><strong>Order Status:</strong> ${order.order_status}</p>
      <p><strong>Order Date:</strong> ${new Date(order.order_date).toLocaleString()}</p>
      <p><strong>Customer ID:</strong> ${order.user_id}</p>
      <p><strong>Customer Name:</strong> ${order.customer_name}</p>
      <p><strong>Customer Email:</strong> ${order.customer_email}</p>
      <p><strong>Customer Address:</strong> ${order.customer_address}</p>
     
    `;

    document.getElementById('orderDetailsModal').classList.remove('hidden');

  } catch (err) {
    console.error(err);
    alert('Failed to load order details');
  }
};


  document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('form').reset();
      btn.closest('.content-section').classList.add('hidden');
      document.getElementById('dashboardSection').classList.remove('hidden');
    });
  });

  loadOrders();
  loadSlides();
});
