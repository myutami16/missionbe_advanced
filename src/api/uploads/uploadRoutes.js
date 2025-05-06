const express = require("express");
const uploadController = require("./uploadController");
const { verifyTokenMiddleware } = require("../../middleware/authMiddleware");

const router = express.Router();

// Use verifyTokenMiddleware instead of importing the entire file
router.post("/upload", verifyTokenMiddleware, uploadController.uploadFile);

module.exports = router;
