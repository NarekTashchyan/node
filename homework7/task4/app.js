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

app.post('/projects', (req, res) => {
    try {
        const { id, name, description } = req.body;
        if (!id || !name || !description) {
            return res.status(400).send({ message: 'Please fill all fields' });
        }
        const projectsArray = readJsonFile('projects.json');
        const existingProject = projectsArray.find(project => project.id === id);
        if (existingProject) {
            return res.status(400).send({ message: 'Project already exists' });
        }
        const newProject = { id, name, description };
        projectsArray.push(newProject);
        writeJsonFile('projects.json', projectsArray);
        res.send(newProject);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/projects', (req, res) => {
    try {
        const projectsArray = readJsonFile('projects.json');
        res.send(projectsArray);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/projects/:id', (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        const projectsArray = readJsonFile('projects.json');
        const project = projectsArray.find(project => project.id === projectId);
        if (!project) {
            return res.status(404).send({ message: 'Project not found' });
        }
        res.send(project);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.put('/projects/:id', (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).send({ message: 'Please fill all fields' });
        }
        const projectsArray = readJsonFile('projects.json');
        const projectIndex = projectsArray.findIndex(project => project.id === projectId);
        if (projectIndex === -1) {
            return res.status(404).send({ message: 'Project not found' });
        }
        const updatedProject = { id: projectId, name, description };
        projectsArray[projectIndex] = updatedProject;
        writeJsonFile('projects.json', projectsArray);
        res.send(updatedProject);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.delete('/projects/:id', (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        let projectsArray = readJsonFile('projects.json');
        const projectIndex = projectsArray.findIndex(project => project.id === projectId);
        if (projectIndex === -1) {
            return res.status(404).send({ message: 'Project not found' });
        }
        projectsArray = projectsArray.filter(project => project.id !== projectId);
        writeJsonFile('projects.json', projectsArray);
        res.send({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.post('/projects/:projectId/tasks', (req, res) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const { id, name, description, deadline } = req.body;
        if (!id || !name || !description || !deadline) {
            return res.status(400).send({ message: 'Please fill all fields' });
        }
        const projectsArray = readJsonFile('projects.json');
        const project = projectsArray.find(project => project.id === projectId);
        if (!project) {
            return res.status(404).send({ message: 'Project not found' });
        }
        const existingTask = project.tasks ? project.tasks.find(task => task.id === id) : null;
        if (existingTask) {
            return res.status(400).send({ message: 'Task already exists' });
        }
        const newTask = { id, name, description, deadline };
        project.tasks = project.tasks || [];
        project.tasks.push(newTask);
        writeJsonFile('projects.json', projectsArray);
        res.send(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/projects/:projectId/tasks', (req, res) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const projectsArray = readJsonFile('projects.json');
        const project = projectsArray.find(project => project.id === projectId);
        if (!project) {
            return res.status(404).send({ message: 'Project not found' });
        }
        res.send(project.tasks || []);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/projects/:projectId/tasks/:taskId', (req, res) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const taskId = parseInt(req.params.taskId);
        const projectsArray = readJsonFile('projects.json');
        const project = projectsArray.find(project => project.id === projectId);
        if (!project) {
            return res.status(404).send({ message: 'Project not found' });
        }
        const task = project.tasks ? project.tasks.find(task => task.id === taskId) : null;
        if (!task) {
            return res.status(404).send({ message: 'Task not found' });
        }
        res.send(task);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.put('/projects/:projectId/tasks/:taskId', (req, res) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const taskId = parseInt(req.params.taskId);
        const { name, description, deadline } = req.body;
        if (!name || !description || !deadline) {
            return res.status(400).send({ message: 'Please fill all fields' });
        }
        const projectsArray = readJsonFile('projects.json');
        const project = projectsArray.find(project => project.id === projectId);
        if (!project) {
            return res.status(404).send({ message: 'Project not found' });
        }
        const taskIndex = project.tasks ? project.tasks.findIndex(task => task.id === taskId) : -1;
        if (taskIndex === -1) {
            return res.status(404).send({ message: 'Task not found' });
        }
        const updatedTask = { id: taskId, name, description, deadline };
        project.tasks[taskIndex] = updatedTask;
        writeJsonFile('projects.json', projectsArray);
        res.send(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.delete('/projects/:projectId/tasks/:taskId', (req, res) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const taskId = parseInt(req.params.taskId);
        let projectsArray = readJsonFile('projects.json');
        const project = projectsArray.find(project => project.id === projectId);
        if (!project) {
            return res.status(404).send({ message: 'Project not found' });
        }
        const taskIndex = project.tasks ? project.tasks.findIndex(task => task.id === taskId) : -1;
        if (taskIndex === -1) {
            return res.status(404).send({ message: 'Task not found' });
        }
        project.tasks = project.tasks.filter(task => task.id !== taskId);
        writeJsonFile('projects.json', projectsArray);
        res.send({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/tasks', (req, res) => {
    try {
        const { dueBefore } = req.query;
        if (!dueBefore) {
            return res.status(400).send({ message: 'Please provide a dueBefore date' });
        }
        const projectsArray = readJsonFile('projects.json');
        let tasks = [];
        projectsArray.forEach(project => {
            if (project.tasks) {
                tasks = tasks.concat(project.tasks.filter(task => new Date(task.deadline) <= new Date(dueBefore)));
            }
        });
        res.send(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
