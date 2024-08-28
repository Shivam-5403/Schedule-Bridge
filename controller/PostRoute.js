const bcrypt = require('bcryptjs');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname)); // Serves static files from the current directory
app.use(express.static(path.join(__dirname, '../public'))); // Serves static files from the 'public' directory

const { User, Admin, Booking } = require('../Mongoose/MongoDB');

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.name = username;
            res.sendFile(path.join(__dirname, '../Pages/User-Home.html'));
        } else {
            res.redirect('/?error=Invalid%20credentials%2C%20please%20try%20again.');
        }
    }
    catch (error) {
        console.error('Error during login:', error);
        res.redirect('/?error=Something%20went%20wrong%2C%20please%20try%20again%20later.');
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out, please try again.');
        }
        res.redirect('/'); // Redirect to login page after logout
    });
};

const P_signup = async (req, res) => {
    const { username, email, password, reckey } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const hashedPassword2 = bcrypt.hashSync(reckey, 8);
    const newUser = new User({ username, email, password: hashedPassword, reckey: hashedPassword2 });
    await newUser.save();
    res.redirect('/');
};

const admin_login = async (req, res) => {
    const { admin, admin_password } = req.body;
    try {
        const ad = await Admin.findOne({ admin });
        if (ad && bcrypt.compareSync(admin_password, ad.admin_password)) {
            res.sendFile(path.join(__dirname, '../Pages/admin.html'));
        } else {
            res.redirect('./admin/?error=Invalid%20credentials%2C%20please%20try%20again.');
        }
    }
    catch (error) {
        console.error('Error during admin login:', error);
        res.redirect('/?error=Something%20went%20wrong%2C%20please%20try%20again%20later.');
    }
};

const adminP_signup = async (req, res) => {
    const { admin, admin_password, admin_reckey, companyname, sector, address, admin_email, state, country, pincode, mno, workhours, s_workhours, e_workhours, totalslots, website } = req.body;
    const hashedPassword = bcrypt.hashSync(admin_password, 8);
    const hashedPassword2 = bcrypt.hashSync(admin_reckey, 8);
    const newAdmin = new Admin({ admin, admin_password: hashedPassword, admin_reckey: hashedPassword2, companyname, sector, address, admin_email, state, country, pincode, mno, workhours, s_workhours, e_workhours, totalslots, website });
    await newAdmin.save();
    res.redirect('/admin');
}

const adminP_changepassword = async (req, res) => {
    const { newpassword, newreckey } = req.body;
    const admin = req.session.adm;

    if (!admin) {
        return res.redirect('../admin_verification/?error=Session%20expired,%20please%20try%20again.');
    }

    try {
        const hashedPassword = bcrypt.hashSync(newpassword, 8);
        const hashedReckey = bcrypt.hashSync(newreckey, 8);

        await Admin.updateOne({ admin }, { admin_password: hashedPassword, admin_reckey: hashedReckey });

        req.session.destroy(); // Destroy session after updating password
        res.redirect('/admin/?message=Password%20changed%20successfully.');
    } catch (error) {
        console.error('Error during password change:', error);
        res.redirect('/admin_changepassword/?error=Something%20went%20wrong,%20please%20try%20again%20later.');
    }
}

const adminP_verification = async (req, res) => {
    const { admin, admin_reckey } = req.body;
    try {
        const ad = await Admin.findOne({ admin });
        if (ad && bcrypt.compareSync(admin_reckey, ad.admin_reckey)) {
            req.session.adm = admin;
            res.sendFile(path.join(__dirname, '../admin_changepassword.html'));
        }
        else {
            res.redirect('/admin_verification/?error=Invalid%20recovery%20key,%20please%20try%20again.');
        }
    }
    catch (error) {
        console.error('Error during verification:', error);
        res.redirect('/?error=Something%20went%20wrong%2C%20please%20try%20again%20later.');
    }
}

const P_verification = async (req, res) => {
    const { username, reckey } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && bcrypt.compareSync(reckey, user.reckey)) {
            req.session.username = username;
            res.sendFile(path.join(__dirname, '../changepassword.html'));
        } else {
            res.redirect('/verification/?error=Invalid%20recovery%20key,%20please%20try%20again.');
        }
    }
    catch (error) {
        console.error('Error during verification:', error);
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
        const hashedPassword = bcrypt.hashSync(newpassword, 8);
        const hashedReckey = bcrypt.hashSync(newreckey, 8);

        await User.updateOne({ username }, { password: hashedPassword, reckey: hashedReckey });

        req.session.destroy(); // Destroy session after updating password
        res.redirect('/?message=Password%20changed%20successfully.');
    } catch (error) {
        console.error('Error during password change:', error);
        res.redirect('/changepassword/?error=Something%20went%20wrong,%20please%20try%20again%20later.');
    }
}

module.exports = {
    login,
    logout,
    admin_login,
    P_signup,
    adminP_signup,
    adminP_verification,
    adminP_changepassword,
    P_verification,
    P_changepassword
}