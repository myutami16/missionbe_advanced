const express = require("express");
const router = express.Router();
const MovieController = require("./movieControllers");
const { verifyTokenMiddleware } = require("../../middleware/authMiddleware");

router.use(verifyTokenMiddleware);

router.get("/", MovieController.getMovies);
router.get("/:id", MovieController.getMovieById);

module.exports = router;
