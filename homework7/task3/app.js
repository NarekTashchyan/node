const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

const readJsonFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeJsonFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

app.post('/posts', (req, res) => {
    try {
        const { id, title, content, author } = req.body;
        if (!id || !title || !content || !author) {
            return res.status(400).send({ message: 'Please fill all the fields' });
        }

        const postsArray = readJsonFile('posts.json');
        const existingPost = postsArray.find(post => post.id === id);
        if (existingPost) {
            return res.status(400).send({ message: 'Post already exists' });
        }

        const newPost = { id, title, content, author, likes: 0, comments: [] };
        postsArray.push(newPost);
        writeJsonFile('posts.json', postsArray);
        res.send(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/posts', (req, res) => {
    try {
        const { page, limit } = req.query;
        const postsArray = readJsonFile('posts.json');
        const paginatedPosts = postsArray.slice((page - 1) * limit, page * limit);
        res.send(paginatedPosts);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/posts/:id', (req, res) => {
    try {
        const postID = parseInt(req.params.id);
        const postsArray = readJsonFile('posts.json');
        const post = postsArray.find(post => post.id === postID);
        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }
        res.send(post);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.put('/posts/:id', (req, res) => {
    try {
        const postID = parseInt(req.params.id);
        const { title, content, author } = req.body;
        if (!title || !content || !author) {
            return res.status(400).send({ message: 'Please fill all the fields' });
        }

        const postsArray = readJsonFile('posts.json');
        const postIndex = postsArray.findIndex(post => post.id === postID);
        if (postIndex === -1) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const updatedPost = { id: postID, title, content, author, likes: postsArray[postIndex].likes, comments: postsArray[postIndex].comments };
        postsArray[postIndex] = updatedPost;
        writeJsonFile('posts.json', postsArray);
        res.send(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.delete('/posts/:id', (req, res) => {
    try {
        const postID = parseInt(req.params.id);
        let postsArray = readJsonFile('posts.json');
        const postIndex = postsArray.findIndex(post => post.id === postID);
        if (postIndex === -1) {
            return res.status(404).send({ message: 'Post not found' });
        }

        postsArray = postsArray.filter(post => post.id !== postID);
        writeJsonFile('posts.json', postsArray);
        res.send({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.post('/posts/:id/like', (req, res) => {
    try {
        const postID = parseInt(req.params.id);
        const postsArray = readJsonFile('posts.json');
        const postIndex = postsArray.findIndex(post => post.id === postID);
        if (postIndex === -1) {
            return res.status(404).send({ message: 'Post not found' });
        }

        postsArray[postIndex].likes += 1;
        writeJsonFile('posts.json', postsArray);
        res.send({ message: 'Post liked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.post('/posts/:id/unlike', (req, res) => {
    try {
        const postID = parseInt(req.params.id);
        const postsArray = readJsonFile('posts.json');
        const postIndex = postsArray.findIndex(post => post.id === postID);
        if (postIndex === -1) {
            return res.status(404).send({ message: 'Post not found' });
        }

        if (postsArray[postIndex].likes > 0) {
            postsArray[postIndex].likes -= 1;
            writeJsonFile('posts.json', postsArray);
            res.send({ message: 'Post unliked successfully' });
        } else {
            res.status(400).send({ message: 'Post has no likes to unlike' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.post('/posts/:postId/comments', (req, res) => {
    try {
        const postID = parseInt(req.params.postId);
        const { commentId, content, author } = req.body;
        if (!commentId || !content || !author) {
            return res.status(400).send({ message: 'Please fill all the fields' });
        }

        const postsArray = readJsonFile('posts.json');
        const postIndex = postsArray.findIndex(post => post.id === postID);
        if (postIndex === -1) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const newComment = { commentId, content, author };
        postsArray[postIndex].comments.push(newComment);
        writeJsonFile('posts.json', postsArray);
        res.send(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/posts/:postId/comments', (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const postID = parseInt(req.params.postId);
        const postsArray = readJsonFile('posts.json');
        const post = postsArray.find(post => post.id === postID);
        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const paginatedComments = post.comments.slice((page - 1) * limit, page * limit);
        res.send(paginatedComments);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/posts/:postId/comments/:commentId', (req, res) => {
    try {
        const postID = parseInt(req.params.postId);
        const commentID = parseInt(req.params.commentId);
        const postsArray = readJsonFile('posts.json');
        const post = postsArray.find(post => post.id === postID);
        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const comment = post.comments.find(comment => comment.commentId === commentID);
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }
        res.send(comment);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.put('/posts/:postId/comments/:commentId', (req, res) => {
    try {
        const postID = parseInt(req.params.postId);
        const commentID = parseInt(req.params.commentId);
        const { content, author } = req.body;
        if (!content || !author) {
            return res.status(400).send({ message: 'Please fill all the fields' });
        }

        const postsArray = readJsonFile('posts.json');
        const postIndex = postsArray.findIndex(post => post.id === postID);
        if (postIndex === -1) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const commentIndex = postsArray[postIndex].comments.findIndex(comment => comment.commentId === commentID);
        if (commentIndex === -1) {
            return res.status(404).send({ message: 'Comment not found' });
        }

        const updatedComment = { commentId: commentID, content, author };
        postsArray[postIndex].comments[commentIndex] = updatedComment;
        writeJsonFile('posts.json', postsArray);
        res.send(updatedComment);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.delete('/posts/:postId/comments/:commentId', (req, res) => {
    try {
        const postID = parseInt(req.params.postId);
        const commentID = parseInt(req.params.commentId);
        const postsArray = readJsonFile('posts.json');
        const postIndex = postsArray.findIndex(post => post.id === postID);
        if (postIndex === -1) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const commentIndex = postsArray[postIndex].comments.findIndex(comment => comment.commentId === commentID);
        if (commentIndex === -1) {
            return res.status(404).send({ message: 'Comment not found' });
        }

        postsArray[postIndex].comments = postsArray[postIndex].comments.filter(comment => comment.commentId !== commentID);
        writeJsonFile('posts.json', postsArray);
        res.send({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
