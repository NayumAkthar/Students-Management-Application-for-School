document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('admin-email').value.trim();
  const password = document.getElementById('admin-password').value.trim();

  try {
    const response = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
     
      window.location.href = './adminDashBoard.html';
    } else {
    
      document.getElementById('login-error').innerText = data.message || 'Invalid login';
      document.getElementById('login-error').style.display = 'block';
    }

  } catch (error) {
    console.error('Error:', error);
    document.getElementById('login-error').innerText = 'Server error. Please try again.';
    document.getElementById('login-error').style.display = 'block';
  }
});
