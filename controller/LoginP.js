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

const User_Profile = (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/user_profile.html'));
};

const fetch_admins = async (req, res) => {
    try {
        const admins = await Admin.find();

        if (admins.length > 0) {
            let Table = `<div style="display: flex; flex-wrap: wrap; justify-content: flex-start;">`;

            admins.forEach(admin => {
                const modalId = `profile-modal-${admin._id}`;
                Table += `
                <div style="width: 370px; margin: 15px;" class="card">
                    <div class="card-body text-dark">
                        <h4 class="card-title">${admin.companyname}</h4>
                        <p class="card-text">${admin.admin_email}</p>
                        <div class="d-flex flex-column g-1">
                            <a href="#" class="btn btn-primary" data-toggle="modal" data-target="#${modalId}">
                                See Profile
                            </a>
                            <a href="/BookApp" class="btn btn-success mt-3">
                                Book Appointment
                            </a>
                        </div>
                    </div>
                </div>
                <!-- Profile Modal -->
                <div class="modal fade text-dark" id="${modalId}" tabindex="-1" role="dialog">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Profile of ${admin.companyname}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <p><strong>Email:</strong> ${admin.admin_email}</p>
                                <!-- Add more admin details here if needed -->
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>`;
            });

            Table += `</div>`; // Close the flex container

            res.json({ html: Table });
        } else {
            console.log("No admins found in the database.");
            res.json({ html: "No admins found." });
        }
    } catch (err) {
        console.error("Error fetching admins: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const pending = async (req, res) => {
    try {
        const Company = await Admin.findOne({ admin: req.session.admin });
        if (!Company) {
            return res.status(404).json({ error: 'Admin not found.' });
        }
        const Appointments = await Booking.find({ companyname: Company.companyname });
        res.json(Appointments);
    } catch (error) {
        console.error('Error fetching pending appointments:', error);
        res.status(500).json({ error: 'An error occurred while fetching pending appointments.' });
    }
};

const Update = async (req, res) => {
    try {
        const { customer_name, date, status } = req.body;
        await Booking.updateOne(
            { customer_name, date },
            { $set: { status } }
        );
        res.status(200).json({ message: 'Appointment updated successfully' });
    } catch (err) {
        console.error('Error updating appointment status:', err);
        res.status(500).json({ error: 'Internal Server Error' });
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
    pending,
    Update,
    User_Profile
}