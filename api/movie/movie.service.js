const { response } = require('express')
const { get } = require('../../externalApi/axios.tmdb')
const logger = require('../../services/logger.service')
const { getRandomNum } = require('../../services/util.service')

//TODO: Make call to external api
module.exports = {
    getRandomMovie,
    getTrailerId,
    getMoviesByCategory,
    getMoviesByName,
}

async function getRandomMovie() {
    const endpoint = `discover/tv/`
    const data = {
        with_networks: 213
    }
    try {
        const response = await get(endpoint, data)
        const rndMovie = response.results[getRandomNum(response.results.length)]
        return _formatMovie(rndMovie)
    } catch (err) {
        logger.error(`Couldn't get random movie from: ${endpoint}`)
        throw err
    }
}

async function getTrailerId(movieId) {
    const endpoint = `movie/${movieId}/videos`
    const data = {
        language: "en-US",
    }
    try {
        const response = await get(endpoint, data)
        const movie = response.results[0]
        const trailerId = movie.key
        return trailerId
    } catch (err) {
        // logger.error(`Couldn't get trailerId from: ${endpoint}`)
        throw err
    }
}

async function getMoviesByCategory(endpoint, data) {
    try {
        const response = await get(endpoint, data)
        const categoryMovies = response.results
        movies = categoryMovies.map((movie) => _formatMovie(movie))
        return movies
    } catch (err) {
        // logger.error(`Couldn't get movies from category`)
        throw err
    }
}

async function getMoviesByName(endpoint, data) {
    try {
        const response = await get(endpoint, data)
        const results = response.results
        const movies = results.map(res => {
            if(res.known_for) return res.known_for[0]
        })
        const formattedMovies = movies.map((movie) => {
            const formattedMovie = _formatMovie(movie)
            if(formattedMovie) return formattedMovie
            else return
        })
        return formattedMovies
    } catch (err) {
        throw err
    }
}

function _formatMovie(movie) {
    const { name, id, backdrop_path, poster_path, first_air_date, genre_ids, original_language, overview } = movie
    const formattedMovie = {
        _id: id,
        name: name || movie.title || movie.original_title || movie.original_name,
        image: backdrop_path || poster_path,
        poster: poster_path || backdrop_path,
        releaseDate: first_air_date || movie.release_date || movie.release_date,
        genresIds: genre_ids?.slice(0, 3),
        originalLanguage: original_language?.slice(0, 3),
        description: overview || movie.description,
    }

    let isValidatedMovie = true
    for (const key in formattedMovie) {
        if (!formattedMovie[key]) {
            console.error("Invalid", key);
            isValidatedMovie = false
        }
    }
    if(isValidatedMovie === true) return formattedMovie
    else return
}