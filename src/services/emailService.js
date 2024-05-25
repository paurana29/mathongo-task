const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS 
    }
});

exports.sendEmail = async (email, subject, message) => {
    if(!subject) subject = "Default Subject"
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject,
            text: message
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
