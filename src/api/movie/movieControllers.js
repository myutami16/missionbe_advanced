const MovieService = require("./movieServices");

class MovieController {
	static async getMovies(req, res) {
		try {
			const { genre_id, rating, sort_by, sort_dir, search } = req.query;

			const filter = {};
			if (genre_id) filter.genre_id = parseInt(genre_id);
			if (rating) filter.rating = parseInt(rating);

			const sort = {};
			if (sort_by) {
				sort.field = sort_by;
				sort.direction = sort_dir || "ASC";
			}

			const movies = await MovieService.getMovies({ filter, sort, search });

			return res.status(200).json({
				status: "success",
				message: "Movies retrieved successfully",
				data: {
					movies,
				},
			});
		} catch (error) {
			console.error("Error getting movies:", error);
			return res.status(500).json({
				status: "error",
				message: "An error occurred while retrieving movies",
			});
		}
	}

	static async getMovieById(req, res) {
		try {
			const { id } = req.params;

			const movie = await MovieService.getMovieById(id);

			if (!movie) {
				return res.status(404).json({
					status: "error",
					message: "Movie not found",
				});
			}

			return res.status(200).json({
				status: "success",
				message: "Movie retrieved successfully",
				data: {
					movie,
				},
			});
		} catch (error) {
			console.error("Error getting movie:", error);
			return res.status(500).json({
				status: "error",
				message: "An error occurred while retrieving the movie",
			});
		}
	}
}

module.exports = MovieController;
