const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

function generateToken(user) {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			name: user.username,
			is_verified: user.is_verified,
		},
		JWT_SECRET,
		{ expiresIn: JWT_EXPIRES_IN }
	);
}

function verifyToken(token) {
	return jwt.verify(token, JWT_SECRET);
}

module.exports = {
	generateToken,
	verifyToken,
};
