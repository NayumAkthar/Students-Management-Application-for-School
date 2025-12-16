const db = require("../config/db");
const bcrypt = require("bcryptjs");

/* ================= ADD STUDENT ================= */
exports.addStudent = async (req, res) => {
  const { admission_no, name, email, class: studentClass, password } = req.body;

  if (!admission_no || !name || !email || !studentClass || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const [existingUsers] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    let userId;

    if (existingUsers.length > 0) {
      userId = existingUsers[0].id;
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [userResult] = await db.execute(
        "INSERT INTO users (email, password, role) VALUES (?, ?, 'student')",
        [email, hashedPassword]
      );
      userId = userResult.insertId;
    }

    // ✅ FIXED INSERT (email included)
    await db.execute(
      "INSERT INTO students (admission_no, user_id, name, email, class) VALUES (?, ?, ?, ?, ?)",
      [admission_no, userId, name, email, studentClass]
    );

    res.json({ message: "Student added successfully" });
  } catch (error) {
    console.error("Add student error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Student already exists",
      });
    }

    res.status(500).json({ message: "Failed to add student" });
  }
};

/* ================= ASSIGN MARKS ================= */
exports.assignMarks = async (req, res) => {
  let {
    admission_no,
    first_language,
    second_language,
    third_language,
    maths,
    science,
    social,
  } = req.body;

  // ✅ Validate admission number
  if (!admission_no) {
    return res.status(400).json({ message: "Admission number is required" });
  }

  // ✅ Convert to numbers (prevents undefined)
  first_language = Number(first_language) || 0;
  second_language = Number(second_language) || 0;
  third_language = Number(third_language) || 0;
  maths = Number(maths) || 0;
  science = Number(science) || 0;
  social = Number(social) || 0;

  const total_marks =
    first_language +
    second_language +
    third_language +
    maths +
    science +
    social;

  try {
    await db.execute(
      `
      INSERT INTO marks 
      (admission_no, first_language, second_language, third_language, maths, science, social, total_marks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        first_language = VALUES(first_language),
        second_language = VALUES(second_language),
        third_language = VALUES(third_language),
        maths = VALUES(maths),
        science = VALUES(science),
        social = VALUES(social),
        total_marks = VALUES(total_marks)
      `,
      [
        admission_no,
        first_language,
        second_language,
        third_language,
        maths,
        science,
        social,
        total_marks,
      ]
    );

    res.json({ message: "Marks assigned successfully" });
  } catch (error) {
    console.error("Assign marks error:", error);
    res.status(500).json({ message: "Failed to assign marks" });
  }
};

/* ================= GET ALL STUDENTS ================= */
exports.getAllStudents = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        s.admission_no,
        s.name,
        s.class,
        u.email
      FROM students s
      JOIN users u ON s.user_id = u.id
    `);

    res.json({ students: rows });
  } catch (error) {
    console.error("Fetch students error:", error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};


/* ================= RESET STUDENT PASSWORD ================= */
exports.resetStudentPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.execute("UPDATE users SET password=? WHERE email=?", [
      hashedPassword,
      email,
    ]);

    res.json({ message: "Student password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};
