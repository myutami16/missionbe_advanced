const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const User = require("../../models/userModels");
const { generateToken } = require("../../utils/jwt");
const { sendVerificationEmail } = require("../../utils/mailer");

class authService {
	static async register(userData) {
		const existingUser = await User.findByEmail(userData.email);
		if (existingUser) {
			throw new Error("Email already registered");
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(userData.password, salt);

		const verification_token = uuidv4();

		const newUser = await User.create({
			...userData,
			password: hashedPassword,
			verification_token,
		});

		await sendVerificationEmail(
			userData.email,
			userData.name,
			verification_token
		);

		return { user: newUser, verification_token };
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
				name: user.name,
				email: user.email,
				is_verified: user.is_verified,
			},
			token,
		};
	}

	static async verifyEmail(token) {
		try {
			const query = `
				UPDATE "user" 
				SET is_verified = true, verification_token = NULL 
				WHERE verification_token = $1 AND deleted_date IS NULL
				RETURNING id, name, email, is_verified
			`;

			const result = await db.query(query, [token]);

			if (result.rows.length === 0) {
				throw new Error("Invalid verification token");
			}

			return result.rows[0];
		} catch (error) {
			throw error;
		}
	}
}

module.exports = authService;
