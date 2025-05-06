const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const User = require("../../models/userModels");
const { generateToken } = require("../../utils/jwt");
const {
	sendVerificationEmail,
	verifyEmailToken,
} = require("../../utils/mailer");
const db = require("../../config/database");

class authService {
	static async register(userData) {
		try {
			const existingEmailUser = await User.findByEmail(userData.email);
			if (existingEmailUser) {
				throw new Error("Email already registered");
			}

			const existingUsernameUser = await db.query(
				`SELECT * FROM "user" WHERE username = $1 AND deleted_date IS NULL`,
				[userData.username]
			);
			if (existingUsernameUser.rows.length > 0) {
				throw new Error("Username already exists");
			}

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(userData.password, salt);

			const verification_token = uuidv4();

			const newUser = await User.create({
				...userData,
				password: hashedPassword,
				verification_token,
			});

			try {
				await Promise.race([
					sendVerificationEmail(
						userData.email,
						userData.username,
						verification_token
					),
					new Promise((_, reject) =>
						setTimeout(() => reject(new Error("Email sending timeout")), 10000)
					),
				]);
			} catch (emailError) {
				console.error("Email sending failed but user registered:", emailError);
			}

			return { user: newUser };
		} catch (error) {
			console.error("Registration error:", error);
			throw error;
		}
	}
	static async login(email, password) {
		const user = await User.findByEmail(email);

		if (!user) {
			throw new Error("Invalid email or password");
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new Error("Invalid email or password");
		}

		if (!user.is_verified) {
			throw new Error("Please verify your email before logging in");
		}

		const token = generateToken(user);

		return {
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				is_verified: user.is_verified,
			},
			token,
		};
	}

	static async verifyEmail(token) {
		return await verifyEmailToken(token);
	}

	static async resendVerificationEmail(email) {
		try {
			const user = await User.findByEmail(email);

			if (!user) {
				throw new Error("User not found");
			}

			if (user.is_verified) {
				throw new Error("Email already verified");
			}

			const verification_token = uuidv4();

			const query = `
				UPDATE "user" 
				SET verification_token = $1 
				WHERE email = $2 AND deleted_date IS NULL
				RETURNING id, username, email
			`;

			const result = await db.query(query, [verification_token, email]);

			if (result.rows.length === 0) {
				throw new Error("Failed to update verification token");
			}

			await sendVerificationEmail(
				user.email,
				user.username,
				verification_token
			);

			return result.rows[0];
		} catch (error) {
			console.error("Error resending verification email:", error);
			throw error;
		}
	}
}

module.exports = authService;
