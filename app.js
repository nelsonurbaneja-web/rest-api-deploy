const express = require('express')
const cors = require('cors')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const { validateMovie, validatePartialMovie } = require('./shemas/shemas')

const PORT = process.env.PORT ?? 1234
const app = express()

app.disable('x-powored-by')
app.use(express.json())

app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))

app.get('/', (_req, res) => {
  res.send('hello word')
})

// Get all movies
app.get('/movies', (req, res) => {
  // const origin = res.header('origin')

  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', origin)
  // }

  const { genre } = req.query

  if (genre) {
    const filteredMovies = movies.filter(movie => {
      return movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    })

    return res.status(200).json(filteredMovies)
  }

  return res.status(200).json(movies)
})

// Get one movie for id
app.get('/movies/:id', (req, res) => {
  const { id } = req.params

  const movie = movies.find(movie => movie.id === id)

  if (!movie) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  return res.status(200).json(movie)
})

// Create new movie
app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (!result.success) {
    return res.status(400).json(JSON.parse(result.error.message))
  }
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  movies.push(newMovie)

  return res.status(201).json(newMovie)
})

// Edit movie
app.patch('/movies/:id', (req, res) => {
  const { id } = req.params
  const result = validatePartialMovie(req.body)
  const moviesIndex = movies.findIndex(movie => movie.id === id)

  if (moviesIndex < 0) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  if (!result.success) {
    return res.status(400).json(JSON.parse(result.error.message))
  }

  const updatedMovie = {
    ...movies[moviesIndex],
    ...result.data
  }

  movies[moviesIndex] = updatedMovie

  return res.status(200).json(updatedMovie)
})

// app.options('/movies', (req, res) => {
//   const origin = req.header('origin')

//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
//   }
// })

app.listen(PORT, () => {
  console.log(`server listening in port ${PORT} - get in http://localhost:${PORT}`)
})
