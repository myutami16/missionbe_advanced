// src/api/auth/authValidators.js
const validateRegistration = (req, res, next) => {
	const { name, email, password, phone } = req.body;

	// Check if all required fields are present
	if (!name || !email || !password || !phone) {
		return res.status(400).json({
			status: "error",
			message: "All fields are required: name, email, password, phone",
		});
	}

	// Email validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return res.status(400).json({
			status: "error",
			message: "Invalid email format",
		});
	}

	// Password strength validation (at least 6 characters)
	if (password.length < 6) {
		return res.status(400).json({
			status: "error",
			message: "Password must be at least 6 characters long",
		});
	}

	// If validation passes, proceed to the next middleware
	next();
};

const validateLogin = (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({
			status: "error",
			message: "Email and password are required",
		});
	}

	next();
};

const validateEmailVerification = (req, res, next) => {
	const { token } = req.query;

	if (!token) {
		return res.status(400).json({
			status: "error",
			message: "Verification token is required",
		});
	}

	next();
};

module.exports = {
	validateRegistration,
	validateLogin,
	validateEmailVerification,
};
