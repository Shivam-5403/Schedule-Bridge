const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname)); // Serves static files from the current directory
app.use(express.static(path.join(__dirname, '../public'))); // Serves static files from the 'public' directory

const { User, Admin, Booking } = require('../Mongoose/MongoDB');

const Login = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/User-Home.html'));
};

const About = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/About-Us.html'));
};

const Contact = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/Contact-Us.html'));
};

const Members = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/Team-members.html'));
};

module.exports = {
    Login,
    About,
    Contact,
    Members
}