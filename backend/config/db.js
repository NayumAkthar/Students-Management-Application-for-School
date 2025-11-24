const mysql = require('mysql2/promise');
const fs = require('fs'); 
const path = require('path'); // Node.js path module
require('dotenv').config();

// Pathing logic: __dirname is 'backend/config'. 
// '..' goes up to 'backend', the second '..' goes up to the 'root'
// The filename is added directly at the end.
const CA_CERT_PATH = path.join(__dirname, '..', 'ca.pem'); // <-- THIS IS THE CORRECT PATH

if (!fs.existsSync(CA_CERT_PATH)) {
    console.error('ERROR: CA certificate file not found at:', CA_CERT_PATH);
    // Showing the absolute path that was searched for is helpful for debugging!
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
        // Read the file from the calculated absolute path
        ca: fs.readFileSync(CA_CERT_PATH), 
        // Enforce server verification
        rejectUnauthorized: true 
    }
};

const pool = mysql.createPool(connectionConfig);

module.exports = pool;