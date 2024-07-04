import React from 'react';
import './TaskList.css';

const TaskList = ({ tasks, onDelete, onUpdate }) => {
    return (
        <div className="task-container">
            <h1 className="fancy-heading animate-character">Task List</h1>
            <ul>
                {tasks.length === 0 ? (
                    <p>No tasks available.</p>
                ) : (
                    tasks.map((task) => (
                        <li key={task.id}>
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            <p><small>Created at: {task.createdAt}</small></p>
                            {task.updatedAt && task.updatedAt.length > 0 ? (
                                <p><small style={{color:"green"}}>Updated at: {task.updatedAt}</small></p>
                            ) : null}
                            <button onClick={() => onUpdate(task)}>Update</button>
                            <button type="button" onClick={() => onDelete(task.id)}>Delete</button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default TaskList;
