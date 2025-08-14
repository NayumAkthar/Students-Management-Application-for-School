const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public'))); 

// Routes
const userRoutes = require('./routes/userRoutes');
const slideRoutes = require('./routes/slides');
const adminRoutes = require('./routes/admin');
const productsRoutes = require('./routes/products');
const addressRoutes = require('./routes/address');
const orderRoutes = require('./routes/orders');

const cartRoutes = require('./routes/cart');

const searchRoutes = require('./routes/search');


const adminFunctionalitiesRoutes = require('./routes/adminfunctionalities');
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);


app.use('/api/adminfunctions', adminFunctionalitiesRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/slides', slideRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/',productsRoutes);
app.use(searchRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Gadget Grove Backend API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
