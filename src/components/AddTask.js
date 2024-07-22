import React, { useState } from 'react';
import axios from 'axios';
import './AddTask.css';

const AddTask = ({ onAdd, accessToken }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) {
            alert("You need to enter both title and description to add a new task.");
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/tasks', 
            { title, description },
            { headers: { 'Authorization': `Bearer ${accessToken}` } });
            onAdd(response.data);
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Task</h2>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Add Task</button>
        </form>
    );
};

export default AddTask;
