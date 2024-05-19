const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS 
    }
});

exports.sendEmail = async (email, message) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Mathongo Task!',
            text: message
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
