const API_BASE = "https://students-management-application-for.onrender.com/api";

window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    alert("Unauthorized");
    window.location.href = "index.html";
    return;
  }

  fetchStudents();

  document
    .getElementById("addStudent")
    .addEventListener("submit", addStudent);

  document
    .getElementById("assignMarksForm")
    .addEventListener("submit", assignMarks);

  document.querySelector(".menu-button").onclick = () =>
    document.querySelector(".dropdown-content").classList.toggle("show");
});

/* ================= STUDENTS ================= */

function fetchStudents() {
  fetch(`${API_BASE}/admin/students`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("studentTableBody");
      tbody.innerHTML = "";

      if (!data.students || data.students.length === 0) {
        tbody.innerHTML =
          "<tr><td colspan='5'>No students found</td></tr>";
        return;
      }

      data.students.forEach((s, i) => {
        tbody.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${s.admission_no}</td>
            <td>${s.name}</td>
            <td>${s.email}</td>
            <td>${s.class}</td>
          </tr>`;
      });
    })
    .catch(err => {
      console.error("Fetch students error:", err);
      alert("Failed to load students");
    });
}

/* ================= ADD STUDENT ================= */

function addStudent(e) {
  e.preventDefault();

  const admission_no =
    document.getElementById("admission").value.trim();
  const name =
    document.getElementById("name").value.trim();
  const email =
    document.getElementById("email").value.trim();
  const studentClass =
    document.getElementById("cls").value.trim();
  const password =
    document.getElementById("DefaultPass").value.trim();

  if (!admission_no || !name || !email || !studentClass || !password) {
    alert("All fields are required");
    return;
  }

  fetch(`${API_BASE}/admin/add-student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      admission_no,
      name,
      email,
      class: studentClass,
      password,
    }),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      fetchStudents();
      document.getElementById("addStudent").reset();
    })
    .catch(err => {
      console.error("Add student error:", err);
      alert("Failed to add student");
    });
}

/* ================= ASSIGN MARKS ================= */

function assignMarks(e) {
  e.preventDefault();

  const admission_no =
    document.getElementById("assignMarks").value.trim();

  const first_language =
    Number(document.getElementById("firstLang").value) || 0;
  const second_language =
    Number(document.getElementById("secondLang").value) || 0;
  const third_language =
    Number(document.getElementById("thirdLang").value) || 0;
  const maths =
    Number(document.getElementById("maths").value) || 0;
  const science =
    Number(document.getElementById("science").value) || 0;
  const social =
    Number(document.getElementById("social").value) || 0;

  if (!admission_no) {
    alert("Admission number is required");
    return;
  }

  fetch(`${API_BASE}/admin/assign-marks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      admission_no,
      first_language,
      second_language,
      third_language,
      maths,
      science,
      social,
    }),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      document.getElementById("assignMarksForm").reset();
    })
    .catch(err => {
      console.error("Assign marks error:", err);
      alert("Failed to assign marks");
    });
}

/* ================= CHANGE PASSWORD ================= */

function changePassword() {
  document.getElementById("changePasswordPopup").style.display = "flex";
}

function closeChangePassword() {
  document.getElementById("changePasswordPopup").style.display = "none";
}

function handleChangePassword(e) {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user"));
  const currentPassword =
    document.getElementById("currentPass").value;
  const newPassword =
    document.getElementById("newPass").value;

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
    .then(data => alert(data.message))
    .catch(() => alert("Failed to change password"));
}

/* ================= RESET STUDENT PASSWORD ================= */

function openResetPopup() {
  document.getElementById("resetStudentPasswordPopup").style.display = "flex";
}

function closeResetPopup() {
  document.getElementById("resetStudentPasswordPopup").style.display = "none";
}

function handleResetStudentPassword(e) {
  e.preventDefault();

  const email =
    document.getElementById("studentResetEmail").value.trim();
  const newPassword =
    document.getElementById("studentNewPassword").value.trim();

  fetch(`${API_BASE}/admin/reset-student-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("resetMsg").textContent = data.message;
      setTimeout(closeResetPopup, 1500);
    })
    .catch(() => alert("Failed to reset password"));
}

/* ================= LOGOUT ================= */

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
