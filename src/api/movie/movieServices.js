const Movie = require("../../models/movieModels");

class MovieService {
	static async getMovies({ filter, sort, search }) {
		return await Movie.findAll({ filter, sort, search });
	}

	static async getMovieById(id) {
		return await Movie.findById(id);
	}
}

module.exports = MovieService;
