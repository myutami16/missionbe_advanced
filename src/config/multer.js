const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure storage for uploaded files
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const filePath = path.join(__dirname, "../../assets/upload/");
		fs.mkdirSync(filePath, { recursive: true });
		cb(null, filePath);
	},
	filename: function (req, file, cb) {
		// Keep the original filename as requested
		cb(null, file.originalname);
	},
});

module.exports = storage;
