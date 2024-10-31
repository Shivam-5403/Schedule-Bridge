const jwt = require('jsonwebtoken');
const User = require('../Model/User')
const Admin = require('../Model/Admin');
const Env = process.env;
const bcrypt = require('bcryptjs');

// Verify user and generate JWT token
const verifyUserAndGetToken = async (username, password) => {
    try {
        const user = await User.findOne({ username });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new Error('Invalid username or password');
        }
        console.log("Token Generate for User")
        return jwt.sign({ username: user.username, email: user.email, role: 'user' }, Env.JWT_SECRET, { expiresIn: '1h' });
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

// Verify admin and generate JWT token
const verifyAdminAndGetToken = async (admin, admin_password) => {
    try {
        const Login_admin = await Admin.findOne({ admin });
        if (!Login_admin || !bcrypt.compareSync(admin_password, Login_admin.admin_password)) {
            throw new Error('Invalid ID or Password of login Admin');
        }
        return jwt.sign({ admin: admin.admin, email: admin.admin_email, role: 'admin' }, Env.JWT_SECRET, { expiresIn: '1h' });
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

// Middleware to verify user or admin based on token
const verifyUserOrAdmin = (token) => {
    try {
        if (!token) throw new Error('Token is missing');
        return jwt.verify(token, Env.JWT_SECRET);
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