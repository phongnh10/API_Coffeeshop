const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "nguyenhongphong.dev@gmail.com",
    pass: "ypkbjkcvyldmdjps",
  },
});

module.exports = { transporter };
