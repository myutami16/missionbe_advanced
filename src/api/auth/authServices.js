const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const User = require("../../models/userModels");

class authService {
	static async register(userData) {
		// Check if user already exists
		const existingUser = await User.findByEmail(userData.email);
		if (existingUser) {
			throw new Error("Email already registered");
		}

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(userData.password, salt);

		// Generate verification token
		const verification_token = uuidv4();

		// Create user
		const newUser = await User.create({
			...userData,
			password: hashedPassword,
			verification_token,
		});

		return { user: newUser, verification_token };
	}
}

module.exports = authService;
