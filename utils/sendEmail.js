const nodemailer = require('nodemailer');


const sendEmail = (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });
    const mailOptions = {
        from: process.env.USER,
        to,
        subject,
        text
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
