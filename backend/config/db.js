const mysql = require('mysql2');
require('dotenv').config();

const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// This is the updated part that correctly configures SSL
if (process.env.NODE_ENV === 'production') {
  connectionConfig.ssl = { rejectUnauthorized: false };
}

const db = mysql.createConnection(connectionConfig);

db.connect((err) => {
  if (err) {
    console.error('DB Connection Failed:', err);
  } else {
    console.log('MySQL Connected');
  }
});

module.exports = db;