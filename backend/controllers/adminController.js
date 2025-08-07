const db = require('../config/db');
const bcrypt = require('bcryptjs'); 

exports.addStudent = async (req, res) => {
  const { admission_no, name, email, class: studentClass, password } = req.body;

  if (!admission_no || !name || !email || !studentClass || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.promise().execute(
      `INSERT INTO students (admission_no, name, email, class, password)
       VALUES (?, ?, ?, ?, ?)`,
      [admission_no, name, email, studentClass, hashedPassword]
    );

    await db.promise().execute(
      `INSERT INTO users (email, password, role)
       VALUES (?, ?, 'student')`,
      [email, hashedPassword]
    );

    res.json({ message: "Student added successfully" });
  } catch (error) {
    console.error("Error adding student:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Failed to add student" });
  }
};

exports.assignMarks = async (req, res) => {
  const {
    admission_no,
    first_language,
    second_language,
    third_language,
    maths,
    science,
    social,
  } = req.body;

  try {
  
    await db.promise().execute(
      `INSERT INTO marks (admission_no, first_language, second_language, third_language, maths, science, social)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [admission_no, first_language, second_language, third_language, maths, science, social]
    );

    res.status(201).json({ message: 'Marks assigned successfully' });
  } catch (err) {
    console.error('Error inserting marks:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
   
    const [rows] = await db.promise().execute(`
      SELECT s.admission_no, s.name, s.email, s.class, m.total_marks
      FROM students s
      LEFT JOIN marks m ON s.admission_no = m.admission_no
    `);

    res.json({ students: rows });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

exports.resetStudentPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.promise().execute('UPDATE students SET password = ? WHERE email = ?', [hashedPassword, email]);

    await db.promise().execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

    res.json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};