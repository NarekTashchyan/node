const express = require('express');
const multer = require('multer');
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const app = express();
const upload = multer();

app.use(express.json());

let db, collection;

client.connect()
  .then(() => {
    db = client.db('engine');
    collection = db.collection('engine');
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

app.post('/parse', upload.single('textfile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const users = req.file.buffer.toString().split('"').map(user => user.trim());

    await collection.insertOne({ users });

    res.status(200).send('Data successfully saved');
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('An error occurred while processing the file');
  }
});

app.get('/search', async (req, res) => {
  try {
    const name = req.query.q;
    if (!name) {
      return res.status(400).send('Query parameter "q" is required');
    }

    const upperName = name.toUpperCase();

    const users = await collection.findOne({ users: { $regex: upperName, $options: 'i' } })

    if (users.length === 0) {
      return res.status(404).send('No users found');
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).send('An error occurred while searching for users');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
