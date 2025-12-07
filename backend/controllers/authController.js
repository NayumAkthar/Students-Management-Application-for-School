const db = require('../config/db');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 


exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const [rows] = await db.execute('SELECT email, password, role FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        
   
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

     
        const token = jwt.sign(
            { email: user.email, role: user.role }, 
            process.env.JWT_SECRET || 'your_super_secret_key', 
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};


exports.changePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
    
    if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        
        const [rows] = await db.execute('SELECT password FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials or old password.' });
        }

        
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        
        await db.execute('UPDATE students SET password = ? WHERE email = ?', [hashedPassword, email]); 
        await db.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

        res.json({ message: 'Password updated successfully.' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error during password change.' });
    }
};