const API_BASE = "http://localhost:3000/api";


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

  fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then(res => res.json())
    .then(data => {
      if (!data.token) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({ email, role: data.role, token: data.token })
      );

      if (data.role === "admin") {
        window.location.href = "adminDashBoard.html";
      } else {
        window.location.href = "studentDashBoard.html";
      }
    })
    .catch(() => alert("Server error"));
}
