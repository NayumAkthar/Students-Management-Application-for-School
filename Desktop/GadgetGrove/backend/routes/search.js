
const express = require('express');
const router = express.Router();
const db = require('../config/db');

const getFullImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) {
    return path;
  }
  return `http://localhost:3000${path}`;
};

router.get('/api/search', async (req, res) => {
  const searchTerm = req.query.query;
  try {
    const [results] = await db.query(
      'SELECT * FROM products WHERE name LIKE ?',
      [`%${searchTerm}%`]
    );
    const searchWithFullUrls = results.map(product => ({
      ...product,
      image1: getFullImageUrl(product.image1)
    }));
    res.json(searchWithFullUrls);
  } catch (err) {
    console.error('Error fetching search products:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;