

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

router.get('/:userId', async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT ci.id, p.name, p.price, p.image1 as image, ci.quantity
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [req.params.userId]
    );
    const cartWithFullUrls = items.map(item => ({
      ...item,
      image: getFullImageUrl(item.image)
    }));
    res.status(200).json(cartWithFullUrls);
  } catch (err) {
    console.error('Fetch cart error:', err);
    res.status(500).json({ message: 'Server error fetching cart' });
  }
});

router.post('/', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  if (!userId || !productId) return res.status(400).json({ message: 'userId and productId are required' });
  try {
    const [existing] = await db.query(`SELECT id FROM cart_items WHERE user_id = ? AND product_id = ?`, [userId, productId]);
    if (existing.length > 0) {
      await db.query(`UPDATE cart_items SET quantity = quantity + ? WHERE id = ?`, [quantity || 1, existing[0].id]);
    } else {
      await db.query(`INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)`, [userId, productId, quantity || 1]);
    }
    res.json({ message: 'Item added to cart successfully' });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: 'Server error adding to cart' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query(`DELETE FROM cart_items WHERE id = ?`, [req.params.id]);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Delete cart item error:', err);
    res.status(500).json({ message: 'Server error deleting cart item' });
  }
});

router.delete('/clear/:userId', async (req, res) => {
  try {
    await db.query(`DELETE FROM cart_items WHERE user_id = ?`, [req.params.userId]);
    res.json({ message: 'Cart cleared successfully' });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ message: 'Server error clearing cart' });
  }
});

module.exports = router;