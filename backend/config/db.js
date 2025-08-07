const mysql = require('mysql2');
require('dotenv').config();

const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// This is the new part that adds SSL for the live server
if (process.env.NODE_ENV === 'production') {
  connectionConfig.ssl = { "rejectUnauthorized": true };
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