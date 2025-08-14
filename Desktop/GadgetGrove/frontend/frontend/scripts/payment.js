document.addEventListener('DOMContentLoaded', async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('Please login to continue.');
    window.location.href = '../templets/index.html';
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const productName = urlParams.get('product') || 'Unknown Product';
  const totalParam = urlParams.get('total') || '0';
  const totalAmount = parseFloat(totalParam.replace(/,/g, '')) || 0.00;
  const productImage = urlParams.get('image') || 'https://via.placeholder.com/100';

  document.getElementById('product-name').textContent = productName;
  document.getElementById('product-image').src = productImage;
  document.getElementById('total-amount').textContent = `₹${totalAmount.toLocaleString()}`;

  const paymentSuccessModal = document.getElementById('payment-success-modal');
  const returnHomeBtn = document.getElementById('return-home-btn');

  returnHomeBtn.addEventListener('click', () => {
    window.location.href = '../templets/homepage.html';
  });

  window.proceedPayment = async function() {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

    
    const orderData = {
      userId,
      productName,
      productImage,
      total: totalAmount,
      paymentMethod: paymentMethod.toUpperCase() === 'COD' ? 'COD' : paymentMethod
    };

    if (paymentMethod === 'cod') {
    
      try {
        const response = await fetch('http://localhost:3000/api/orders/place-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (response.ok && data.message === 'Order placed successfully') {
          showPaymentSuccessModal();
        } else {
          alert(data.message || 'Failed to place order.');
        }
      } catch (error) {
        console.error('COD order error:', error);
        alert('Failed to place COD order.');
      }
      return;
    }

 
try {
  const res = await fetch('http://localhost:3000/api/payment/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: totalAmount })
  });

  const order = await res.json();

  const options = {
    key: 'rzp_test_TVQ0H2FJJuxykD', 
    amount: order.amount,
    currency: order.currency,
    name: 'Gadget Grove',
    description: productName,
    image: productImage,
    order_id: order.id,
    handler: async function (response) {
      alert('Payment Successful. Payment ID: ' + response.razorpay_payment_id);

      
      const paymentResponse = await fetch('http://localhost:3000/api/payment/payment-success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
  userId,
  productName,
  productImage,
  amount: totalAmount,
  payment_method: 'RAZORPAY',
  razorpay_payment_id: response.razorpay_payment_id,
  razorpay_order_id: response.razorpay_order_id,
  razorpay_signature: response.razorpay_signature
})

      });

      const paymentResult = await paymentResponse.json();
     if (paymentResult.message?.toLowerCase().includes('success')) {
  showPaymentSuccessModal();
} else {
  alert(paymentResult.message || 'Payment processed but failed to record order. Contact support.');
}

    },
    prefill: {
      name: 'Shaik Nayum Akthar',
      email: 'nayunayum18@gmail.com',
      contact: '8978040361'
    },
    theme: { color: '#3399cc' }
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
} catch (error) {
  console.error('Online payment error:', error);
  alert('Failed to initiate online payment.');
}

  };

  function showPaymentSuccessModal() {
    paymentSuccessModal.style.display = 'flex';
  }


  const profileBtn = document.querySelector('.userprofile');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      window.location.href = '../templets/userprofile.html';
    });
  }


  const cartBtn = document.querySelector('.cart');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      window.location.href = '../templets/cart.html';
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
});
