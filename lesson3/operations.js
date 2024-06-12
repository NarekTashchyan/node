let movies = []

const createMovie = (req, res) => {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk.toString()
    })
    req.on('end', () => {
        const movie = JSON.parse(body)
        for (let i in movie) {
            movies.push(movie[i])
        }
        res.writeHead(201, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ message: 'You have successfully added movies' }));
    })
}


const getMovies = (req, res) => {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify(movies));
}


const getMovieById = (req, res, id) => {
    const movie = movies.find((movie) => movie.id === parseInt(id));
    if (!movie) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Movie not found' }));
    } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(movie));
    }
};


const updateMovieById = (req, res, id) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const parsedBody = JSON.parse(body);
        const update = parsedBody['update'];

        const index = movies.findIndex((movie) => movie.id === parseInt(id));
        if (index === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Movie not found' }));
        } else {
            movies[index] = { ...movies[index], ...update };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Movie updated successfully', movie: movies[index] }));
        }
    });
};


const updateMoviePartially = (req, res, id) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const parsedBody = JSON.parse(body);
        const index = movies.findIndex((movie) => movie.id === parseInt(id));
        if (index === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Movie not found' }));
        } else {
            movies[index] = { ...movies[index], ...parsedBody };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Movie updated successfully', movie: movies[index] }));
        }
    })
}


const deleteById = (req, res, id) => {
    const index = movies.findIndex((movie) => movie.id === parseInt(id));
    if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Movie not found' }));
    } else {
        movies.splice(index, 1);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Movie deleted successfully' }));
    }
}


const deleteAll = (req, res) => {
    if (!movies.length){
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'No movies found' }));
    }else{
        movies = [];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'All movies deleted successfully' }));
    }
}


module.exports = {
    createMovie,
    getMovies,
    getMovieById,
    updateMovieById,
    updateMoviePartially,
    deleteById,
    deleteAll
}