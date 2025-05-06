const upload = require("../../middleware/uploadMiddleware");

// Controller function to handle file uploads
const uploadFile = (req, res) => {
	upload(req, res, async (err) => {
		try {
			if (req.fileValidationError) {
				return res.status(400).send({ error: req.fileValidationError });
			}
			if (err) {
				console.error("Upload error:", err);
				return res.status(500).json({ error: err.message || String(err) });
			}

			// Check if any file was uploaded
			if (!req.files || req.files.length === 0) {
				return res.status(400).json({ error: "Please send a file" });
			}

			// Get the first uploaded file
			const uploadedFile = req.files[0];

			// Return success response
			res.status(200).send({
				msg: "File uploaded successfully",
				filePath: `/assets/upload/${
					uploadedFile.filename || uploadedFile.originalname
				}`,
				fileInfo: {
					originalName: uploadedFile.originalname,
					size: uploadedFile.size,
					mimetype: uploadedFile.mimetype,
				},
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: error.message });
		}
	});
};

module.exports = {
	uploadFile,
};
