const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
    });
    next();
});

app.get('/', (req, res) => {
    res.send('Welcome to the Home Page');
});

app.get('/about', (req, res) => {
    res.send('Welcome to the About Page');
});

app.post('/data', (req, res) => {
    const data = JSON.stringify(req.body);
    fs.writeFile('data.json', data, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send('Data written to file');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
