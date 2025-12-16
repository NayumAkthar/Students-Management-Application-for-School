const express = require("express");
const db = require("../config/db");
const router = express.Router();

router.get("/profile", async (req, res) => {
  const { email } = req.query;

  const [rows] = await db.execute(`
    SELECT s.admission_no, s.name, s.class, u.email,
           m.first_language, m.second_language, m.third_language,
           m.maths, m.science, m.social, m.total_marks
    FROM users u
    JOIN students s ON u.id = s.user_id
    LEFT JOIN marks m ON s.admission_no = m.admission_no
    WHERE u.email = ?
  `, [email]);

  if (rows.length === 0)
    return res.status(404).json({ message: "Student not found" });

  res.json({ student: rows[0] });
});

module.exports = router;
