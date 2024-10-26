const jwt = require('jsonwebtoken');
const User = require('../Model/User')
const Admin = require('../Model/Admin');
const { JWT_SECRET } = process.env;

// Verify user and generate JWT token
const verifyUserAndGetToken = async (username, password) => {
    try {
        const user = await User.findOne({ username });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new Error('Invalid username or password');
        }
        return jwt.sign({ username: user.username, email: user.email, role: 'user' }, JWT_SECRET, { expiresIn: '1h' });
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

// Verify admin and generate JWT token
const verifyAdminAndGetToken = async (username, admin_password) => {
    try {
        const admin = await Admin.findOne({ username });
        if (!admin || !bcrypt.compareSync(admin_password, admin.admin_password)) {
            throw new Error('Invalid admin credentials');
        }
        return jwt.sign({ admin: admin.admin, email: admin.admin_email, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

// Middleware to verify user or admin based on token
const verifyUserOrAdmin = (token) => {
    try {
        if (!token) throw new Error('Token is missing');
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

module.exports = {
    verifyUserOrAdmin,
    verifyUserAndGetToken,
    verifyAdminAndGetToken,
}