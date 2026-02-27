import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/tasks");
        setTasks(res.data);
      } catch (e) {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
  <div className="min-h-screen bg-gray-100 p-6">
    <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>

    {tasks.length === 0 ? (
      <div className="bg-white p-6 rounded-xl shadow">
        No tasks yet. Create your first one!
      </div>
    ) : (
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-lg">{task.title}</h2>
                <p className="text-sm text-gray-500">
                  {task.description || "No description"}
                </p>
              </div>

              <span className="text-sm px-3 py-1 rounded-full bg-gray-100">
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}