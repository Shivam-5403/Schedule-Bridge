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

const Info = async (req, res) => {
    try {
        const result = await Admin.find();
        console.log("Database result: ", result);

        if (result.length > 0) {
            let Table = "";

            result.forEach(r => {
                console.log("Processing user: ", r.admin);
                Table += `
                    <div style="width: 370px" class="card m-4">
                        <img style="width: 100%" src="../Pages/Images/person-1.png" alt="" class="card-img-top" />
                        <div class="card-body text-dark">
                            <h4 class="card-title">${r.admin}</h4>
                            <p class="card-text">${r.admin_email}</p>
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

            res.send({ html: Table });
        } else {
            console.log("No users found in the database.");
            res.send({ html: "No users found." });
        }
    } catch (err) {
        console.log("Error fetching users: ", err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    Home,
    About,
    Contact,
    Members,
    BookApp,
    ViewApp,
    Info
}