const express = require('express')
const app = express()
const fs = require('fs')
const users = []

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/users', (req, res) => {
    const user_data = fs.readFileSync("users.json")

    res.json(JSON.stringify(user_data))
})

app.get('/users/:id', (req, res) => {
    const id = req.params.id
    res.send(`User with id ${id}`)
})

app.post('/users', (req, res) => {
    if (!req.body.name || !req.body.age){
        return res.status(400).send("please fill all fields")
    }
    const user = {
        name: req.body.name,
        age: req.body.age
    }
    const user_data = fs.readFileSync("users.json")
    const user_json = JSON.parse(user_data)
    user_json.push(user)
    res.send(user)
})

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000')
})