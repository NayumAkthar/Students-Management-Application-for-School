const bcrypt = require('bcrypt');
const db = require('./config/db');

const createAdmin = async () => {
  const hash = await bcrypt.hash('Admin@123', 10);
  db.query(
    'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
    ['admin@school.com', hash, 'admin'],
    (err) => {
      if (err) console.error(err);
      else console.log('Admin created');
      process.exit();
    }
  );
};

createAdmin();
