const express = require("express");
const router = express.Router();
const authController = require("./authControllers");

router.post("/register", authController.register);

module.exports = router;
