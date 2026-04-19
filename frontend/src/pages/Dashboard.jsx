import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/api/tasks");
      setTasks(res.data);
    } catch (e) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/tasks", newTask);

      setTasks([...tasks, res.data]);
      setNewTask({ title: "", description: "" });
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    try {
      const res = await api.put(`/api/tasks/${id}`, { status: newStatus });
      setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  if (loading) return <div className="p-6">Loading Tasks...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>

        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            name="title"
            placeholder="Task title"
            value={newTask.title}
            onChange={handleChange}
            className="border p-2 mr-2 rounded"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Task description"
            value={newTask.description}
            onChange={handleChange}
            className="border p-2 mr-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Task
          </button>
        </form>

        {tasks.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-700">
              No tasks yet. Create your first one!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-start"
              >
                <div>
                  <h2 className="text-lg font-semibold">{task.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {task.description || "No description"}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                      {task.priority}
                    </span>
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {task.status}
                    </span>
                    <button
                      onClick={() => handleToggle(task._id, task.status)}
                      className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-700"
                    >
                      {task.status === "completed"
                        ? "Mark Pending"
                        : "Mark Complete"}
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this task?",
                          )
                        ) {
                          handleDelete(task._id);
                        }
                      }}
                      className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {task.dueDate && (
                  <div className="text-sm text-gray-500 ml-4">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
