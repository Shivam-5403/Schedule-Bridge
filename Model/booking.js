const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/oabs');

const BookingSchema = new mongoose.Schema({
    customer_name: { type: String, required: true },
    companyname: { type: String, required: true },
    address: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    admin_email: { type: String, required: true },
    mno: { type: Number, required: true },
    time: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Booked', 'Rejected', 'Cancelled', 'Done'], default: 'Pending' }
});

const Booking = mongoose.model('Booking', BookingSchema);
module.exports = Booking;
