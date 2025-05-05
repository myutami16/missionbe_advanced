const express = require("express");
const router = express.Router();
const authController = require("./authControllers");
const {
	validateRegistration,
	validateLogin,
	validateEmailVerification,
} = require("./authValidators");

router.post("/register", validateRegistration, authController.register);
router.post("/login", validateLogin, authController.login);
router.get(
	"/verify-email",
	validateEmailVerification,
	authController.verifyEmail
);
router.post("/resend-verification", authController.resendVerificationEmail);

module.exports = router;
