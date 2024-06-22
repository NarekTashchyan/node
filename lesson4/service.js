let movies = []
const getAllMovies = (req, res) => {
    if (movies.length === 0) {
        res.status(404).send({ message: "No movies found" })
    } else {
        res.status(200).json(movies)
    }
}

const getMovieById = (req, res) => {
    const id = req.params.id.split('=')[1];
    const movieIndex = movies.findIndex((movie) => movie.id === parseInt(id));
    if (movieIndex === -1) {
        res.status(404).json({ message: "Movie not found" });
    } else {
        res.status(200).json(movies[movieIndex]);
    }
};


const addMovie = (req, res) => {
    const { title, director, genre, year } = req.body;
    if (!title || !director || !year) {
        res.status(400).json({ message: "Please fill all fields" });
    } else {
        const newMovie = {
            id: movies.length + 1,
            title,
            director,
            genre,
            year,
        }
        movies.push(newMovie);
        res.status(201).json(newMovie);
    }

};

const updateMovie = (req, res) => {
    const id = req.params.id.split('=')[1];
    const movieIndex = movies.findIndex((movie) => movie.id === parseInt(id));
    if (movieIndex === -1) {
        res.status(404).json({ message: "Movie not found" });
    } else {
        const { title, director, genre, year } = req.body;
        if (!title || !director || !genre || !year) {
            res.status(400).json({ message: "Please fill all fields" });
        } else {
            movies[movieIndex] = {
                id: parseInt(id),
                title,
                director,
                genre,
                year,
            };
            res.status(200).json(movies[movieIndex]);
        }
    }
}

const updatePartially = (req, res) => {
    const id = req.params.id.split('=')[1]
    const movieIndex = movies.findIndex((movie) => movie.id === parseInt(id))
    if (movieIndex === -1) {
        res.status(404).json({ message: "Movie not found" });
    } else {
        const { title, director, genre, year } = req.body;
        if (title) movies[movieIndex].title = title;
        if (director) movies[movieIndex].director = director;
        if (genre) movies[movieIndex].genre = genre;
        if (year) movies[movieIndex].year = year;
        res.status(200).json(movies[movieIndex]);
    }

}


const deleteMovie = (req, res) => {
    const id = req.params.id.split('=')[1];
    const movieIndex = movies.findIndex((movie) => movie.id === parseInt(id));
    if (movieIndex === -1) {
        res.status(404).json({ message: "Movie not found" });
    } else {
        movies.splice(movieIndex, 1);
        res.status(200).json({ message: "Movie deleted successfully" });
    }
}


const deleteAll = (req, res) => {
    if (movies.length === 0) {
        res.status(404).json({ message: "No movies found" });
    } else {
        movies = []
        res.status(200).json({ message: "Movies deleted successfully" })
    }
}


module.exports = {
    getAllMovies,
    getMovieById,
    addMovie,
    updateMovie,
    updatePartially,
    deleteMovie,
    deleteAll
}