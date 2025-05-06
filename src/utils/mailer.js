const nodemailer = require("nodemailer");
const db = require("../config/database");
require("dotenv").config();

async function sendVerificationEmail(email, username, token) {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.GOOGLE_APP_EMAIL,
			pass: process.env.GOOGLE_APP_PASSWORD,
		},
		tls: { rejectUnauthorized: false },
		connectionTimeout: 10000,
	});

	const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${token}`;

	const mailOptions = {
		from: `"No Reply" <${process.env.GOOGLE_APP_EMAIL}>`,
		to: email,
		subject: "Verify Your Email Address",
		html: `
            <html>
            <head>
                <style>
                    .button {
                        display: inline-block;
                        padding: 12px 24px;
                        background-color: #4CAF50;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                        margin: 15px 0;
                    }
                    .container {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Email Verification</h2>
                    <p>Hello ${username},</p>
                    <p>Thank you for registering! Please click the button below to verify your email address:</p>
                    <a href="${verificationUrl}" class="button">Verify Email</a>
                    <p>If you didn't create an account, you can safely ignore this email.</p>
                    <p>Best regards,<br>Your Application Team</p>
                </div>
            </body>
            </html>`,
		text: `Please verify your email by clicking this link: ${verificationUrl}`,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Verification email sent: %s", info.messageId);
		return true;
	} catch (error) {
		console.error("Failed to send verification email:", error);
		return false;
	}
}

async function verifyEmailToken(token) {
	try {
		const query = `
            UPDATE "user" 
            SET is_verified = true, verification_token = NULL 
            WHERE verification_token = $1 AND deleted_date IS NULL
            RETURNING id, username, email, is_verified
        `;

		const result = await db.query(query, [token]);

		if (result.rows.length === 0) {
			throw new Error("Invalid verification token");
		}

		return result.rows[0];
	} catch (error) {
		console.error("Error during email verification:", error);
		throw error;
	}
}

module.exports = {
	sendVerificationEmail,
	verifyEmailToken,
};
