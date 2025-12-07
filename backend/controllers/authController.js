const db = require('../config/db');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); // You need this for token generation

// ------------------------------------
// 1. LOGIN FUNCTION
// ------------------------------------
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const [rows] = await db.execute('SELECT email, password, role FROM users WHERE email = ?', [email]);
        const user = rows[0];

        // 1. Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        
        // 2. Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 3. Generate Token
        const token = jwt.sign(
            { email: user.email, role: user.role }, 
            process.env.JWT_SECRET || 'your_super_secret_key', // IMPORTANT: Change 'your_super_secret_key' to a secure value in your .env file!
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

// ------------------------------------
// 2. CHANGE PASSWORD FUNCTION
// ------------------------------------
exports.changePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
    
    if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // 1. Fetch current password hash to verify old password
        const [rows] = await db.execute('SELECT password FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials or old password.' });
        }

        // 2. Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 3. Update password in both tables
        await db.execute('UPDATE students SET password = ? WHERE email = ?', [hashedPassword, email]); 
        await db.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

        res.json({ message: 'Password updated successfully.' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error during password change.' });
    }
};