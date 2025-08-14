const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.post('/', async (req, res) => {
  const { userId, name, pincode, locality, address, city, state } = req.body;

  if (!userId || !name || !pincode || !locality || !address || !city || !state) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO addresses (user_id, name, pincode, locality, address, city, state)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, pincode, locality, address, city, state]
    );

    res.status(200).json({ message: 'Address saved successfully', addressId: result.insertId });
  } catch (err) {
    console.error('Address insert error:', err);
    res.status(500).json({ message: 'Server error saving address' });
  }
});


router.get('/:userId', async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT * FROM addresses WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
      [req.params.userId]
    );

    res.status(200).json(results);
  } catch (err) {
    console.error('Fetch address error:', err);
    res.status(500).json({ message: 'Server error fetching address' });
  }
});

module.exports = router;
