const express = require('express');
const path = require('path');
const app = express();
const cron = require('node-cron');
const { transporter, emailTemplate } = require('./Mail');

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
        const admins = await Admin.find().limit(9);

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
                                Business Details
                            </a>
                            <button class="btn btn-success mt-3" onclick="selectBusiness('${encodeURIComponent(JSON.stringify(admin))}')">Book Appointment
                        </div>
                    </div>
                </div>
                <!-- Profile Modal -->
                <div class="modal fade text-dark" id="${modalId}" tabindex="-1" role="dialog">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Details of ${admin.companyname}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <p><strong>Sector :</strong> ${admin.sector}</p>
                                <p><strong>Address :</strong> ${admin.address} ${admin.state} ${admin.country} ${admin.pincode}</p>
                                <p><strong>Email :</strong> ${admin.admin_email}</p>
                                <p><strong>Contact No. :</strong> ${admin.mno}</p>
                                <p><strong>Business Hours :</strong> ${admin.start_time} AM to ${admin.end_time} PM </p>
                                <p><strong>Services :</strong> ${admin.service || 'N/A'}</p>
                                <p><strong>Website :</strong> ${admin.website || 'N/A'}</p>
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


const appointment = async (req, res) => {
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

function combineDateAndStartTime(date, time) {
    const [startTime] = time.split(' - '); // Get the start time of the meeting

    if (!startTime || !startTime.includes(':')) {
        console.error("Invalid time format:", time);
        return new Date('Invalid');
    }

    const [hours, minutes] = startTime.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
        console.error("Invalid time values:", { hours, minutes });
        return new Date('Invalid');
    }

    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes, 0, 0);
    return combinedDate;
};

function combineDateAndEndTime(date, time) {
    const [, endTime] = time.split(' - ');

    if (!endTime || !endTime.includes(':')) {
        console.error("Invalid time format:", time);
        return new Date('Invalid');
    }

    const [hours, minutes] = endTime.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
        console.error("Invalid time values:", { hours, minutes });
        return new Date('Invalid');
    }

    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes, 0, 0);
    return combinedDate;
};

cron.schedule('* * * * *', async () => {
    const currentTime = new Date();

    try {
        const appointments = await Booking.find({ status: { $in: ['Booked', 'Pending'] } });
        let bookedToDoneCount = 0;
        let pendingToRejectedCount = 0;
        for (let appointment of appointments) {
            const appointmentTime = combineDateAndEndTime(appointment.date, appointment.time);
            const appointmentStartTime = combineDateAndStartTime(appointment.date, appointment.time);
            
            if (appointmentTime == 'Invalid Date' || appointmentStartTime == 'Invalid Date') {
                console.error(`Invalid appointment time for appointment ID: ${appointment._id}`);
                continue;
            }
            if (currentTime > appointmentTime) {

                if (appointment.status === 'Booked') {
                    bookedToDoneCount++;
                }

                else if (appointment.status === 'Pending') {
                    pendingToRejectedCount++;
                }

                if (bookedToDoneCount > 0) {
                    await Booking.updateOne({ _id: appointment._id }, { $set: { status: 'Done' } });
                    console.log(`Appointment ${appointment._id} marked as Done`);
                } else if (pendingToRejectedCount > 0) {
                    await Booking.updateOne({ _id: appointment._id }, { $set: { status: 'Rejected' } });
                    console.log(`Appointment ${appointment._id} marked as Rejected`);
                }
            }

            const timeDiff = Math.floor((appointmentStartTime - currentTime) / (1000 * 60));

            if (timeDiff >= 40 && timeDiff <= 50) {
                const message = {
                    from: appointment.email,
                    to: appointment.admin_email,
                    subject: "Meeting Reminder",
                    html: emailTemplate,
                };

                try {
                    const sentMessage = await transporter.sendMail(message);
                    console.log("Email sent:", sentMessage.messageId);
                } catch (error) {
                    console.error("Error sending email:", error);
                }
            }
        }
    } catch (err) {
        console.error('Error updating appointment statuses:', err);
    }
});

module.exports = {
    Home,
    About,
    Contact,
    Members,
    Admin_Home,
    Admin_About,
    Admin_Contact,
    Admin_Members,
    Admin_Profile,
    BookApp,
    ViewApp,
    fetch_admins,
    appointment,
    Update,
    User_Profile
}