const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname)); 
app.use(express.static(path.join(__dirname, '../public/Pages'))); 
app.use(express.static(path.join(__dirname, '../public'))); 

const Home = (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html')); 
};

const G_signup = (req, res) => {
    res.sendFile(path.join(__dirname, '../signup.html')); 
};

const admin = (req, res) => {
    res.sendFile(path.join(__dirname, '../admin_login.html')); 
};

const adminG_signup = (req, res) => {
    res.sendFile(path.join(__dirname, '../admin_signup.html')); 
};

const forgot_password = (req, res) => {
    res.sendFile(path.join(__dirname, '../verification.html')); 
};

const forgot_admin_password = (req, res) => {
    res.sendFile(path.join(__dirname, '../admin_verification.html')); 
};

const adminG_verification = (req, res) => {
    res.sendFile(path.join(__dirname, '../admin_verification.html')); 
};

const adminG_changepassword = (req, res) => {
    res.sendFile(path.join(__dirname, '../admin_changepassword.html')); 
};

const G_verification = (req, res) => {
    res.sendFile(path.join(__dirname, '../verification.html')); 
};

module.exports = {
    Home,
    G_signup,
    admin,
    adminG_signup,
    forgot_password,
    forgot_admin_password,
    adminG_verification,
    adminG_changepassword,
    G_verification
};
