const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname)); // Serves static files from the current directory
app.use(express.static(path.join(__dirname, '../public'))); // Serves static files from the 'public' directory

const { User, Admin, Booking } = require('../Mongoose/MongoDB');

const Home = (req, res) => {
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

const BookApp = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/Book_appointment.html'));
};

const ViewApp = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/View_appointment.html'));
};

const fetch_admins = async (req, res) => {
    try {
        const admins = await Admin.find();

        if (admins.length > 0) {
            let Table = "";
            admins.forEach(admin => {
                console.log("Processing user: ", admin.admin);
                Table += `
                    <div style="width: 370px" class="card m-4">
                        <div class="card-body text-dark">
                            <h4 class="card-title">${admin.admin}</h4>
                            <p class="card-text">${admin.admin_email}</p>
                            <div class="d-flex flex-column g-1">
                                <a href="#" class="btn btn-primary" data-toggle="modal" data-target="#profile-modal">
                                    See Profile
                                </a>
                                <a href="#" class="btn btn-success mt-3" data-toggle="modal" data-target="#book-modal">
                                    Book Appointment
                                </a>
                            </div>
                        </div>
                    </div>`;
            });

            res.json({ html: Table });
        } else {
            console.log("No users found in the database.");
            res.json({ html: "No users found." });
        }
    } catch (err) {
        console.error("Error fetching users: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const pending = async (req, res) => {
    try {
        const Company = await Admin.findOne({ admin: req.session.admin });
        if (!Company) {
            return res.status(404).json({ error: 'Admin not found.' });
        }
        const pendingAppointments = await Booking.find({ status: "Pending", companyname: Company.companyname });
        res.json(pendingAppointments);
    } catch (error) {
        console.error('Error fetching pending appointments:', error);
        res.status(500).json({ error: 'An error occurred while fetching pending appointments.' });
    }
};

module.exports = {
    Home,
    About,
    Contact,
    Members,
    BookApp,
    ViewApp,
    fetch_admins,
    pending
}