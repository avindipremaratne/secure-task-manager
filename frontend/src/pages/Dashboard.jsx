import { useEffect, useState } from "react";
import { api } from "../api/client";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/api/tasks");
      setTasks(res.data.tasks || res.data);
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

  const handleEditChange = (e) => {
    setEditingTask({
      ...editingTask,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await api.put(`/api/tasks/${id}`, editingTask);
      setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
      setEditingTask(null);
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/tasks", newTask);
      setTasks([...tasks, res.data]);
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
      });
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
    const newStatus =
      currentStatus === "pending"
        ? "in-progress"
        : currentStatus === "in-progress"
          ? "completed"
          : "pending";
    try {
      const res = await api.put(`/api/tasks/${id}`, { status: newStatus });
      setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleGenerateDescription = async () => {
    if (!newTask.title) return;
    setAiLoading(true);
    try {
      const res = await api.post("/api/ai/generate-description", {
        title: newTask.title,
      });
      setNewTask({ ...newTask, description: res.data.description });
    } catch (err) {
      console.error("Failed to generate description:", err);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading Tasks...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Tasks</h1>

        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="title"
              placeholder="Task title"
              value={newTask.title}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <textarea
              name="description"
              placeholder="Task description"
              value={newTask.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
            <div className="flex gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500">Priority</label>
                <select
                  name="priority"
                  value={newTask.priority}
                  onChange={handleChange}
                  className="w-36 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="w-48 flex flex-col gap-1">
                <label className="text-sm text-gray-500">
                  Due Date (optional)
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={aiLoading || !newTask.title}
                className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aiLoading ? "Generating..." : "Generate Description"}
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition-colors"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-700">
              No tasks yet. Create your first one!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task._id} className="bg-white p-4 rounded-xl shadow">
                {editingTask?._id === task._id ? (
                  <div className="flex flex-col gap-2 w-full">
                    <input
                      type="text"
                      name="title"
                      value={editingTask.title}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <textarea
                      name="description"
                      value={editingTask.description || ""}
                      onChange={handleEditChange}
                      rows={2}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    />
                    <div className="flex gap-3">
                      <select
                        name="priority"
                        value={editingTask.priority}
                        onChange={handleEditChange}
                        className="w-36 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <input
                        type="date"
                        name="dueDate"
                        value={
                          editingTask.dueDate
                            ? editingTask.dueDate.substring(0, 10)
                            : ""
                        }
                        onChange={handleEditChange}
                        className="w-48 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(task._id)}
                        className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTask(null)}
                        className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <h2
                        className={`text-lg font-semibold ${
                          task.status === "completed"
                            ? "line-through text-gray-400"
                            : "text-gray-900"
                        }`}
                      >
                        {task.title}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {task.description || "No description"}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span
                          className={`px-3 py-1 text-sm rounded-full ${
                            task.priority === "high"
                              ? "bg-red-100 text-red-700"
                              : task.priority === "medium"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span
                          className={`px-3 py-1 text-sm rounded-full ${
                            task.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : task.status === "in-progress"
                                ? "bg-blue-100 text-blue-700"
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
                            : task.status === "in-progress"
                              ? "Mark Complete"
                              : "Mark In Progress"}
                        </button>
                        <button
                          onClick={() => setEditingTask(task)}
                          className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700"
                        >
                          Edit
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
                      <div className="text-sm text-gray-500 ml-4 whitespace-nowrap">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
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
