// src/utils/jwt.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object
 * @returns {String} JWT token
 */
function generateToken(user) {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			name: user.name,
			is_verified: user.is_verified,
		},
		JWT_SECRET,
		{ expiresIn: JWT_EXPIRES_IN }
	);
}

/**
 * Verify a JWT token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token
 */
function verifyToken(token) {
	return jwt.verify(token, JWT_SECRET);
}

module.exports = {
	generateToken,
	verifyToken,
};
