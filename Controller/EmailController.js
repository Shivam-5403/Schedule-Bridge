const nodemailer = require('nodemailer');
const Env = process.env;

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: Env.EMAIL, 
        pass: Env.PASS
    }
});

const generateEmailTemplate = (name, date, time, company) => {
    return `
        <h1>Appointment Reminder</h1>
        <p>Dear ${name},</p>
        <p>This is a reminder for your appointment scheduled on <strong>${date}</strong> at <strong>${time}</strong>.</p>
        <p>Thank you for choosing ${company}!</p>
        <p>Best regards,<br>${company}</p>
    `;
};

module.exports = {
    transporter,
    generateEmailTemplate
};
