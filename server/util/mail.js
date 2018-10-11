const nodemailer = require('nodemailer');

const errors = require('./../constants/error');
const strings = require('./../constants/string');

// Create transporter
const transporter = nodemailer.createTransport({
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    },
    secure: true,
    service: 'gmail'
});

module.exports.sendMail = (to, subject, html) => {

    // Configure options
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to,
        subject: subject || strings.DEFAULT_MAIL_SUBJECT,
        html
    };

    return new Promise((resolve, reject) => {

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(`Mail couldn't send to ${to}`);
                return reject(errors.EMAIL_SENT_FAILED);
            };
            
            console.log(`Mail sent successfully to ${to}`);
            resolve();

         });

    });

};


module.exports.resetPasswordTemplate = (id, code) => (
    '<div style="text-align: center;">' +
        '<h1 style="padding-bottom: 10px;">Lounge App</h1>' +
        '<a href="' + process.env.API_URL + '/api/' + process.env.CURRENT_VERSION + '/user/ui/changepassword/' + id + '/' + code + '" ' +
            'style="background-color: royalblue; padding: 10px 30px; font-size: 1.2rem; text-decoration: none; ' +
            'color: white; border-radius: 10px;">Reset Your Password' +
        '</a>' +
        '<p></p>' +
    '</div>'
);