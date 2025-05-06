const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class User {
	static async create(userData) {
		const { fullname, username, email, password, phone, verification_token } =
			userData;
		const id = uuidv4();

		const query = `
      INSERT INTO "user" (id, fullname, username, email, password, phone, verification_token)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, fullname, username, email, phone, created_date, is_verified
    `;

		const values = [
			id,
			fullname,
			username,
			email,
			password,
			phone,
			verification_token,
		];

		try {
			const result = await db.query(query, values);
			return result.rows[0];
		} catch (error) {
			throw error;
		}
	}

	static async findByEmail(email) {
		const query = `
            SELECT 
                id, 
                fullname, 
                username, 
                email, 
                password, 
                phone, 
                created_date, 
                is_verified, 
                verification_token 
            FROM "user" 
            WHERE email = $1 AND deleted_date IS NULL
        `;

		try {
			const result = await db.query(query, [email]);

			if (result.rows[0]) {
				console.log(
					`User found: ${email}, is_verified: ${result.rows[0].is_verified}`
				);
			} else {
				console.log(`No user found with email: ${email}`);
			}

			return result.rows[0];
		} catch (error) {
			console.error("Error finding user by email:", error);
			throw error;
		}
	}

	static async markAsVerified(userId) {
		const query = `
            UPDATE "user"
            SET is_verified = true, verification_token = NULL
            WHERE id = $1
            RETURNING id, username, email, is_verified
        `;

		try {
			const result = await db.query(query, [userId]);
			return result.rows[0];
		} catch (error) {
			console.error("Error marking user as verified:", error);
			throw error;
		}
	}
}

module.exports = User;
