import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import UpdateTask from './components/UpdateTask';
import Login from './components/Login';
import './App.css';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (accessToken) {
            fetchTasks();
        }
    }, [accessToken]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:3000/tasks', {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            setTasks(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError('Failed to fetch tasks.');
        }
    };

    const addTask = async (task) => {
        try {
            const response = await axios.post('http://localhost:3000/tasks', task, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            setTasks([...tasks, response.data]);
            setError('');
        } catch (error) {
            console.error('Error adding task:', error);
            setError('Failed to add task.');
        }
    };

    const updateTask = async (updatedTask) => {
        try {
            const response = await axios.put(`http://localhost:3000/tasks/${updatedTask.id}`, updatedTask, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            const updatedTasks = tasks.map(task => task.id === updatedTask.id ? response.data : task);
            setTasks(updatedTasks);
            setEditingTask(null);
            setError('');
        } catch (error) {
            console.error('Error updating task:', error);
            setError('Failed to update task.');
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/tasks/${id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            const updatedTasks = tasks.filter(task => task.id !== id);
            setTasks(updatedTasks);
            setError('');
        } catch (error) {
            console.error('Error deleting task:', error);
            setError('Failed to delete task.');
        }
    };

    const handleLoginSuccess = (accessToken) => {
        setAccessToken(accessToken);
        setError('');
    };

    const handleLogout = () => {
        setAccessToken(null);
        setTasks([]);
    };

    return (
        <div className="App">
            {!accessToken ? (
                <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
                <div className="task-container">
                    <button onClick={handleLogout}>Logout</button>
                    <AddTask onAdd={addTask} accessToken={accessToken} />
                    {editingTask ? (
                        <UpdateTask
                            task={editingTask}
                            onUpdate={updateTask}
                            onCancel={() => setEditingTask(null)}
                        />
                    ) : (
                        <TaskList tasks={tasks} onDelete={deleteTask} onUpdate={setEditingTask} />
                    )}
                    {error && <div className="error">{error}</div>}
                </div>
            )}
        </div>
    );
};

export default App;
