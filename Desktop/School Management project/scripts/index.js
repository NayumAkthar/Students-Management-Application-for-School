function handleSubmit(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  const emailError = document.getElementById("loginEmailError");
  const passwordError = document.getElementById("loginPasswordError");


  emailError.textContent = "";
  passwordError.textContent = "";

  if (!email || !password) {
    if (!email) emailError.textContent = "Email is required";
    if (!password) passwordError.textContent = "Password is required";
    return;
  }


  fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then(async (res) => {
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      
      localStorage.setItem("user", JSON.stringify(data.user));

      
      if (data.user.role === "admin") {
        window.location.href = "public/adminDashBoard.html";
      } else if (data.user.role === "student") {
        window.location.href = "public/studentDashBoard.html";
      } else {
        alert("Unknown user role");
      }
    })
    .catch((err) => {
      console.error("Login error:", err);
      alert(err.message || "Server error. Try again later.");
    });
}
