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
    start_time: { type: Number, required: true},
    end_time: { type: Number, required: true},
    totalslots: { type: Number, required: true },
    website: { type: String }
});

const BookingSchema = new mongoose.Schema({
    customer_name: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    companyname: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin'},
    address: { type: String, ref: 'Admin'},
    first_name: { type: String},
    last_name: { type: String},
    email: { type: String},
    admin_email: { type: String, ref: 'Admin'},
    mno: { type: Number},
    time: { type: String},
    date: { type: Date},
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }    
});

const User = mongoose.model('User', UserSchema);
const Admin = mongoose.model('Admin', AdminSchema);
const Booking = mongoose.model('Booking', BookingSchema);

module.exports = {
    User,
    Admin,
    Booking
}