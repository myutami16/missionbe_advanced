const validateRegistration = (req, res, next) => {
	const { fullname, username, email, password, phone } = req.body;

	if ((!fullname, !username || !email || !password || !phone)) {
		return res.status(400).json({
			status: "error",
			message: "All fields are required: username, email, password, phone",
		});
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return res.status(400).json({
			status: "error",
			message: "Invalid email format",
		});
	}

	if (password.length < 6) {
		return res.status(400).json({
			status: "error",
			message: "Password must be at least 6 characters long",
		});
	}

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
