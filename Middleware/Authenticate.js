const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../public/Pages')));
app.use(express.static(path.join(__dirname, '../public')));

const authorize = (req, res, next) => {
    try {
        const userToken = req.cookies?.UserId_;
        const adminToken = req.cookies?.AdminId_;

        // Check if the request is for the login pages
        const isLoginPage = req.url === '/' || req.url === '/admin';
        if (userToken) {
            if (!userToken && !req.url.startsWith('/')) {
                return res.sendFile(path.join(__dirname, '../index.html'));
            }
            if (userToken && isLoginPage) {
                return res.sendFile(path.join(__dirname, '../Pages/User-Home.html'));
            }
            next();
        }

        if (adminToken) {
            if (!adminToken && !req.url.startsWith('/admin')) {
                return res.sendFile(path.join(__dirname, '../Pages/admin_login.html'));
            }
            if (adminToken && isLoginPage) {
                return res.sendFile(path.join(__dirname, '../Pages/admin.html'));
            }
            next();
        }

    } catch (error) {
        console.error('Authorization error:', error);
        return res.redirect('/?error=Something%20went%20wrong');
    }
};

module.exports = authorize;
