
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

router.get('/api/suggestions', async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT id, name, price, image1 FROM products WHERE stock > 0 ORDER BY RAND() LIMIT 4"
    );
    const suggestionsWithFullUrls = results.map(product => ({
        ...product,
        image1: getFullImageUrl(product.image1)
    }));
    res.json(suggestionsWithFullUrls);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/api/product/:name', async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM products WHERE name = ?", [req.params.name]);
    if (results.length === 0) return res.status(404).json({ error: "Product not found" });
    
    const product = results[0];
    if (product.stock === 0) return res.json({ message: "Out of Stock" });

    const highlights = product.highlights ? product.highlights.split(/\r?\n/).map(h => h.replace(/^•\s*/, '').trim()).filter(h => h.length > 0) : [];
    
    const images = [
        getFullImageUrl(product.image1),
        getFullImageUrl(product.image2),
        getFullImageUrl(product.image3),
        getFullImageUrl(product.image4)
    ].filter(Boolean);

    res.json({
      id: product.id,
      name: product.name,
      price: `₹${product.price}`,
      images: images,
      description: product.description,
      highlights: highlights
    });
  } catch (err) {
    console.error("Error fetching product details:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/api/brands/:brand', async (req, res) => {
  try {
    const [results] = await db.query('SELECT id, name, price, image1 FROM products WHERE brand = ?', [req.params.brand]);
    const brandsWithFullUrls = results.map(product => ({
        ...product,
        image1: getFullImageUrl(product.image1)
    }));
    res.json(brandsWithFullUrls);
  } catch (err) {
    console.error('Error fetching brand products:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;