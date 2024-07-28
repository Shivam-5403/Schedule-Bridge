const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/oabs', { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
        res.send("Login Successful!");
    } else {
        res.send("Invalid credentials, please try again.");
    }
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.redirect('/');
});

app.get('/forgot-password', (req, res) => {
    res.send("Forgot Password Page");
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
