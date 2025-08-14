

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const bcrypt = require('bcryptjs');


const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => {

      const brand = req.body.brand || 'common';
      return `gadgetgrove/products/${brand}`;
    },
    allowed_formats: ['jpg', 'png', 'jpeg'],
    public_id: (req, file) => {
      return file.fieldname + '-' + Date.now();
    },
  },
});

const slideStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gadgetgrove/slides',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    public_id: (req, file) => 'slide-' + Date.now(),
  }
});

const uploadProduct = multer({ storage: productStorage });
const uploadSlide = multer({ storage: slideStorage });

router.post('/add-mobile', uploadProduct.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
]), async (req, res) => {
  try {
    const { name, brand, price, stock, description, highlights } = req.body;
    const image1 = req.files['image1'] ? req.files['image1'][0].path : null;
    const image2 = req.files['image2'] ? req.files['image2'][0].path : null;
    const image3 = req.files['image3'] ? req.files['image3'][0].path : null;
    const image4 = req.files['image4'] ? req.files['image4'][0].path : null;
    await db.query(`
      INSERT INTO products 
      (name, brand, price, stock, description, highlights, image1, image2, image3, image4)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, brand, price, stock, description, highlights, image1, image2, image3, image4]
    );

    res.status(201).json({ message: 'Mobile added successfully' });
  } catch (err) {
    console.error('Add Mobile Error:', err);
    res.status(500).json({ error: 'Server error adding mobile' });
  }
});
router.post('/add-slide', uploadSlide.single('slide-image'), async (req, res) => {
  try {
    const image = req.file.path;
    await db.query(`INSERT INTO slides (image) VALUES (?)`, [image]);
    res.json({ message: 'Slide added successfully' });
  } catch (err) {
    console.error("Add slide error:", err);
    return res.status(500).json({ error: err });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        o.id AS order_id, o.product_name, o.product_image, o.total_amount, o.order_date,
        o.status AS order_status, p.payment_method, p.razorpay_signature AS razorpay_signature,
        p.status AS payment_status
      FROM orders o LEFT JOIN payments p ON o.id = p.order_id
      ORDER BY o.order_date DESC
    `);
    res.json(results);
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
});

router.get('/order/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.query(`
      SELECT 
        o.id as order_id, o.product_name, o.product_image, o.total_amount, o.status as order_status,
        o.order_date, o.user_id, u.name as customer_name, u.email as customer_email,
        CONCAT(IFNULL(a.address, ''), ', ', IFNULL(a.locality, ''), ', ', IFNULL(a.city, ''), ', ', IFNULL(a.state, ''), ' - ', IFNULL(a.pincode, '')) as customer_address,
        p.payment_method, p.status as payment_status
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN payments p ON o.id = p.order_id
      LEFT JOIN addresses a ON a.user_id = u.id
      WHERE o.id = ? ORDER BY a.created_at DESC LIMIT 1
    `, [id]);
    if (results.length === 0) return res.status(404).json({ message: 'Order not found' });
    res.json(results[0]);
  } catch (err) {
    console.error('Fetch order error:', err);
    res.status(500).json({ error: 'Server error fetching order' });
  }
});

router.get('/search-mobile/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const [results] = await db.query(`SELECT * FROM products WHERE name = ?`, [name]);
    if (results.length === 0) return res.status(404).json({ message: 'Mobile not found' });
    res.json(results[0]);
  } catch (err) {
    console.error('Search Mobile Error:', err);
    res.status(500).json({ error: 'Server error searching mobile' });
  }
});

router.put('/update-mobile', async (req, res) => {
  const { id, price, stock } = req.body;
  try {
    await db.query(`UPDATE products SET price = ?, stock = ? WHERE id = ?`, [price, stock, id]);
    res.json({ message: 'Mobile updated successfully' });
  } catch (err) {
    console.error("Update mobile error:", err);
    return res.status(500).json({ error: err });
  }
});

router.get('/slides', async (req, res) => {
  try {
    const [results] = await db.query(`SELECT * FROM slides`);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.put('/update-slide/:id', uploadSlide.single('slide-image'), async (req, res) => {
  const { id } = req.params;
  const image = req.file.path;
  try {
    await db.query(`UPDATE slides SET image = ? WHERE id = ?`, [image, id]);
    res.json({ message: 'Slide updated successfully' });
  } catch (err) {
    console.error("Update slide error:", err);
    return res.status(500).json({ error: err });
  }
});

router.delete('/delete-slide/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM slides WHERE id = ?`, [id]);
    res.json({ message: 'Slide deleted successfully' });
  } catch (err) {
    console.error("Delete slide error:", err);
    return res.status(500).json({ error: err });
  }
});

router.post('/change-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const [results] = await db.query(`SELECT * FROM admin WHERE id = 1`);
    if (results.length === 0) return res.status(404).json({ message: 'Admin not found' });
    const admin = results[0];
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password incorrect' });
    const hash = await bcrypt.hash(newPassword, 10);
    await db.query(`UPDATE admin SET password = ? WHERE id = 1`, [hash]);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: 'Server error changing password' });
  }
});

module.exports = router;