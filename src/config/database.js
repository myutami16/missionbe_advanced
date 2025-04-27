const { Pool, Client, Query } = require("pg");
require("dotenv").config();

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

pool
	.connect()
	.then(() => console.log("Connected to database"))
	.catch((err) => console.log("Database connection error", err));

module.exports = {
	query: (text, params) => pool.query(text, params),
	pool,
};
