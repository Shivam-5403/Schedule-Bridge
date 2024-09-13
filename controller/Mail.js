
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

const emailTemplate = MailGenerator.generate({
    body: {
        name: "Bhavy Prajapati",
        intro: "Your meeting reminder",
        outro: "Looking forward to your participation."
    }
});

module.exports = {
    transporter,
    emailTemplate
};