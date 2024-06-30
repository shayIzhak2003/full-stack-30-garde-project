import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import './App.css';

const App = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            console.log('Fetching tasks from server...');
            const response = await axios.get('http://localhost:3000/tasks');
            console.log('Response:', response.data);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    return (
        <div className="App">
            <h1 className="fancy-heading">To-Do List</h1>
            <div className="task-container">
                <TaskList tasks={tasks} />
            </div>
        </div>
    );
};

export default App;
