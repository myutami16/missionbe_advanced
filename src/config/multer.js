const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const filePath = path.join(__dirname, "../../assets/upload/");
		fs.mkdirSync(filePath, { recursive: true });
		cb(null, filePath);
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

module.exports = storage;
