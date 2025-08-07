 window.addEventListener("DOMContentLoaded", () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "student") {
          alert("Unauthorized access");
          window.location.href = "../index.html";
          return;
        }

        fetch(`/api/student/profile?email=${user.email}`)
          .then((res) => res.json())
          .then((data) => {
            const student = data.student;
            const marks = data.student || {};


            document.getElementById("student-name").textContent = student.name;
            document.getElementById("student-email").textContent = student.email;
            document.getElementById("student-class").textContent = student.class;
            document.getElementById("student-admnNo").textContent = student.admission_no;

            document.getElementById("firstLang").textContent = marks.first_language ?? "-";
            document.getElementById("secondLang").textContent = marks.second_language ?? "-";
            document.getElementById("thirdLang").textContent = marks.third_language ?? "-";
            document.getElementById("math").textContent = marks.maths ?? "-";
            document.getElementById("science").textContent = marks.science ?? "-";
            document.getElementById("social").textContent = marks.social ?? "-";

            const total =
              (marks.first_language || 0) +
              (marks.second_language || 0) +
              (marks.third_language || 0) +
              (marks.maths || 0) +
              (marks.science || 0) +
              (marks.social || 0);
            document.getElementById("Total").textContent = total || "Not Assigned";
          })
          .catch((err) => {
            console.error("Error fetching student data", err);
            alert("Could not load profile");
          });
      });

      function logout() {
        localStorage.removeItem("user");
        window.location.href = "./index.html";
      }

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
          headers: {
            "Content-Type": "application/json",
          },
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
              document.getElementById("changePasswordPopup").style.display = "none";
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