const express = require('express')
const cors = require('cors')
const path = require('path')

// TODO: configure my api to be HTTPS using a node.js library
const app = express()
// const https = require('https').createServer(app)

if (process.env.NODE_ENV === 'production') {
    console.log("production")
    // app.use(express.static(path.resolve(__dirname, 'public')))
    app.use(express.static('public'))
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173',
        'http://127.0.0.1:3000', 'http://localhost:3000',
        'https://api.themoviedb.org/3/'
    ],
        credentials: true,
    }
    app.use(cors(corsOptions))
}

const port = process.env.PORT || 3000

app.use(express.json())

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})

//routes
const authRoutes = require('./api/auth/auth.routes')
const accountRoutes = require('./api/account/account.routes')
const movieRoutes = require('./api/movie/movie.routes')

app.use('/api/auth', authRoutes)
app.use('/api/account', accountRoutes)
app.use('/api/movie', movieRoutes)