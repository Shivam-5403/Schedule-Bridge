const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/oabs', { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    reckey : { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try{
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
        // res.send("Login Successful!");
        res.sendFile(__dirname + '/home.html');
    } else {
        // res.send("Invalid credentials, please try again.");
        res.redirect('/?error=Invalid%20credentials%2C%20please%20try%20again.');

    }
    }
    catch(error){
        console.error('Error during login:', error);
        res.redirect('/?error=Something%20went%20wrong%2C%20please%20try%20again%20later.');
    }
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/signup', async (req, res) => {
    const { username, password, reckey} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({ username, password: hashedPassword, reckey});
    await newUser.save();
    res.redirect('/');
});

app.get('/forgot-password', (req, res) => {
    res.sendFile(__dirname + '/verification.html');
});

app.post('/verification', async (req,res) => {
    const { username, reckey } = req.body;
    try{
    const user = await User.findOne({ username });
    if (user && user.reckey == reckey){
        // res.send("Login Successful!");
        res.sendFile(__dirname + '/changepassword.html');
    } else {
        // res.send("Invalid credentials, please try again.");
        res.redirect('/verification?error=Invalid%20recovery%20key,%20please%20try%20again.');
    }
    }
    catch(error){
        console.error('Error during login:', error);
        res.redirect('/?error=Something%20went%20wrong%2C%20please%20try%20again%20later.');
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
