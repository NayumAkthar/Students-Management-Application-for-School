const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

router.post('/place-order', async (req, res) => {
  const { userId, productName, productImage, total, paymentMethod } = req.body;

  if (!userId || !productName || !total || !paymentMethod) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const conn = await db.getConnection(); 

  try {
    await conn.beginTransaction();

 
    const [orderResult] = await conn.query(`
      INSERT INTO orders (user_id, product_name, product_image, total_amount, status)
      VALUES (?, ?, ?, ?, 'Pending')
    `, [userId, productName, productImage, total]);

    const orderId = orderResult.insertId;

  
    await conn.query(`
      INSERT INTO payments (order_id, user_id, payment_method, amount, status, transaction_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      orderId,
      userId,
      paymentMethod.toUpperCase(), 
      total,
      paymentMethod.toUpperCase() === 'COD' ? 'Pending' : 'Paid',
      paymentMethod.toUpperCase() === 'COD' ? 'COD' : null
    ]);

    await conn.commit();

    res.json({ message: 'Order placed successfully', orderId });

  } catch (err) {
    await conn.rollback();
    console.error('Place order error:', err);
    res.status(500).json({ message: 'Server error placing order' });
  } finally {
    conn.release();
  }
});




router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const [results] = await db.query(`
      SELECT 
        o.id as order_id,
        o.product_name,
        o.product_image,
        o.total_amount,
         
        o.order_date,
        p.payment_method,
        p.status as payment_status
      FROM orders o
      JOIN payments p ON o.id = p.order_id
      WHERE o.user_id = ?
      ORDER BY o.order_date DESC
    `, [userId]);

    const processedOrders = results.map(order => {
      let finalImagePath = order.product_image;

      
      if (!finalImagePath || finalImagePath.trim() === '') {
        finalImagePath = 'http://localhost:3000/images/default.png';
      }

      return {
        ...order,
        product_image: finalImagePath
      };
    });

    res.json(processedOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
});



module.exports = router;
