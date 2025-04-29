const db = require("../config/database");

class Movie {
	static async findAll({ filter = {}, sort = {}, search = "" }) {
		try {
			let query = `
        SELECT m.*, g.name as genre_name
        FROM movie m
        LEFT JOIN genre g ON m.genre_id = g.id
        WHERE m.deleted_date IS NULL
      `;

			const queryParams = [];
			let paramCount = 1;

			// filter
			if (filter.genre_id) {
				query += ` AND m.genre_id = $${paramCount}`;
				queryParams.push(filter.genre_id);
				paramCount++;
			}

			if (filter.rating) {
				query += ` AND m.rating = $${paramCount}`;
				queryParams.push(filter.rating);
				paramCount++;
			}

			//  search
			if (search) {
				query += ` AND (
          m.title ILIKE $${paramCount} OR
          m.description ILIKE $${paramCount}
        )`;
				queryParams.push(`%${search}%`);
				paramCount++;
			}

			//  sorting
			if (sort.field) {
				const direction =
					sort.direction?.toUpperCase() === "DESC" ? "DESC" : "ASC";
				const allowedFields = [
					"title",
					"release_date",
					"rating",
					"created_date",
				];

				if (allowedFields.includes(sort.field)) {
					query += ` ORDER BY m.${sort.field} ${direction}`;
				} else {
					query += ` ORDER BY m.created_date DESC`;
				}
			} else {
				query += ` ORDER BY m.created_date DESC`;
			}

			const result = await db.query(query, queryParams);
			return result.rows;
		} catch (error) {
			throw error;
		}
	}

	static async findById(id) {
		const query = `
      SELECT m.*, g.name as genre_name
      FROM movie m
      LEFT JOIN genre g ON m.genre_id = g.id
      WHERE m.id = $1 AND m.deleted_date IS NULL
    `;
		const result = await db.query(query, [id]);
		return result.rows[0];
	}
}

module.exports = Movie;
