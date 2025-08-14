const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


async function sendOtpEmail(to, otp) {
  const mailOptions = {
    from: `"Gadget Grove" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Your OTP for Gadget Grove Login',
    text: `Your OTP is: ${otp}`,
    html: `<h3>Your OTP is: <b>${otp}</b></h3>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

module.exports = { sendOtpEmail };
