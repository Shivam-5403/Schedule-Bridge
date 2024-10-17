const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/oabs');

const ContactUsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    details: { type: String, required: true }
});

const Contact = mongoose.model('ContactUs', ContactUsSchema);
module.exports = Contact;
