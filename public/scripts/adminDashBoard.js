
window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "admin") {
    alert("Unauthorized access");
    window.location.href = "./index.html";
    return;
  }

  fetchStudents();
});


function fetchStudents() {
  fetch("/api/admin/students")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("studentTableBody");
      tbody.innerHTML = "";
      data.students.forEach((student, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${student.admission_no}</td>
          <td>${student.name}</td>
          <td>${student.email}</td>
          <td>${student.class}</td>
    
        `;
        tbody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("Error fetching students", err);
      alert("Failed to load student data");
    });
}


document.getElementById("addStudent").addEventListener("submit", (e) => {
  e.preventDefault();

  const student = {
    admission_no: document.getElementById("admission").value.trim(),
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    class: document.getElementById("cls").value.trim(),
    password: document.getElementById("DefaultPass").value.trim(),
  };

  fetch("/api/admin/add-student", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message || "Student added successfully");
      fetchStudents();
    })
    .catch((err) => {
      console.error("Add student error:", err);
      alert("Failed to add student");
    });
});


document.getElementById("assignMarksForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const admissionNo = document.getElementById("assignMarks").value.trim();
  const firstLang = parseInt(document.getElementById("firstLang").value.trim()) || 0;
  const secondLang = parseInt(document.getElementById("secondLang").value.trim()) || 0;
  const thirdLang = parseInt(document.getElementById("thirdLang").value.trim()) || 0;
  const maths = parseInt(document.getElementById("maths").value.trim()) || 0;
  const science = parseInt(document.getElementById("science").value.trim()) || 0;
  const social = parseInt(document.getElementById("social").value.trim()) || 0;

  fetch("/api/admin/assign-marks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      admission_no: admissionNo,
      first_language: firstLang,
      second_language: secondLang,
      third_language: thirdLang,
      maths: maths,
      science: science,
      social: social
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message || "Marks assigned successfully");
      fetchStudents();
    })
    .catch((err) => {
      console.error("Error assigning subject-wise marks:", err);
      alert("Failed to assign marks");
    });
});


function logout() {
  localStorage.removeItem("user");
  window.location.href = "./index.html";
}


document.querySelector(".menu-button").addEventListener("click", () => {
  document.querySelector(".dropdown-content").classList.toggle("show");
});


function changePassword() {
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

  if (!currentPassword || !newPassword || !confirmPassword) {
    msg.textContent = "All fields are required.";
    return;
  }
  if (newPassword !== confirmPassword) {
    msg.textContent = "New passwords do not match.";
    return;
  }

  fetch("/api/auth/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user.email,
      currentPassword,
      newPassword,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message === "Password updated successfully") {
        msg.style.color = "green";
        msg.textContent = "Password changed!";
        closeChangePassword();
        alert("Password changed successfully!");
      } else {
        msg.style.color = "red";
        msg.textContent = data.message || "Failed to change password";
      }
    })
    .catch((err) => {
      console.error("Password update error", err);
      msg.textContent = "Server error";
    });
}


function openResetPopup() {
  document.getElementById('resetStudentPasswordPopup').style.display = 'flex';
}
function closeResetPopup() {
  document.getElementById('resetStudentPasswordPopup').style.display = 'none';
}


async function handleResetStudentPassword(event) {
  event.preventDefault();

  const email = document.getElementById('studentResetEmail').value.trim();
  const newPassword = document.getElementById('studentNewPassword').value.trim();

  if (!email || !newPassword) {
    document.getElementById('resetMsg').textContent = "All fields are required.";
    return;
  }

  try {
    const response = await fetch('/api/admin/reset-student-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword })
    });

    const result = await response.json();
    document.getElementById('resetMsg').textContent = result.message;

    if (response.ok) {
      document.getElementById('resetStudentPasswordForm').reset();
      setTimeout(closeResetPopup, 1500);
    }
  } catch (error) {
    console.error('Reset error:', error);
    document.getElementById('resetMsg').textContent = 'Failed to reset password.';
  }
}
