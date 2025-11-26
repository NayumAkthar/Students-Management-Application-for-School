const mysql = require('mysql2/promise');
const fs = require('fs'); 
const path = require('path');
require('dotenv').config();

const CA_CERT_PATH = path.join(__dirname, '..', 'ca.pem'); 

if (!fs.existsSync(CA_CERT_PATH)) {
    console.error('ERROR: CA certificate file not found at:', CA_CERT_PATH);
    console.error('Searched path:', CA_CERT_PATH); 
    throw new Error('Missing CA certificate file required for database connection.');
}

const connectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT, 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        ca: fs.readFileSync(CA_CERT_PATH), 

        rejectUnauthorized: true 
    }
};

if (process.env.NODE_ENV !== 'production') {
    connectionConfig.ssl.rejectUnauthorized = false;
}

const pool = mysql.createPool(connectionConfig);

module.exports = pool;