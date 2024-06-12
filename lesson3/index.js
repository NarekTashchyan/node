const http = require('http');
const url = require('url');
const { createMovie, getMovies, getMovieById, updateMovieById, updateMoviePartially, deleteById, deleteAll } = require('./operations.js');
const port = 3000;

const server = http.createServer((req, res) => {
    const parsedURL = url.parse(req.url, true);
    const route = parsedURL.pathname;
    const method = req.method;
    const movieIdMatch = route.match(/^\/movies\/id=(\d+)$/);
    if (route === '/movies' && method === 'POST') {
        createMovie(req, res);
    } else if (route === '/movies' && method === 'GET') {
        getMovies(req, res);
    }else if (route.slice(0, 7) === '/movies' && movieIdMatch && method === 'GET') {
        const id = movieIdMatch[1];
        if (id) {
            getMovieById(req, res, id);
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Movie ID not provided' }));
        }
    }else if (route.slice(0, 7) === '/movies' && movieIdMatch && method === 'PUT') {
        const id = movieIdMatch[1];
        if (id) {
            updateMovieById(req, res, id);
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Movie ID not provided' }));
        }
    }else if (route.slice(0, 7) === '/movies' && movieIdMatch && method === 'PATCH') {
        const id = movieIdMatch[1];
        if (id) {
            updateMoviePartially(req, res, id);
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Movie ID not provided' }));
        }
    }
    else if (route.slice(0, 7) === '/movies' && movieIdMatch && method === 'DELETE') {
        const id = movieIdMatch[1];
        if (id) {
            deleteById(req, res, id);
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Movie ID not provided' }));
        }
    }else if (route.slice(0, 7) === '/movies' && method === 'DELETE') {
        deleteAll(req, res)
    }else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
