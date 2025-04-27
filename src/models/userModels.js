const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class User {
	static async create(userData) {
		const { name, email, password, phone, verification_token } = userData;
		const id = uuidv4();

		const query = `
      INSERT INTO "user" (id, name, email, password, phone, verification_token)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, email, phone, created_date, is_verified
    `;

		const values = [id, name, email, password, phone, verification_token];

		try {
			const result = await db.query(query, values);
			return result.rows[0];
		} catch (error) {
			throw error;
		}
	}

	static async findByEmail(email) {
		const query = `SELECT * FROM "user" WHERE email = $1 AND deleted_date IS NULL`;
		const result = await db.query(query, [email]);
		return result.rows[0];
	}
}

module.exports = User;
