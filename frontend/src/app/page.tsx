"use client";

import { useEffect, useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  created_at: string;
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch tasks
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tasks");
        const data = await res.json();
        Promise.resolve().then(() => setTasks(data)); // Fix React 19 warning
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };
    loadTasks();
  }, []);

  // Add task
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      setTitle("");
      setDescription("");
      const res = await fetch("http://localhost:5000/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error adding task:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mark task as done
  const markAsDone = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}/done`, {
        method: "PUT",
      });
      const res = await fetch("http://localhost:5000/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error marking task as done:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-10">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT SIDE - Add Task Form */}
        <div className="bg-white shadow-md rounded-xl p-6 h-fit">
          <h2 className="text-2xl font-bold text-blue-700 mb-5">Add New Task</h2>
          <form onSubmit={addTask} className="space-y-4">
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              rows={3}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all"
            >
              {loading ? "Adding..." : "Add Task"}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE - Incomplete Tasks */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-5">
            Incomplete Tasks
          </h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500">No incomplete tasks ✨</p>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border border-gray-200 rounded-lg flex justify-between items-center hover:shadow-md transition-all"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {task.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {task.description || "No description"}
                    </p>
                  </div>
                  <button
                    onClick={() => markAsDone(task.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Done
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
