const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

const readJsonFile = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeJsonFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

app.post('/authors', (req, res) => {
    try {
        const { id, name, biography } = req.body;
        if (!id || !name || !biography) {
            return res.status(400).send({ message: 'Please fill all fields' });
        }
        const authorsArray = readJsonFile('authors.json');
        const existingAuthor = authorsArray.find(author => author.id === id);
        if (existingAuthor) {
            return res.status(400).send({ message: 'Author already exists' });
        }
        const newAuthor = { id, name, biography };
        authorsArray.push(newAuthor);
        writeJsonFile('authors.json', authorsArray);
        res.send(newAuthor);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/authors', (req, res) => {
    try {
        const authorsArray = readJsonFile('authors.json');
        res.send(authorsArray);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/authors/:id', (req, res) => {
    try {
        const authorId = parseInt(req.params.id);
        const authorsArray = readJsonFile('authors.json');
        const author = authorsArray.find(author => author.id === authorId);
        if (!author) {
            return res.status(404).send({ message: 'Author not found' });
        }
        res.send(author);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.put('/authors/:id', (req, res) => {
    try {
        const authorId = parseInt(req.params.id);
        const { name, biography } = req.body;
        if (!name || !biography) {
            return res.status(400).send({ message: 'Please fill all fields' });
        }
        const authorsArray = readJsonFile('authors.json');
        const authorIndex = authorsArray.findIndex(author => author.id === authorId);
        if (authorIndex === -1) {
            return res.status(404).send({ message: 'Author not found' });
        }
        const updatedAuthor = { id: authorId, name, biography };
        authorsArray[authorIndex] = updatedAuthor;
        writeJsonFile('authors.json', authorsArray);
        res.send(updatedAuthor);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.delete('/authors/:id', (req, res) => {
    try {
        const authorId = parseInt(req.params.id);
        let authorsArray = readJsonFile('authors.json');
        const authorIndex = authorsArray.findIndex(author => author.id === authorId);
        if (authorIndex === -1) {
            return res.status(404).send({ message: 'Author not found' });
        }
        authorsArray = authorsArray.filter(author => author.id !== authorId);
        writeJsonFile('authors.json', authorsArray);
        res.send({ message: 'Author deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.post('/books', (req, res) => {
    try {
        const { id, title, genre, authorIds } = req.body;
        if (!id || !title || !genre || !authorIds || !Array.isArray(authorIds)) {
            return res.status(400).send({ message: 'Please fill all fields correctly' });
        }
        const booksArray = readJsonFile('books.json');
        const existingBook = booksArray.find(book => book.id === id);
        if (existingBook) {
            return res.status(400).send({ message: 'Book already exists' });
        }
        const newBook = { id, title, genre, authorIds };
        booksArray.push(newBook);
        writeJsonFile('books.json', booksArray);
        res.send(newBook);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/books', (req, res) => {
    try {
        const booksArray = readJsonFile('books.json');
        res.send(booksArray);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/books/:id', (req, res) => {
    try {
        const bookId = parseInt(req.params.id);
        const booksArray = readJsonFile('books.json');
        const book = booksArray.find(book => book.id === bookId);
        if (!book) {
            return res.status(404).send({ message: 'Book not found' });
        }
        res.send(book);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.put('/books/:id', (req, res) => {
    try {
        const bookId = parseInt(req.params.id);
        const { title, genre, authorIds } = req.body;
        if (!title || !genre || !authorIds || !Array.isArray(authorIds)) {
            return res.status(400).send({ message: 'Please fill all fields correctly' });
        }
        const booksArray = readJsonFile('books.json');
        const bookIndex = booksArray.findIndex(book => book.id === bookId);
        if (bookIndex === -1) {
            return res.status(404).send({ message: 'Book not found' });
        }
        const updatedBook = { id: bookId, title, genre, authorIds };
        booksArray[bookIndex] = updatedBook;
        writeJsonFile('books.json', booksArray);
        res.send(updatedBook);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.delete('/books/:id', (req, res) => {
    try {
        const bookId = parseInt(req.params.id);
        let booksArray = readJsonFile('books.json');
        const bookIndex = booksArray.findIndex(book => book.id === bookId);
        if (bookIndex === -1) {
            return res.status(404).send({ message: 'Book not found' });
        }
        booksArray = booksArray.filter(book => book.id !== bookId);
        writeJsonFile('books.json', booksArray);
        res.send({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/books/search', (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).send({ message: 'Please provide a search query' });
        }
        const booksArray = readJsonFile('books.json');
        const authorsArray = readJsonFile('authors.json');
        const lowerQuery = query.toLowerCase();
        const matchingBooks = booksArray.filter(book =>
            book.title.toLowerCase().includes(lowerQuery) ||
            book.genre.toLowerCase().includes(lowerQuery) ||
            book.authorIds.some(authorId => {
                const author = authorsArray.find(author => author.id === authorId);
                return author && author.name.toLowerCase().includes(lowerQuery);
            })
        );
        res.send(matchingBooks);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/authors/:id/books', (req, res) => {
    try {
        const authorId = parseInt(req.params.id);
        const booksArray = readJsonFile('books.json');
        const matchingBooks = booksArray.filter(book => book.authorIds.includes(authorId));
        res.send(matchingBooks);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
