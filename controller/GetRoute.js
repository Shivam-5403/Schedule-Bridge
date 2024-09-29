const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../public/Pages')));
app.use(express.static(path.join(__dirname, '../public')));

const { User, Admin, Booking } = require('../Mongoose/MongoDB');

const Login = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/index.html'));
};

const G_signup = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/signup.html'));
};

const admin = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/admin_login.html'));
};

const adminG_signup = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/admin_signup.html'));
};

const forgot_password = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/verification.html'));
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

const G_verification = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/verification.html'));
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out, please try again.');
        }
        res.clearCookie('session.name', { path: '/' });
        res.redirect('/');
    });
};

const search_business = async (req, res) => {
    const query = req.query.query;
    try {
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

const search_appointment = async (req, res) => {
    const uf_name = req.query.first_name;
    const ul_name = req.query.last_name;
    const userId = req.session.name;
    try {
        const appointments = await Booking.find({
            customer_name: { $regex: new RegExp(userId, 'i') },  // Case-insensitive search
            first_name: { $regex: new RegExp(uf_name, 'i') },  // Case-insensitive search
            last_name: { $regex: new RegExp(ul_name, 'i') }, // Case-insensitive search
            status: "Pending"
        });
        console.log(userId);
        console.log(appointments);
        res.json(appointments);
    } catch (error) {
        console.error('Error searching appointment:', error);
        res.status(500).json({ error: 'An error occurred while searching for appointment.' });
    }
};

const search_appointment2 = async (req, res) => {
    const uf_name = req.query.first_name;
    const ul_name = req.query.last_name;
    const userId = req.session.name;
    try {
        const appointments = await Booking.find({
            customer_name: { $regex: new RegExp(userId, 'i') },  // Case-insensitive search
            first_name: { $regex: new RegExp(uf_name, 'i') },  // Case-insensitive search
            last_name: { $regex: new RegExp(ul_name, 'i') }, // Case-insensitive search
            status: "Booked"
        });
        console.log(userId);
        console.log(appointments);
        res.json(appointments);
    } catch (error) {
        console.error('Error searching appointment:', error);
        res.status(500).json({ error: 'An error occurred while searching for appointment.' });
    }
};

const view_appointments = async (req, res) => {
    const userId = req.session.name;
    try {
        if (!userId) {
            return res.status(401).json({ error: 'User not logged in.' });
        }

        const pendingAppointments = await Booking.find({
            customer_name: { $regex: new RegExp(userId, 'i') },
            status: "Pending"
        });

        const scheduledAppointments = await Booking.find({
            customer_name: { $regex: new RegExp(userId, 'i') },
            status: "Booked"
        });

        const doneAppointments = await Booking.find({
            customer_name: userId,
            status: "Done"
        });

        res.json({
            pendingAppointments,
            scheduledAppointments,
            doneAppointments
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'An error occurred while fetching appointments.' });
    }
};

const cancel_appointment = async (req, res) => {
    const appointmentId = req.params.id.trim();
    console.log('Appointment ID:', appointmentId);
    try {
        const updatedAppointment = await Booking.findByIdAndUpdate(
            appointmentId,
            { status: "Cancelled" }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }

        res.json({ message: 'Appointment cancelled successfully.', appointment: updatedAppointment });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({ error: 'An error occurred while cancelling the appointment.' });
    }
};

const view_profile = async (req, res) => {
    const userId = req.session.name;
    try {
        const profile = await User.find({
            username: { $regex: new RegExp(userId, 'i') }
        });
        res.json(profile);
    } catch (error) {
        console.error('Error searching user:', error);
        res.status(500).json({ error: 'An error occurred while searching for user.' });
    }
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
    search_business,
    search_appointment,
    search_appointment2,
    view_appointments,
    cancel_appointment,
    logout,
    view_profile,
    view_admin_profile
};
