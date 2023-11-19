const express = require('express')
const { getRndMovie, getTrailerId, getMoviesByCategory } = require('./movie.controller')

const router = express.Router()

router.get('/rnd', getRndMovie)
router.get('/trailer', getTrailerId)
router.get('/category', getMoviesByCategory)

module.exports = router