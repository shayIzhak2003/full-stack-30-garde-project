import React, { useState, useEffect } from 'react';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // Fetch tasks from the server
        const fetchTasks = async () => {
            try {
                const response = await fetch('http://localhost:3000/tasks');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTasks(data); 
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks(); 
    }, []);

    return (
        <>
            <h1 className="fancy-heading animate-charcter">To-Do List</h1>
            <div className="task-container">
                <h1>Tasks</h1>
                {tasks.length === 0 ? (
                    <p>No tasks available.</p>
                ) : (
                    <ul>
                        {tasks.map((task) => (
                            <li key={task.id}>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                               <small><p>created at :{task.createdAt}</p> </small> 
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

export default TaskList;
