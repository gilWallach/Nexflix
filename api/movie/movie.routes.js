const express = require('express')
const { getRndMovie, getTrailerId, getMoviesByCategory, getMoviesByName } = require('./movie.controller')

const router = express.Router()

router.get('/rnd', getRndMovie)
router.get('/trailer', getTrailerId)
router.get('/category', getMoviesByCategory)
router.get('/search', getMoviesByName)

module.exports = router