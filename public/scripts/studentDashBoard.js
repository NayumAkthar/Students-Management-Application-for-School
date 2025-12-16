const API_BASE = "http://localhost:3000/api";


window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "student") {
    alert("Unauthorized");
    window.location.href = "index.html";
    return;
  }

  fetch(`${API_BASE}/student/profile?email=${user.email}`)
    .then(res => res.json())
    .then(data => {
      const s = data.student;

      document.getElementById("student-name").textContent = s.name;
      document.getElementById("student-admnNo").textContent = s.admission_no;
      document.getElementById("student-email").textContent = s.email;
      document.getElementById("student-class").textContent = s.class;

      document.getElementById("firstLang").textContent = s.first_language ?? "-";
      document.getElementById("secondLang").textContent = s.second_language ?? "-";
      document.getElementById("thirdLang").textContent = s.third_language ?? "-";
      document.getElementById("math").textContent = s.maths ?? "-";
      document.getElementById("science").textContent = s.science ?? "-";
      document.getElementById("social").textContent = s.social ?? "-";
      document.getElementById("Total").textContent =
        s.total_marks ?? "Not Assigned";
    })
    .catch(() => alert("Failed to load profile"));
});

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

/* -------- Change Password ---------- */

function changepass() {
  document.getElementById("changePasswordPopup").style.display = "flex";
}

function closeChangePassword() {
  document.getElementById("changePasswordPopup").style.display = "none";
}

function handleChangePassword(event) {
  event.preventDefault();

  const user = JSON.parse(localStorage.getItem("user"));
  const currentPassword = document.getElementById("currentPass").value;
  const newPassword = document.getElementById("newPass").value;
  const confirmPassword = document.getElementById("confirmPass").value;
  const msg = document.getElementById("msg");

  msg.textContent = "";

  if (newPassword !== confirmPassword) {
    msg.textContent = "Passwords do not match";
    return;
  }

  fetch(`${API_BASE}/auth/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user.email,
      currentPassword,
      newPassword,
    }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.message === "Password updated successfully") {
        alert("Password changed");
        closeChangePassword();
      } else {
        msg.textContent = data.message;
      }
    })
    .catch(() => (msg.textContent = "Server error"));
}
