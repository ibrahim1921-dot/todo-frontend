import React, { useEffect, useState } from "react";
import { API_URL } from "./config";
import { useNavigate } from "react-router-dom";
import AppBar from "./AppBar components/AppBar.jsx";
import "./MyComponent.css";
function MyComponent({setIsAuthenticated}) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();


  //Fetch tasks from server on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    // Clear any client-side state if necessary
    setIsAuthenticated(false);
    navigate("/login");
  }

  const fetchTasks = async () => {
    try {
      console.log("Fetching tasks from:", `${API_URL}/api/tasks`);
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session management
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Unauthorized access. Please log in.");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTasks(data);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching tasks", error);
      setError("Failed to fetch tasks. Please try again later.");
    }
  };

  //Function to add a task
  const addTask = async () => {
    const text = newTask.trim();
    if (!text) return;
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session management
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        await fetchTasks();
        setNewTask("");
      }
    } catch (error) {
      console.error("Error adding task", error);
      setError("Failed to add task. Please try again later.");
    }
  };

  //Function to delete a task
  const handleDeleteTask = async (_id) => {
     if (!_id || _id === "0" || _id === 0) {
       console.error("Error: Invalid task ID provided:", _id);
       setError("Failed to delete task: Invalid ID.");
       return;
     }
    //Logic to delete task
    try {
      const response = await fetch(`${API_URL}/api/tasks/${_id}`, {
        method: "DELETE",
        credentials: "include", // Include cookies for session management
      });

      if (response.ok || response.status === 204) {
        setTasks(tasks.filter((task) => task._id !== _id));
      } else {
        throw new Error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again later.");
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session management
        body: JSON.stringify({ completed: !currentStatus }),
      });
      if (response.ok) {
        setTasks(
          tasks.map((task) =>
            task._id === id ? { ...task, completed: !currentStatus } : task
          )
        );
      }
    } catch (error) {
      setError("Failed to update task. Please try again later.", error);
    }
  };

  //Function to reorder positions
  const updateTaskPositions = async (newTasks) => {
    try {
      const tasksWithPositions = newTasks.map((task, index) => ({
        id: task._id, // Use MongoDB _id, not array index
        position: index,
      }));
      const res = await fetch(`${API_URL}/api/tasks/reorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session management
        body: JSON.stringify({
          tasks: tasksWithPositions,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Reorder error", errorData);
        throw new Error(errorData.error || "Failed to reorder tasks");
      }

      const updatedTasks = await res.json();
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error reordering tasks:", error);
      setError(
        "Failed to update task positions. Please try again later.",
        error
      );
    }
  };

  // Move task up
  const handleMoveUpTask = async (index) => {
    if (index === 0) return; // Can't move up the first item

    const newTasks = [...tasks];
    [newTasks[index - 1], newTasks[index]] = [
      newTasks[index],
      newTasks[index - 1],
    ];

    //Update positions in backend
    await updateTaskPositions(newTasks);
  };

  //handle task movedown
  const handleMoveDownTask = async (index) => {
    if (index === tasks.length - 1) return; //Can't move down

    const newTasks = [...tasks];
    [newTasks[index], newTasks[index + 1]] = [
      newTasks[index + 1],
      newTasks[index],
    ];

    //Update positions in backend
    await updateTaskPositions(newTasks);
  };


   return (
     <div className="dashboard-container">
       <AppBar onLogout={handleLogout} />

       <div className="dashboard-content">
         <div className="to-do-list">
           <h1
             style={{
               color: "#667eea ",
               textAlign: "center",
               fontSize: "2.5rem",
               fontWeight: "bold",
             }}
           >
             My Tasks
           </h1>

           {error && (
             <div
               className="error-message"
             >
               {error}
             </div>
           )}

           <div className="add-task-section">
             <input
               type="text"
               placeholder="Enter a task..."
               value={newTask}
               onChange={(e) => setNewTask(e.target.value)}
               onKeyDown={(e) => e.key === "Enter" && addTask()}
             />
             <button className="add-button" onClick={addTask}>
               Add
             </button>
           </div>

           {/* Empty state when no tasks */}
           {tasks.length === 0 && !error && (
             <div className="empty-state">
               <div className="empty-state-icon">📝</div>
               <h3>No tasks yet</h3>
               <p>Add your first task to get started!</p>
             </div>
           )}

           <ol>
             {tasks.map((task, index) => (
               <li key={task._id}>
                 <div className="task-content">
                   <input
                     className="checkbox"
                     type="checkbox"
                     checked={task.completed}
                     onChange={() =>
                       handleToggleComplete(task._id, task.completed)
                     }
                   />
                   <span
                     className="text"
                     style={{
                       textDecoration: task.completed ? "line-through" : "none",
                       opacity: task.completed ? 0.6 : 1,
                       marginLeft: "8px",
                     }}
                   >
                     {task.text}
                   </span>
                 </div>
                 <div className="task-actions">
                   <button
                     className="move-up-btn"
                     onClick={() => handleMoveUpTask(index)}
                     disabled={index === 0}
                     arial-label="Move task up"
                   >
                     👆
                   </button>
                   <button
                     className="move-down-btn"
                     onClick={() => handleMoveDownTask(index)}
                     disabled={index === tasks.length - 1}
                     arial-label="Move task down"
                   >
                     👇
                   </button>
                   <button
                     className="delete-btn"
                     onClick={() => handleDeleteTask(task._id)}
                     aria-label="Delete task"
                   >
                     ✖
                   </button>
                 </div>
               </li>
             ))}
           </ol>
         </div>
       </div>
     </div>
   );
}
export default MyComponent;
