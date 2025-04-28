const { verifyToken } = require("../utils/jwt");

const verifyTokenMiddleware = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			return res.status(401).json({
				status: "error",
				message: "No token provided",
			});
		}

		const token = authHeader.startsWith("Bearer ")
			? authHeader.split(" ")[1]
			: authHeader;

		const decoded = await verifyToken(token);

		req.user = decoded;

		next();
	} catch (error) {
		console.error("Token verification error:", error.message);

		return res.status(401).json({
			status: "error",
			message: "Invalid or expired token",
		});
	}
};

module.exports = { verifyTokenMiddleware };
