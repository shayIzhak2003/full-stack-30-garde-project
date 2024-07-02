import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import './App.css';

const App = () => {
    const [tasks, setTasks] = useState([]);



    return (
        <div className="App">
            <div className="task-container">
                <TaskList tasks={tasks} />
            </div>
        </div>
    );
};

export default App;
