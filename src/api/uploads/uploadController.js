const upload = require("../../middleware/uploadMiddleware");

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

			if (!req.files || req.files.length === 0) {
				return res.status(400).json({ error: "Please send a file" });
			}

			const uploadedFile = req.files[0];

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
