import React from 'react';
import './TaskList.css';

const TaskList = ({ tasks, onDelete, onUpdate }) => {
    return (
        <div>
            <h2>Task List</h2>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p><small>Created at: {task.createdAt}</small></p>
                        <button onClick={() => onUpdate(task)}>Update</button>
                        <button type='button' onClick={() => onDelete(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
