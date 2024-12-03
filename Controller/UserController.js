const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const bcrypt = require('bcryptjs');

app.use(cookieParser());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../public/Pages')));
app.use(express.static(path.join(__dirname, '../public')));

const User = require('../Model/User');
const hashPassword = (password) => bcrypt.hashSync(password, 8);

const Login = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/index.html'));
};

const Home = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/User-Home.html'));
};

const G_signup = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/signup.html'));
};

const forgot_password = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/verification.html'));
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

const User_Profile = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/user_profile.html'));
};

const G_verification = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/verification.html'));
};

const BookApp = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/Book_appointment.html'));
};

const ViewApp = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/View_appointment.html'));
};

const view_profile = async (req, res) => {
    const userId = req.session.username;
    try {
        const profile = await User.find({
            username: userId
        });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while searching for user.' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.username = user.username;
            
            res.cookie('UserId_', user, {
                httpOnly: true,
                sameSite: 'strict',
            });
            return res.sendFile(path.join(__dirname, '../Pages/User-Home.html'));
        }else{
            return res.redirect('/?error=Invalid%20Username%20or%2C%20password%20,plaese%20try%20again.');
        }

    } catch (error) {
        return res.redirect('/?error=Something%20went%20wrong%2C%20please%20try%20again.');
    }
};

const P_signup = async (req, res) => {
    const { username, email, password, reckey } = req.body;
    const hashedPassword = hashPassword(password);
    const hashedPassword2 = hashPassword(reckey);
    const newUser = new User({ username, email, password: hashedPassword, reckey: hashedPassword2 });
    await newUser.save();
    res.redirect('/');
};

const P_verification = async (req, res) => {
    const { username, reckey } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && bcrypt.compareSync(reckey, user.reckey)) {
            req.session.username = username;
            res.sendFile(path.join(__dirname, '../Pages/changepassword.html'));
        } else {
            return res.redirect('/?error=Invalid%20Username%20or%2C%Recovery-Key%20,plaese%20try%20again.');
        }
    }
    catch (error) {
        res.redirect('/?error=Something%20went%20wrong%2C%20please%20try%20again%20later.');
    }
}

const P_changepassword = async (req, res) => {
    const { newpassword, newreckey } = req.body;
    const username = req.session.username;

    if (!username) {
        return res.redirect('/verification/?error=Session%20expired,%20please%20try%20again.');
    }

    try {
        const hashedPassword = hashPassword(newpassword);
        const hashedReckey = hashPassword(newreckey);

        await User.updateOne({ username }, { password: hashedPassword, reckey: hashedReckey });

        req.session.destroy();
        return res.redirect('/?message=Password%20changed%20successfully.');
    } catch (error) {
        return res.redirect('/changepassword/?error=Something%20went%20wrong,%20please%20try%20again.');
    }
};


const change_pass = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, 8);
        await User.updateOne({ username }, { password: hashedPassword });
        res.json({ message: 'Password Changed.' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while Changing Password.' });
    }
};

const change_prof = async (req, res) => {
    const { ousername, username, email } = req.body;

    try {
        await User.updateOne({username: ousername},{username: username, email: email});

        res.json({ message: 'Profile Changed.' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while changing profile.' });
    }
};

module.exports = {
    Home,
    About,
    Contact,
    Members,
    User_Profile,
    Login,
    G_signup,
    forgot_password,
    G_verification,
    view_profile,
    BookApp,
    ViewApp,
    login,
    P_signup,
    P_changepassword,
    P_verification,
    change_pass,
    change_prof
};
