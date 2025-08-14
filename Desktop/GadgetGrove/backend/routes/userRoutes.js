const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { sendOtpEmail } = require('../config/nodemailer');

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}


router.post('/signup', async (req, res) => {
  const { name, email, mobile } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ? OR mobile = ?', [email, mobile]);
    if (existing.length > 0) {
      return res.json({ success: false, message: 'User already exists' });
    }
    const [result] = await pool.query('INSERT INTO users (name, email, mobile) VALUES (?, ?, ?)', [name, email, mobile]);
    res.json({ success: true, message: 'Signup successful', userId: result.insertId });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


router.post('/send-otp', async (req, res) => {
  const { identifier } = req.body;
  const otp = generateOtp();
  let email = identifier;

  try {
    if (/^\d{10}$/.test(identifier)) {
      const [rows] = await pool.query('SELECT email FROM users WHERE mobile = ?', [identifier]);
      if (rows.length === 0) return res.json({ success: false, message: 'Mobile not found' });
      email = rows[0].email;
    }

    await sendOtpEmail(email, otp);
    await pool.query('UPDATE users SET otp = ? WHERE email = ?', [otp, email]);

    res.json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


router.post('/verify-otp', async (req, res) => {
  const { identifier, otp } = req.body;

  try {
    let query = /^\d{10}$/.test(identifier)
      ? 'SELECT * FROM users WHERE mobile = ?'
      : 'SELECT * FROM users WHERE email = ?';

    const [rows] = await pool.query(query, [identifier]);
    if (rows.length === 0) return res.json({ success: false, message: 'User not found' });

    const user = rows[0];
    if (user.otp === otp) {
      await pool.query('UPDATE users SET otp = NULL WHERE id = ?', [user.id]);
      res.json({ success: true, message: 'OTP verified', userId: user.id });
    } else {
      res.json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.userId]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Fetch user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
