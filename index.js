const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const app = express();
const path=require('path');
const { type } = require('os');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.static('public'));

app.use(session({
    secret: 'Userkey888',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

mongoose.connect('mongodb://localhost:27017/oabs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    reckey : { type: String, required: true }
});

const AdminSchema = new mongoose.Schema({
    admin: { type: String, required: true, unique: true},
    admin_password: { type: String, required: true},
    admin_reckey: { type: String, required: true},
    companyname: { type: String, required: true, unique: true},
    sector: { type: String, required: true},
    address: { type: String, required: true},
    admin_email: { type: String, required: true, unique: true},
    state: { type: String, required: true},
    country: {type: String, required: true},
    pincode: { type: String, required: true},
    mno: { type: String, required: true, unique: true},
    workhours : { type: String, required: true},
    totalslots : { type: Number, required: true},
    website: {type: String}
});

const BookingSchema = new mongoose.Schema({
    customer_name : { type: String, required: true},
    companyname : { type: String, required: true},
    address: { type: String, required: true},
    email: { type: String, required: true},
    admin_email: { type: String, required: true},
    mno: { type: Number, required: true},
    time: { type: String, required: true},
    date: { type: String, required: true}
});

const User = mongoose.model('User', UserSchema);
const Admin = mongoose.model('Admin', AdminSchema);
const Booking = mongoose.model('Booking', BookingSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && bcrypt.compareSync(password, user.password)) {
            // res.send("Login Successful!");
            res.sendFile(path.join(__dirname, 'home.html'));
        } else {
            // res.send("Invalid credentials, please try again.");
            res.redirect('/?error=Invalid%20credentials%2C%20please%20try%20again.');

        }
    }
    catch (error) {
        console.error('Error during login:', error);
        res.redirect('/?error=Something%20went%20wrong%2C%20please%20try%20again%20later.');
    }
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.post('/signup', async (req, res) => {
    const { username, email, password, reckey} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const hashedPassword2 = bcrypt.hashSync(reckey, 8);
    const newUser = new User({ username, email, password: hashedPassword, reckey: hashedPassword2});
    await newUser.save();
    res.redirect('/');
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});
 
app.post('/admin_login', async (req, res) => {
    const { admin, admin_password } = req.body;
    try{
        const ad = await Admin.findOne({ admin });
        if ( ad && bcrypt.compareSync(admin_password, ad.admin_password)){
            res.sendFile(path.join(__dirname, 'admin_home.html'));
        } else {
            res.redirect('/?error=Invalid%20credentials%2C%20please%20try%20again.');
        }
    }
    catch (error) {
        console.error('Error during admin login:', error);
        res.redirect('/?error=Something%20went%20wrong%2C%20please%20try%20again%20later.');
    }
});

app.get('/admin_signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin_signup.html'));
});

app.post('/admin_signup', async (req, res) => {
    const { admin, admin_password, admin_reckey, companyname, sector, address, admin_email, state, country, pincode, mno, workhours, totalslots, website} = req.body;
    const hashedPassword = bcrypt.hashSync(admin_password, 8);
    const hashedPassword2 = bcrypt.hashSync(admin_reckey, 8);
    const newAdmin = new Admin({ admin, admin_password: hashedPassword, admin_reckey: hashedPassword2, companyname, sector, address, admin_email, state, country, pincode, mno, workhours, totalslots, website});
    await newAdmin.save();
    res.redirect('/admin');
});

app.get('/forgot-admin-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin_verification.html'));
});

app.post('/admin_verification', async (req, res) => {
    const { admin, admin_reckey } = req.body;
    try{
        const ad = await Admin.findOne({ admin });
        if (ad && bcrypt.compareSync(admin_reckey, ad.admin_reckey)){
            req.session.adm=admin;
            res.sendFile(__dirname + '/admin_changepassword.html');
        }
         else {
            res.redirect('/admin_verification/?error=Invalid%20recovery%20key,%20please%20try%20again.');
        }
    }
    catch(error){
            console.error('Error during verification:', error);
            res.redirect('/?error=Something%20went%20wrong%2C%20please%20try%20again%20later.');
    }
});

app.post('/admin_changepassword', async (req,res) =>{
    const { newpassword, newreckey } = req.body;
    const admin = req.session.adm;

    if (!admin) {
        return res.redirect('/admin_verification/?error=Session%20expired,%20please%20try%20again.');
    }

    try {
        const hashedPassword = bcrypt.hashSync(newpassword, 8);
        const hashedReckey = bcrypt.hashSync(newreckey, 8);

        await Admin.updateOne({ admin }, { admin_password: hashedPassword, admin_reckey: hashedReckey });
        
        req.session.destroy(); // Destroy session after updating password
        res.redirect('/?message=Password%20changed%20successfully.');
    } catch (error) {
        console.error('Error during password change:', error);
        res.redirect('/admin_changepassword/?error=Something%20went%20wrong,%20please%20try%20again%20later.');
    }
});

app.get('/forgot-password', (req, res) => {
    res.sendFile(__dirname + '/verification.html');
});

app.get('/verification', (req,res) => {
    res.sendFile(path.join(__dirname, 'verification.html'));
});

app.post('/verification', async (req,res) => {
    const { username, reckey } = req.body;
    try{
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(reckey, user.reckey)){
        req.session.username=username;
        res.sendFile(__dirname + '/changepassword.html');
    } else {
        res.redirect('/verification/?error=Invalid%20recovery%20key,%20please%20try%20again.');
    }
    }
    catch(error){
        console.error('Error during verification:', error);
        res.redirect('/?error=Something%20went%20wrong%2C%20please%20try%20again%20later.');
    }
});

app.post('/changepassword', async (req,res) =>{
    const { newpassword, newreckey } = req.body;
    const username = req.session.username;

    if (!username) {
        return res.redirect('/verification/?error=Session%20expired,%20please%20try%20again.');
    }

    try {
        const hashedPassword = bcrypt.hashSync(newpassword, 8);
        const hashedReckey = bcrypt.hashSync(newreckey, 8);

        await User.updateOne({ username }, { password: hashedPassword, reckey: hashedReckey });
        
        req.session.destroy(); // Destroy session after updating password
        res.redirect('/?message=Password%20changed%20successfully.');
    } catch (error) {
        console.error('Error during password change:', error);
        res.redirect('/changepassword/?error=Something%20went%20wrong,%20please%20try%20again%20later.');
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
