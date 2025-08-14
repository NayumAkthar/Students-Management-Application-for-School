const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();
const db = require('../config/db');


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


router.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: 'INR',
    receipt: 'order_rcptid_' + Date.now()
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    res.status(500).json({ message: 'Failed to create Razorpay order' });
  }
});


router.post('/payment-success', async (req, res) => {
  const {
    userId,
    productName,
    productImage,
    amount,
    payment_method,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature
  } = req.body;

  const conn = db;

  try {

    await conn.query('START TRANSACTION');


    const [orderResult] = await conn.query(
      `INSERT INTO orders 
       (user_id, product_name, product_image, total_amount, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, productName, productImage, amount, 'Paid']
    );

    const orderId = orderResult.insertId;


    await conn.query(
      `INSERT INTO payments 
       (order_id, user_id, payment_method, amount, status, transaction_id, razorpay_signature) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        userId,
        payment_method || 'RAZORPAY',
        amount,
        'Paid',
        razorpay_payment_id,
        razorpay_signature
      ]
    );

   
    await conn.query('COMMIT');

    res.json({ message: 'Payment and order recorded successfully' });
  } catch (err) {
    await conn.query('ROLLBACK');
    console.error('Payment Insertion Error:', err);
    res.status(500).json({ message: 'Failed to process payment' });
  }
});

module.exports = router;
