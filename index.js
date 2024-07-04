const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let tasks = [];
const tasksFilePath = path.join(__dirname, 'tasks.json');

// Function to get the current date and time as a string
const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return date + "|" + hours+":"+minutes;
};

// Load tasks from file on server start
const loadTasksFromFile = async () => {
    try {
        const data = await fs.readFile(tasksFilePath, 'utf8');
        tasks = data ? JSON.parse(data) : [];
        console.log('Tasks loaded from file:', tasks);
    } catch (err) {
        if (err.code === 'ENOENT') {
            try {
                await fs.writeFile(tasksFilePath, '[]', 'utf8');
                console.log('Tasks file created');
            } catch (writeErr) {
                console.error('Error creating tasks file:', writeErr);
            }
        } else {
            console.error('Error reading tasks file:', err);
        }
    }
};

// Save tasks to file
const saveTasksToFile = async () => {
    try {
        await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8');
        console.log('Tasks saved to file');
    } catch (err) {
        console.error('Error writing tasks file:', err);
    }
};

// Load tasks initially
loadTasksFromFile();

// Create a new task
app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    const task = {
        id: uuidv4(),
        title,
        description,
        createdAt: getCurrentDateTime(),
        updatedAt: '' // Initialize updatedAt as empty string
    };

    tasks.push(task);
    saveTasksToFile();
    res.status(201).json(task);
});

// Get all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Get a task by ID
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(task => task.id === req.params.id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
});

// Update a task by ID
app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(task => task.id === req.params.id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    task.title = title;
    task.description = description;
    task.updatedAt = getCurrentDateTime();
    saveTasksToFile();
    res.json(task);
});

// Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    saveTasksToFile();
    res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
