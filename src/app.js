const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Routes
app.use("/api/auth", require("./api/auth/authRoutes"));
app.use("/api/movies", require("./api/movie/movieRoutes"));
app.use("/api/upload", require("./api/uploads/uploadRoutes")); // Added upload route

app.get("/", (req, res) => {
	res.send("API is running...");
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		status: "error",
		message: "Something went wrong",
		error: process.env.NODE_ENV === "development" ? err.message : {},
	});
});

module.exports = app;
