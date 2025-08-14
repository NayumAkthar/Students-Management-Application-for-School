
function toggleForm(form) {
  document.getElementById('login-form').style.display = form === 'login' ? 'block' : 'none';
  document.getElementById('signup-form').style.display = form === 'signup' ? 'block' : 'none';
  document.getElementById('otp-form').style.display = 'none';
}


async function handleSignup(event) {
  event.preventDefault();

  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const mobile = document.getElementById('signup-mobile').value.trim();

  if (!name || !email || !mobile) {
    alert('Please fill all fields.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, mobile })
    });

    const data = await response.json();
    console.log('Signup response:', data);

    if (data.success) {
      alert('Signup successful. You can now login.');
      toggleForm('login');
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Signup Error:', error);
    alert('Signup failed. Please try again.');
  }
}


async function handleLogin(event) {
  event.preventDefault();

  const identifier = document.getElementById('login-identifier').value.trim();

  if (!identifier) {
    alert('Please enter your email or mobile.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/users/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier })
    });

    const data = await response.json();
    console.log('Send OTP response:', data);

    if (data.success) {
      alert('OTP sent successfully.');
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('signup-form').style.display = 'none';
      document.getElementById('otp-form').style.display = 'block';

      
      sessionStorage.setItem('loginIdentifier', identifier);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Send OTP Error:', error);
    alert('Failed to send OTP. Please try again.');
  }
}


async function handleOtpSubmit(event) {
  event.preventDefault();

  const otp = document.getElementById('otp-input').value.trim();
  const identifier = sessionStorage.getItem('loginIdentifier');

  if (!otp || !identifier) {
    alert('Please enter OTP.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/users/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, otp })
    });

    const data = await response.json();
    console.log('Verify OTP response:', data);

    if (data.success) {
      alert('Login successful.');

      
      localStorage.setItem('userId', data.userId);

      window.location.href = './homepage.html';
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Verify OTP Error:', error);
    alert('OTP verification failed. Please try again.');
  }
}


async function resendOtp() {
  const identifier = sessionStorage.getItem('loginIdentifier');
  if (!identifier) {
    alert('No identifier found. Please login again.');
    toggleForm('login');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/users/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier })
    });

    const data = await response.json();
    console.log('Resend OTP response:', data);

    if (data.success) {
      alert('OTP resent successfully.');
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Resend OTP Error:', error);
    alert('Failed to resend OTP. Please try again.');
  }
}
