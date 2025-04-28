const express = require("express");
const router = express.Router();
const { verifyTokenMiddleware } = require("../../middleware/authMiddleware");

router.get("/me", verifyTokenMiddleware, (req, res) => {
	res.status(200).json({
		status: "success",
		message: "You are authenticated",
		data: {
			user: req.user,
		},
	});
});

module.exports = router;
