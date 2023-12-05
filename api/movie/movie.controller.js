const movieService = require('./movie.service')
const logger = require('../../services/logger.service')

async function getRndMovie(req, res) {
    try {
        const rndMovie = await movieService.getRandomMovie()
        res.send(rndMovie)
    } catch (err) {
        logger.error(`Couldn't fetch random movie`)
        res.status(500).send({ err: 'Failed to fetch random movie' })
    }
}

async function getTrailerId(req, res) {
    const { movieId } = req.query
    try {
        const trailerId = await movieService.getTrailerId(movieId)
        res.send(trailerId)
    } catch (err) {
        // logger.error(`Couldn't fetch trailer id`)
        res.status(500).send({ err: 'Failed to fetch trailer id' })
    }
}

async function getMoviesByCategory(req, res) {
    const { categoryName, endpoint, data } = req.query
    try {
        const categoryMovies = await movieService.getMoviesByCategory(endpoint, data)
        const category = {
            categoryName,
            movies: categoryMovies
        }
        res.send(category)
    } catch (err) {
        // logger.error(`Couldn't fetch movies by category`)
        res.status(500).send({ err: 'Failed to fetch movies by category' })
    }
}

async function getMoviesByName(req, res) {
    const { endpoint, data } = req.query
    try {
        const results = await movieService.getMoviesByName(endpoint, data)
        console.log(results);
        return results
    } catch (err) {
        res.status(500).send({ err: 'Failed to fetch movies by text' })
    }
}

module.exports = {
    getRndMovie,
    getTrailerId,
    getMoviesByCategory,
    getMoviesByName,
}