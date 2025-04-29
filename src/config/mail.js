// Configuration for nodemailer
require("dotenv").config();

const mailConfig = {
	host: process.env.MAIL_HOST || "smtp.gmail.com",
	port: process.env.MAIL_PORT || 587,
	secure: process.env.MAIL_SECURE === "true" || false,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
};

module.exports = mailConfig;
