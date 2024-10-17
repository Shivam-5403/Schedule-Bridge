const cron = require('node-cron');
const { transporter, generateEmailTemplate } = require('./EmailController');
const Admin = require('../Model/admin')
const Booking = require('../Model/booking');
const Contact = require('../Model/contact');

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

const logout = (req, res) => {
    const { role } = req.query; 

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out.');
        }

        if (role === 'user') {
            res.clearCookie('userId_');
        } else if (role === 'admin') {
            res.clearCookie('adminId_');
        }
        res.clearCookie('connect.sid'); 

        const redirectUrl = role === 'admin' ? '/admin' : '/';

        return res.send(`
            <script>
                localStorage.removeItem('${role === 'user' ? 'username' : 'adminUsername'}');
                localStorage.removeItem('${role === 'user' ? 'password' : 'adminPassword'}');
                
                alert('You have been logged out.');
                window.location.href = '${redirectUrl}';
            </script>
        `);
    });
};

const search_business = async (req, res) => {
    const query = req.query.query;
    try {
        const businesses = await Admin.find({
            companyname: { $regex: new RegExp(query, 'i') }  // Case-insensitive search
        });
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

            Table += `</div>`;

            res.json({ html: Table });
        } else {
            res.json({ html: "No admins found." });
        }
    } catch (err) {
        console.error("Error fetching admins: ", err);
        res.status(500).json({ error: "Internal Server Error" });
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
    const { name, email, details } = req.body;
    try {
        const contact = new Contact({
            name, email, details
        });
        await contact.save();
        res.json({ message: 'Sending Confirmed.' });
    } catch (error) {
        console.error('Error sending message.', error);
        res.status(500).json({ error: 'An error occurred while sending the msg.' });
    }
};

const combineDateAndTime = (date, time, isStart = true) => {
    const [startTime, endTime] = time.split(' - ').map(t => t.trim());
    const [hours, minutes] = (isStart ? startTime : endTime).split(':').map(Number);

    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes, 0, 0);
    return combinedDate;
};

cron.schedule('* * * * *', async () => {
    const currentTime = new Date();
    const startOfDay = new Date(currentTime);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(currentTime);
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const appointments = await Booking.find({
            status: { $in: ['Booked', 'Pending'] },
            date: { $gte: startOfDay, $lt: endOfDay }
        });

        const updates = [];

        for (const appointment of appointments) {
            const appointmentEndTime = combineDateAndTime(appointment.date, appointment.time, false);
            const appointmentStartTime = combineDateAndTime(appointment.date, appointment.time, true);

            if (currentTime > appointmentEndTime) {
                const newStatus = appointment.status === 'Booked' ? 'Done' : 'Rejected';
                updates.push({ updateOne: { filter: { _id: appointment._id }, update: { $set: { status: newStatus } } } });
            }

            const timeDiff = Math.floor((appointmentStartTime - currentTime) / (1000 * 60));
            if (timeDiff >= 40 && timeDiff <= 45) {
                const emailTemplate = generateEmailTemplate(
                    appointment.name,
                    appointment.date,
                    appointment.time,
                    "Schedule-Bridge"
                );

                const message = {
                    from: appointment.email,
                    to: appointment.admin_email,
                    subject: "Meeting Reminder",
                    html: emailTemplate,
                };

                try {
                    await transporter.sendMail(message);
                } catch (error) {
                    console.error("Error sending email:", error);
                }
            }
        }

        if (updates.length > 0) {
            await Booking.bulkWrite(updates);
        }
    } catch (err) {
        console.error('Error updating appointment statuses:', err);
    }
});

module.exports = {
    fetch_admins,
    Update,
    contactUs_req,
    book_appointment,
    search_business,
    search_appointment,
    search_appointment2,
    view_appointments,
    cancel_appointment,
    logout,
    appointment
};
