const authService = require("./authServices");

class authController {
	static async register(req, res) {
		try {
			// validate input
			const { name, email, password, phone } = req.body;

			if (!name || !email || !password || !phone) {
				return res.status(400).json({
					status: "error",
					message: "All fields are required: name, email, password, phone",
				});
			}

			// email validation
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				return res.status(400).json({
					status: "error",
					message: "Invalid email format",
				});
			}

			// password strength validation (at least 6 characters)
			if (password.length < 6) {
				return res.status(400).json({
					status: "error",
					message: "Password must be at least 6 characters long",
				});
			}

			// register user
			const result = await authService.register({
				name,
				email,
				password,
				phone,
			});

			// success response
			return res.status(201).json({
				status: "success",
				message: "User registered successfully",
				data: {
					user: {
						id: result.user.id,
						name: result.user.name,
						email: result.user.email,
						phone: result.user.phone,
						created_date: result.user.created_date,
						is_verified: result.user.is_verified,
					},
				},
			});
			// error response
		} catch (error) {
			console.error("Registration error:", error);

			if (error.message === "Email already registered") {
				return res.status(409).json({
					status: "error",
					message: "Email already registered",
				});
			}

			return res.status(500).json({
				status: "error",
				message: "An error occurred during registration",
			});
		}
	}
}

module.exports = authController;
