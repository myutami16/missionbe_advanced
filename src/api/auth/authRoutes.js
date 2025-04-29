const express = require("express");
const router = express.Router();
const authController = require("./authControllers");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify-email/:token", authController.verifyEmail);

module.exports = router;
