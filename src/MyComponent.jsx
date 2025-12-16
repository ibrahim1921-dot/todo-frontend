import React, { useEffect, useState } from "react";
import { API_URL } from "./config";
function MyComponent() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState(null);


  //Fetch tasks from server on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
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
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  //Function to delete a task
  const handleDeleteTask = async (_id) => {
    //Logic to delete task
    try {
      const response = await fetch(`${API_URL}/${_id}`, {
        method: "DELETE",
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
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
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
      const res = await fetch(`${API_URL}/reorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  const isAddDisabled = newTask.trim().length === 0;

  return (
    <>
      <h1>TO-DO-LIST</h1>
      <div>
        <input
          className="inputBox"
          type="text"
          id="input-task"
          placeholder="add task..."
          value={newTask}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isAddDisabled) addTask();
          }}
        />
        <button
          className="add-button"
          onClick={addTask}
          disabled={isAddDisabled}
        >
          Add Task
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <ol>
        {tasks.map((task, index) => (
          <li key={task._id}>
            <div className="task-item">
              <input
                className="checkbox"
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task._id, task.completed)}
                aria-label={
                  task.completed
                    ? `Mark ${task.text} not completed`
                    : `Mark ${task.text} completed.`
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
              >
                👆
              </button>
              <button
                className="move-down-btn"
                onClick={() => handleMoveDownTask(index)}
                disabled={index === tasks.length - 1}
              >
                👇
              </button>
              <button
                onClick={() => handleDeleteTask(task._id)}
                className="delete-btn"
              >
                X
              </button>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
export default MyComponent;
