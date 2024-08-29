const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname)); 
app.use(express.static(path.join(__dirname, '../public/Pages'))); 
app.use(express.static(path.join(__dirname, '../public'))); 

const { User, Admin, Booking } = require('../Mongoose/MongoDB');

const Login = (req, res) => {
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

const search_business = async (req, res) => {
    const query = req.query.query;
    // try {
    //     const businesses = await Admin.find({ companyname: new RegExp(query, 'i') });
    //     res.json(businesses);
    // } catch (error) {
    //     console.error('Error searching business:', error);
    //     res.status(500).json({ error: 'An error occurred while searching for businesses.' });
    // }
    try {
        // Assuming you are searching in the companyname field
        const businesses = await Admin.find({
            companyname: { $regex: new RegExp(query, 'i') }  // Case-insensitive search
        });
        console.log(businesses);
        res.json(businesses);
    } catch (error) {
        console.error('Error searching business:', error);
        res.status(500).json({ error: 'An error occurred while searching for businesses.' });
    }
};

module.exports = {
    Login,
    G_signup,
    admin,
    adminG_signup,
    forgot_password,
    forgot_admin_password,
    adminG_verification,
    adminG_changepassword,
    G_verification,
    search_business
};
