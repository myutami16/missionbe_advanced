const express = require("express");
const uploadController = require("./uploadController");
const { verifyTokenMiddleware } = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/upload", verifyTokenMiddleware, uploadController.uploadFile);

module.exports = router;
