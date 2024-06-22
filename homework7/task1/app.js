const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
app.use(express.json())

app.post('/users', (req, res) => {
    try {
        const { id, name, email, password } = req.body
        if (!id || !name || !email || !password) {
            return res.status(400).send({ message: 'Please fill all the fields' })
        } else if (!emailRegex.test(email)) {
            return res.status(400).send({ message: 'Please input an email' })
        }
        const users = fs.readFileSync('users.json')
        const usersArray = JSON.parse(users)
        const existingUser = usersArray.find(user => user.email === email)
        if (existingUser) {
            return res.status(400).send({ message: 'User already exists' })
        }
        const newUser = { id, name, email, password }
        usersArray.push(newUser)
        fs.writeFileSync('users.json', JSON.stringify(usersArray, null, 2))
        res.send(newUser)
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Internal Server Error' })
    }

})


app.get('/users', (req, res) => {
    try {
        const users = fs.readFileSync('users.json')
        const usersArray = JSON.parse(users)
        res.send(usersArray)
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Internal Server Error' })
    }
})


app.get('/users/:id', (req, res) => {
    try {
        const userID = parseInt(req.params.id)
        const users = fs.readFileSync('users.json')
        const usersArray = JSON.parse(users)
        const user = usersArray.find(user => user.id === userID)
        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }
        res.send(user)
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

app.put('/users/:id', (req, res) => {
    try {
        const userID = parseInt(req.params.id)
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).send({ message: 'Please fill all fields' })
        }
        const users = fs.readFileSync('users.json')
        const usersArray = JSON.parse(users)
        const userIndex = usersArray.findIndex(user => user.id === userID)
        if (userIndex === -1) {
            return res.status(404).send({ message: 'User not found' })
        }
        const updatedUser = { id: userID, name, email, password }
        usersArray[userIndex] = updatedUser
        fs.writeFileSync('users.json', JSON.stringify(usersArray, null, 2))
        res.send(updatedUser)
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Internal Server Error' })
    }
})


app.delete('/users/:id', (req, res) => {
    try {
        const userID = parseInt(req.params.id)
        let users = JSON.parse(fs.readFileSync('users.json'))
        const userIndex = users.findIndex(user => user.id === userID)
        if (userIndex === -1) {
            return res.status(404).send({ meassage: 'User not found' })
        }
        users = users.filter(user => user.id != userID)
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2))
        res.send({ message: 'User deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Internal Server Error' })
    }
})


app.post('/users/:id/profile', (req, res) => {
    try {
        const userID = parseInt(req.params.id)
        const { profile } = req.body
        if (!profile) {
            return res.status(400).send({ message: 'Please provide a profile' })
        }
        const users = JSON.parse(fs.readFileSync('users.json'))
        const userIndex = users.findIndex(user => user.id === userID)
        if (userIndex === -1) {
            return res.status(404).send({ message: 'User not found' })
        }
        users[userIndex].profile = profile
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2))
        res.send(users[userIndex])
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Internal Server Error' })
    }
})


app.get('/users/:id/profile', (req, res) => {
    try {
        const userID = parseInt(req.params.id)
        const users = JSON.parse(fs.readFileSync('users.json'))
        const userIndex = users.findIndex(user => user.id === userID)
        if (userIndex === -1) {
            return res.status(404).send({ message: 'User not found' })
        }
        res.send(users[userIndex].profile)
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Internal Server Error' })
    }
})


app.put('/users/:id/profile', (req, res) => {
    try {
        const userID = parseInt(req.params.id)
        const { profile } = req.body
        if (!profile) {
            return res.status(400).send({ message: 'Please provide a profile' })
        }
        const users = JSON.parse(fs.readFileSync('users.json'))
        const userIndex = users.findIndex(user => user.id === userID)
        if (userIndex === -1) {
            return res.status(404).send({ message: 'User not found' })
        }
        users[userIndex].profile = { ...users[userIndex].profile, ...profile }
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2))
        res.send(users[userIndex].profile)
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Internal Server Error' })
    }
})


app.delete('/users/:id/profile', (req, res) => {
    try {
        const userId = parseInt(req.params.id)
        const users = JSON.parse(fs.readFileSync('users.json'))
        const userIndex = users.findIndex(user => user.id === userId)
        if (userIndex === -1) {
            return res.status(404).send({ message: 'User not found' })
        }
        delete users[userIndex].profile
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2))
        res.send(users[userIndex])
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Internal server error' })
    }
})


app.put('/users/:id/profile/picture', (req, res) => {
    try {
        const userId = parseInt(req.params.id)
        const { picture } = req.body
        if (!picture) {
            return res.status(400).send({ message: 'Please provide a picture' })
        }
        const users = JSON.parse(fs.readFileSync('users.json'))
        const userIndex = users.findIndex(user => user.id === userId)
        if (userIndex === -1) {
            return res.status(404).send({ message: 'User not found' })
        }
        users[userIndex].profile.picture = picture
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2))
        res.send(users[userIndex].profile)
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Internal server error' })
    }
})


app.listen(3000, () => {
    console.log(`server running at http://localhost:${port}`)
})