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

        if (userToken) {
            console.log('Token');
            if (!userToken && !req.url.startsWith('/')) {
                return res.sendFile(path.join(__dirname, '../index.html'));
            }
            if (userToken && req.url === '/') {
                return res.sendFile(path.join(__dirname, '../Pages/User-Home.html'));
            }
            next();
        }

        if (adminToken) {
            console.log('Token');
            if (!adminToken && !req.url.startsWith('/admin')) {
                return res.sendFile(path.join(__dirname, '../Pages/admin_login.html'));
            }
            if (adminToken && req.url === '/admin') {
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
