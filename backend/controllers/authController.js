const db = require('../config/db');
const bcrypt = require('bcryptjs'); 

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]); 

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
// ... (rest of the login function is correct)
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user: {
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    // FIX 2: Removed .promise()
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]); 

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
    // FIX 3: Removed .promise()
    await db.execute("UPDATE users SET password = ? WHERE email = ?", [hashedNewPassword, email]); 

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ message: "Server error" });
  }
};