
const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/profile", async (req, res) => {
  const { email } = req.query;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const [rows] = await db.promise().query(
      `SELECT s.admission_no, s.name, s.email, s.class,
              m.first_language, m.second_language, m.third_language, 
              m.maths, m.science, m.social, m.total_marks
       FROM students s
       LEFT JOIN marks m ON s.admission_no = m.admission_no
       WHERE s.email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ student: rows[0] });
  } catch (err) {
    console.error("Error fetching student profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
