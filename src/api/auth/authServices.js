const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const User = require("../../models/userModels");
const { generateToken } = require("../../utils/jwt");

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

	static async login(email, password) {
		// Find user by email
		const user = await User.findByEmail(email);

		// Check if user exists
		if (!user) {
			throw new Error("Invalid email or password");
		}

		// Check if password is correct
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new Error("Invalid email or password");
		}

		// Generate JWT token
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
}

module.exports = authService;
