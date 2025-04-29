const nodemailer = require("nodemailer");
const mailConfig = require("../config/mail");

const transporter = nodemailer.createTransport(mailConfig);
const sendVerificationEmail = async (email, name, token) => {
	const verificationUrl = `${process.env.APP_URL}/api/auth/verify-email/${token}`;
	const mailOptions = {
		from: process.env.MAIL_FROM || '"Movie App" <no-reply@movieapp.com>',
		to: email,
		subject: "Please verify your email address",
		html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello ${name}!</h2>
        <p>Thank you for registering with our Movie App. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Verify Email
          </a>
        </div>
        <p>Alternatively, you can copy and paste the following link in your browser:</p>
        <p>${verificationUrl}</p>
        <p>If you did not create an account, please ignore this email.</p>
        <p>Thanks,<br>The Movie App Team</p>
      </div>
    `,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent: " + info.response);
		return info;
	} catch (error) {
		console.error("Error sending email:", error);
		throw error;
	}
};

module.exports = {
	sendVerificationEmail,
};
