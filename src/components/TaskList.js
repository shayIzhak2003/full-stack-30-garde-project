import React from 'react';
// import './TaskList.css'; // Import the CSS file

const TaskList = ({ tasks }) => {
    return (
        <>
        <h1 className="fancy-heading animate-charcter ">To-Do List</h1>
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
                        </li>
                    ))}
                </ul>
            )}
        </div>
        </>
      
    );
};

export default TaskList;
