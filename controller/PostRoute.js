const bcrypt = require('bcryptjs');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname)); // Serves static files from the current directory
app.use(express.static(path.join(__dirname, '../public'))); // Serves static files from the 'public' directory

const { User, Admin, Booking, Contact } = require('../Mongoose/MongoDB');

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.name = username;
            res.cookie('userId', username, { httpOnly: true, sameSite: 'strict' });
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
            req.session.admin = admin;  // Replace 'adminUsername' with the actual variable containing the admin's username.
            res.cookie('adminId', admin, { httpOnly: true, sameSite: 'strict' });
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

const P_verification = async (req, res) => {
    const { username, reckey } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && bcrypt.compareSync(reckey, user.reckey)) {
            req.session.username = username;
            res.sendFile(path.join(__dirname, '../Pages/changepassword.html'));
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

const book_appointment = async (req, res) => {
    const { companyname, address, first_name, last_name, email, admin_email, mno, time, date, status } = req.body;
    const userId = req.session.name;
    try {
        const booking = new Booking({
            customer_name: userId,
            companyname,
            address,
            first_name,
            last_name,
            email,
            admin_email,
            mno,
            time,
            date,
            status
        });

        await booking.save();
        res.json({ message: 'Appointment Request booked successfully! See The Status of Appointment in View Booked Appointment Section. You wil Be Notified After...' });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ error: 'An error occurred while booking the appointment.' });
    }
};

const contactUs_req = async (req, res) => {
    const { name, email, details} = req.body;
    try{
        const contact = new Contact({
            name,email,details
        });
        await contact.save();
        res.json({ message: 'Sending Confirmed.'});
    } catch (error) {
        console.error('Error sending message.',error);
        res.status(500).json({ error: 'An error occurred while sending the msg.' });
    }
};

const change_pass = async (req, res) => {
    const { username, password} = req.body;
    try{
        const hashedPassword = bcrypt.hashSync(password, 8);

        await User.updateOne({ username }, { password: hashedPassword});

        res.json({ message: 'Password Changed.' });
    } catch (error) {
        console.error('Error Changing Password:', error);
        res.status(500).json({ error: 'An error occurred while Changing Password.' });
    }
};

const change_pass_admin = async (req, res) => {
    const { admin, admin_password} = req.body;
    try{
        const hashedPassword_admin = bcrypt.hashSync(admin_password, 8);

        await Admin.updateOne({ admin }, { admin_password: hashedPassword_admin});

        res.json({ message: 'Password Changed.' });
    } catch (error) {
        console.error('Error Changing Password:', error);
        res.status(500).json({ error: 'An error occurred while Changing Password.' });
    }
};

const change_prof = async (req, res) => {
    const { oldId, username, email} = req.body;
    try{
        await User.updateOne({ oldId }, {username: username, email: email});

        res.json({ message: 'Profile Changed.' });
    } catch (error) {
        console.error('Error Changing Profile:', error);
        res.status(500).json({ error: 'An error occurred while Changing Profile.' });
    }
};

const change_admin_prof = async (req, res) => {
    const { oldAdminId, admin, admin_email, companyname, sector, address, state, country, pincode, mno, total_workhours, start_time, end_time, totalslots, website, service} = req.body;
    try{
        await Admin.updateOne({ oldAdminId }, {admin, admin_email, companyname, sector, address, state, country, pincode, mno, total_workhours, start_time, end_time, totalslots, website, service});

        res.json({ message : 'Profile Changed.'});
    } catch (error) {
        console.error('Error Changing Profile:', error);
        res.status(500).json({ error: 'An error occurred while Changing Profile.' });
    }
}

module.exports = {
    login,
    admin_login,
    P_signup,
    adminP_signup,
    adminP_verification,
    adminP_changepassword,
    P_verification,
    P_changepassword,
    book_appointment,
    change_pass,
    change_pass_admin,
    change_prof,
    contactUs_req,
    change_admin_prof
}