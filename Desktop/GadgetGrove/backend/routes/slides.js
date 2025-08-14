
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const getFullImageUrl = (path) => {
  if (!path) return null;

  if (path.startsWith('http')) {
    return path;
  }
  L
  return `${path}`;
};


router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM slides ORDER BY created_at DESC');

    const slidesWithFullUrls = rows.map(slide => ({
      ...slide,
      image: getFullImageUrl(slide.image)
    }));

    res.json(slidesWithFullUrls);
  } catch (err) {
    console.error('Error fetching slides:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;