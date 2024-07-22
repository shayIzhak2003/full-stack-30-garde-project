const express = require('express');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const tasksFile = 'tasks.json';
const accessTokenSecret = 'youraccesstokensecret'; // Make sure to set a secret key for JWT

// Example users (in real app, use a database)
let users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' }
];

// Load tasks from file
let tasks = [];
fs.readFile(tasksFile, (err, data) => {
    if (!err) {
        tasks = JSON.parse(data);
    } else {
        console.error('Error reading tasks file:', err);
    }
});

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Utility function to generate timestamp

const generateTimestamp = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return date + "|" + hours + ":" + minutes;
};

// Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).send('User not found');
    }

    if (password === user.password) {
        const accessToken = jwt.sign({ username: user.username }, accessTokenSecret);
        res.json({ accessToken: accessToken });
    } else {
        res.status(403).send('Wrong password');
    }
});

// Get all tasks
app.get('/tasks', authenticateToken, (req, res) => {
    res.json(tasks);
});

// Get task by ID
app.get('/tasks/:id', authenticateToken, (req, res) => {
    const taskId = req.params.id;
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

// Add a task
app.post('/tasks', authenticateToken, (req, res) => {
    const { title, description } = req.body;
    const newTask = {
        id: uuid.v4(),
        creationDate: generateTimestamp(),
        updateDate: '',
        title,
        description
    };
    tasks.push(newTask);
    fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2), err => {
        if (err) {
            console.error('Error writing tasks file:', err);
            return res.status(500).send('Error saving task');
        }
        res.status(201).json(newTask);
    });
});

// Update a task
app.put('/tasks/:id', authenticateToken, (req, res) => {
    const taskId = req.params.id;
    const { title, description } = req.body;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].title = title;
        tasks[taskIndex].description = description;
        tasks[taskIndex].updateDate = generateTimestamp();
        fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2), err => {
            if (err) {
                console.error('Error writing tasks file:', err);
                return res.status(500).send('Error updating task');
            }
            res.status(200).json(tasks[taskIndex]);
        });
    } else {
        res.status(404).send('Task not found');
    }
});

// Delete a task
app.delete('/tasks/:id', authenticateToken, (req, res) => {
    const taskId = req.params.id;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2), err => {
            if (err) {
                console.error('Error writing tasks file:', err);
                return res.status(500).send('Error deleting task');
            }
            res.status(200).send('Task deleted');
        });
    } else {
        res.status(404).send('Task not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
