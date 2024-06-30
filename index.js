const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path'); // Import path module
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let tasks = [];

const tasksFilePath = path.join(__dirname, 'tasks.json'); // Define path to tasks.json

// Load tasks from file on server start
fs.readFile(tasksFilePath, 'utf8', (err, data) => {
    if (err) {
        if (err.code === 'ENOENT') {
            // If file doesn't exist, create it with an empty array
            fs.writeFile(tasksFilePath, '[]', 'utf8', (err) => {
                if (err) {
                    console.error('Error creating tasks file:', err);
                } else {
                    console.log('Tasks file created');
                }
            });
        } else {
            console.error('Error reading tasks file:', err);
        }
    } else {
        try {
            tasks = data ? JSON.parse(data) : [];
            console.log('Tasks loaded from file:', tasks);
        } catch (error) {
            console.error('Error parsing tasks file, initializing with empty array:', error);
            tasks = [];
        }
    }
});

// Save tasks to file function
const saveTasksToFile = () => {
    fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing tasks file:', err);
        } else {
            console.log('Tasks saved to file');
        }
    });
};

// Add new task
app.post('/tasks', (req, res) => {
    const task = {
        id: uuidv4(),
        title: req.body.title,
        description: req.body.description,
    };
    tasks.push(task);
    saveTasksToFile();
    res.status(201).json(task);
});

// Get all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Get task by id
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(task => task.id === req.params.id);
    if (!task) {
        return res.status(404).send('Task not found');
    }
    res.json(task);
});

// Update task by id
app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(task => task.id === req.params.id);
    if (!task) {
        return res.status(404).send('Task not found');
    }
    task.title = req.body.title;
    task.description = req.body.description;
    saveTasksToFile();
    res.json(task);
});

// Delete task by id
app.delete('/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    if (taskIndex === -1) {
        return res.status(404).send('Task not found');
    }
    tasks.splice(taskIndex, 1);
    saveTasksToFile();
    res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
