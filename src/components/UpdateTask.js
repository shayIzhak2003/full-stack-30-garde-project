import React, { useState, useEffect } from 'react';
import './UpdateTask.css';

const UpdateTask = ({ task, onUpdate, onCancel }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);

    useEffect(() => {
        setTitle(task.title);
        setDescription(task.description);
    }, [task]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !description) {
            alert("You need to enter both title and description to update the task.");
            return;
        }
        onUpdate({ ...task, title, description });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Update Task</h2>
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
            <button type="submit">Update Task</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

export default UpdateTask;
