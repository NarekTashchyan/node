const express = require('express');

const app = express()

app.get('/test', (req, res) => {
    console.log('request recieved')
    res.send("hello from backend")
})

app.listen(3001)
