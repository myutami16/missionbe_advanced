const authService = require("./authServices");

class authController {
	static async register(req, res) {
		try {
			const { fullname, username, email, password, phone } = req.body;

			if (!fullname || !username || !email || !password || !phone) {
				return res.status(400).json({
					status: "error",
					message:
						"All fields are required: fullname, username, email, password, phone",
				});
			}

			const result = await authService.register({
				fullname,
				username,
				email,
				password,
				phone,
			});

			return res.status(201).json({
				status: "success",
				message:
					"User registered successfully. Please check your email to verify your account.",
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
		} catch (error) {
			console.error("Registration error:", error);

			if (error.message === "Email already registered") {
				return res.status(409).json({
					status: "error",
					message: "Email already registered",
				});
			}

			if (error.message === "Username already exists") {
				return res.status(409).json({
					status: "error",
					message: "Username already exists",
				});
			}

			return res.status(500).json({
				status: "error",
				message: "An error occurred during registration",
				error: process.env.NODE_ENV === "development" ? error.message : {},
			});
		}
	}

	static async login(req, res) {
		try {
			const { email, password } = req.body;

			console.log("Login attempt for email:", email);

			const result = await authService.login(email, password);

			console.log("Login result:", JSON.stringify(result, null, 2));

			return res.status(200).json({
				status: "success",
				message: "Login successful",
				data: {
					user: {
						id: result.user.id,
						username: result.user.username,
						email: result.user.email,
						is_verified: result.user.is_verified,
					},
					token: result.token,
				},
			});
		} catch (error) {
			console.error("Login error:", error);

			if (error.message === "Invalid email or password") {
				return res.status(401).json({
					status: "error",
					message: "Invalid email or password",
				});
			}

			if (error.message === "Please verify your email before logging in") {
				return res.status(403).json({
					status: "error",
					message: "Please verify your email before logging in",
				});
			}

			return res.status(500).json({
				status: "error",
				message: "An error occurred during login",
				error: process.env.NODE_ENV === "development" ? error.message : {},
			});
		}
	}

	static async verifyEmail(req, res) {
		try {
			const { token } = req.query;

			const user = await authService.verifyEmail(token);
			return res.status(200).json({
				status: "success",
				message:
					"Email verified successfully. You can now log in to your account.",
				data: {
					user: {
						id: user.id,
						name: user.username,
						email: user.email,
						is_verified: user.is_verified,
					},
				},
			});
		} catch (error) {
			console.error("Email verification error:", error);

			if (error.message === "Invalid verification token") {
				return res.status(400).json({
					status: "error",
					message: "Invalid or expired verification token",
				});
			}

			return res.status(500).json({
				status: "error",
				message: "An error occurred during email verification",
				error: process.env.NODE_ENV === "development" ? error.message : {},
			});
		}
	}

	static async resendVerificationEmail(req, res) {
		try {
			const { email } = req.body;

			if (!email) {
				return res.status(400).json({
					status: "error",
					message: "Email is required",
				});
			}

			await authService.resendVerificationEmail(email);

			return res.status(200).json({
				status: "success",
				message:
					"Verification email sent successfully. Please check your email.",
			});
		} catch (error) {
			console.error("Resend verification email error:", error);

			if (error.message === "User not found") {
				return res.status(404).json({
					status: "error",
					message: "User not found",
				});
			}

			if (error.message === "Email already verified") {
				return res.status(400).json({
					status: "error",
					message:
						"Your email is already verified. Please login to your account.",
				});
			}

			return res.status(500).json({
				status: "error",
				message: "An error occurred while resending verification email",
				error: process.env.NODE_ENV === "development" ? error.message : {},
			});
		}
	}
}

module.exports = authController;
