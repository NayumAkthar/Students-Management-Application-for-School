const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db'); 
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);

  try {
    const [rows] = await db.query('SELECT * FROM admin WHERE email = ?', [email]);

    if (rows.length === 0) {
      console.log('No admin found for email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password);
    console.log('Password match:', match);

    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
