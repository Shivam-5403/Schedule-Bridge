const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const { EMAIL, PASS } = require('./env');

const config = {
    service: 'gmail',
    auth: {
        user: EMAIL,
        pass: PASS
    },
};
const transporter = nodemailer.createTransport(config);

const MailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
});

const generateEmailTemplate = (recipientName, meetingDate, meetingTime, companyName) => {
    return MailGenerator.generate({
        body: {
            name: recipientName,
            intro: `Dear ${recipientName}, this is a friendly reminder regarding your upcoming meeting.`,
            action: {
                instructions: `The meeting is scheduled for ${meetingDate} at ${meetingTime}. Please ensure you are prepared.`,
                button: {
                    color: '#22BC66',
                    text: 'View Company Website',
                    link: '#'
                }
            },
            outro: `If you have any questions or need to reschedule, please contact us. We look forward to your participation.\n\nBest regards, \n${companyName}`
        }
    });
};

module.exports = {
    transporter,
    generateEmailTemplate
};
