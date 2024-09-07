const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/oabs');
console.log("Connect");
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    reckey: { type: String, required: true }
});

const AdminSchema = new mongoose.Schema({
    admin: { type: String, required: true, unique: true },
    admin_password: { type: String, required: true },
    admin_reckey: { type: String, required: true },
    companyname: { type: String, required: true, unique: true },
    sector: { type: String, required: true },
    address: { type: String, required: true },
    admin_email: { type: String, required: true, unique: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    mno: { type: String, required: true, unique: true },
    total_workhours: { type: Number, required: true },
    start_time: { type: String, required: true},
    end_time: { type: String, required: true},
    totalslots: { type: Number, required: true },
    website: { type: String },
    service : { type: String, required: true}
});

const BookingSchema = new mongoose.Schema({
    customer_name: { type: String, required: true},
    companyname: { type: String, required: true},
    address: { type: String, required: true},
    first_name: { type: String, required: true},
    last_name: { type: String, required: true},
    email: { type: String, required: true},
    admin_email: { type: String, required: true},
    mno: { type: Number, required: true},
    time: { type: String, required: true},
    date: { type: Date, required: true},
    status: { type: String, enum: ['Pending', 'Booked', 'Rejected', 'Cancelled','Done'], default: 'Pending' }    
});

const User = mongoose.model('User', UserSchema);
const Admin = mongoose.model('Admin', AdminSchema);
const Booking = mongoose.model('Booking', BookingSchema);
    
module.exports = {
    User,
    Admin,
    Booking
}