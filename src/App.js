import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import UpdateTask from './components/UpdateTask';
import './App.css';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:3000/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const addTask = async (task) => {
        try {
            const response = await axios.post('http://localhost:3000/tasks', task);
            setTasks([...tasks, response.data]);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const updateTask = async (updatedTask) => {
        try {
            await axios.put(`http://localhost:3000/tasks/${updatedTask.id}`, updatedTask);
            setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
            setEditingTask(null);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/tasks/${id}`);
            setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className="App">
            <div className="task-container">
                <AddTask onAdd={addTask} />
                {editingTask ? (
                    <UpdateTask
                        task={editingTask}
                        onUpdate={updateTask}
                        onCancel={() => setEditingTask(null)}
                    />
                ) : (
                    <TaskList tasks={tasks} onDelete={deleteTask} onUpdate={setEditingTask} />
                )}
            </div>
        </div>
    );
};

export default App;
