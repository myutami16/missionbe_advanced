const app = require("./app");
const database = require("./config/database");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
	console.log("UNHANDLED REJECTION! Shutting down.");
	console.log(err.name, err.message);
	process.exit(1);
});
