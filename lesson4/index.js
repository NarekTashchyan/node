const express = require('express')
const app = express()
const port = 3000

const {getAllMovies, getMovieById, addMovie, updateMovie, updatePartially, deleteMovie, deleteAll} = require('./service.js')

app.use(express.json())

app.get('/movies', (req, res) => {
    getAllMovies(req, res)
})

app.get('/movies/:id', (req, res) => {
    getMovieById(req, res)
})

app.post('/movies/', (req, res) => {
    addMovie(req, res)
})

app.put('/movies/:id', (req, res) => {
    updateMovie(req, res)
})

app.patch('/movies/:id', (req, res) => {
    updatePartially(req, res)
})

app.delete('/movies/:id', (req, res) => {
    deleteMovie(req, res)
})

app.delete('/movies/', (req, res) => {
    deleteAll(req, res)
})

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
