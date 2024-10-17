const express = require('express');
const path = require('path');
const app = express();
const bcrypt = require('bcryptjs');

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../public/Pages')));
app.use(express.static(path.join(__dirname, '../public')));
const Admin = require('../Model/admin');

const admin = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/admin_login.html'));
};

const adminG_signup = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/admin_signup.html'));
};

const forgot_admin_password = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/admin_verification.html'));
};

const adminG_verification = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/admin_verification.html'));
};

const adminG_changepassword = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/admin_changepassword.html'));
};

const Admin_Home = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/admin.html'));
};

const Admin_About = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/Admin-About-Us.html'));
};

const Admin_Contact = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/Admin-Contact-Us.html'));
};

const Admin_Members = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/Admin-Team-members.html'));
};

const Admin_Profile = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/Admin_profile.html'));
};

const view_admin_profile = async (req, res) => {
    const adminId = req.session.admin;
    try {
        const profile = await Admin.findOne({
            admin: { $regex: new RegExp(adminId, 'i') }
        });
        res.json(profile);
    } catch (error) {
        console.error('Error searching admin:', error);
        res.status(500).json({ error: 'An error occurred while searching for admin.' });
    }
};

const admin_login = async (req, res) => {
    const { admin, admin_password } = req.body;
    try {
        const ad = await Admin.findOne({ admin })
        if (ad && bcrypt.compareSync(admin_password, ad.admin_password)) {
            const now = Date.now();

            req.session.admin = admin;
            req.session.loginTime = now;
            req.session.lastActive = now;

            res.cookie('adminId_', admin, { httpOnly: true, sameSite: 'strict' });
            res.sendFile(path.join(__dirname, '../Pages/admin.html'));
        } else {
            res.redirect('./admin/?error=Invalid%20credentials%2C%20please%20try%20again.');
        }
    } catch (error) {
        console.error('Error during admin login:', error);
        res.redirect('/?error=Something%20went%20wrong%2C%20please%20try%20again%20later.');
    }
};

const adminP_signup = async (req, res) => {
    const { admin, admin_password, admin_reckey, companyname, sector, address, admin_email, state, country, pincode, mno, total_workhours, start_time, end_time, totalslots, website, service } = req.body;
    const hashedPassword = bcrypt.hashSync(admin_password, 8);
    const hashedPassword2 = bcrypt.hashSync(admin_reckey, 8);
    const newAdmin = new Admin({ admin, admin_password: hashedPassword, admin_reckey: hashedPassword2, companyname, sector, address, admin_email, state, country, pincode, mno, total_workhours, start_time, end_time, totalslots, website, service });
    await newAdmin.save();
    res.redirect('/admin');
}

const adminP_changepassword = async (req, res) => {
    const { newpassword, newreckey } = req.body;
    const admin = req.session.admin;

    if (!admin) {
        return res.redirect('../Pages/admin_verification/?error=Session%20expired,%20please%20try%20again.');
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
            req.session.admin = admin;
            res.sendFile(path.join(__dirname, '../Pages/admin_changepassword.html'));
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
const change_pass_admin = async (req, res) => {
    const { admin, admin_password } = req.body;
    try {
        const hashedPassword_admin = bcrypt.hashSync(admin_password, 8);

        await Admin.updateOne({ admin }, { admin_password: hashedPassword_admin });

        res.json({ message: 'Password Changed.' });
    } catch (error) {
        console.error('Error Changing Password:', error);
        res.status(500).json({ error: 'An error occurred while Changing Password.' });
    }
};

const change_admin_prof = async (req, res) => {
    const { oldAdminId, admin, admin_email, companyname, sector, address, state, country, pincode, mno, total_workhours, start_time, end_time, totalslots, website, service } = req.body;
    try {
        await Admin.updateOne({ oldAdminId }, { admin, admin_email, companyname, sector, address, state, country, pincode, mno, total_workhours, start_time, end_time, totalslots, website, service });

        res.json({ message: 'Profile Changed.' });
    } catch (error) {
        console.error('Error Changing Profile:', error);
        res.status(500).json({ error: 'An error occurred while Changing Profile.' });
    }
}

module.exports = {
    admin,
    adminG_signup,
    forgot_admin_password,
    adminG_changepassword,
    adminG_verification,
    view_admin_profile,
    Admin_About,
    Admin_Contact,
    Admin_Home,
    Admin_Members,
    Admin_Profile,
    admin_login,
    adminP_changepassword,
    adminP_signup,
    adminP_verification,
    change_admin_prof,
    change_pass_admin
};