const multer = require("multer");
const storage = require("../config/multer");
const path = require("path");

const upload = multer({
	storage: storage,
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: function (req, file, cb) {
		checkFileType(file, req, cb);
	},
}).any();

function checkFileType(file, req, cb) {
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
