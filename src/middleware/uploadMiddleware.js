const multer = require("multer");
const storage = require("../config/multer");
const path = require("path");

// Create upload middleware using the configured storage
const upload = multer({
	storage: storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
	fileFilter: function (req, file, cb) {
		checkFileType(file, req, cb);
	},
}).any(); // Accept any field name instead of specific fields

// Function to check if the file type is valid
function checkFileType(file, req, cb) {
	// Allow all file types if needed
	// Or keep your image restriction if that's what you want:
	const filetypes = /jpeg|jpg|png|gif/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		req.fileValidationError = "Error: Images only! (jpeg, jpg, png, gif)";
		cb(null, false);
	}
}

module.exports = upload;
