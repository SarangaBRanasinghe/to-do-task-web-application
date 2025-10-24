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
        Promise.resolve().then(() => setTasks(data));
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };
    loadTasks();
  }, []);

  // Add task
  const addTask = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    
    fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    })
      .then(() => {
        setTitle("");
        setDescription("");
        return fetch("http://localhost:5000/api/tasks");
      })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error adding task:", err))
      .finally(() => setLoading(false));
  };

  // Mark task as done
  const markAsDone = (id: number) => {
    fetch(`http://localhost:5000/api/tasks/${id}/done`, {
      method: "PUT",
    })
      .then(() => fetch("http://localhost:5000/api/tasks"))
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error marking task as done:", err));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-12 px-4">
      <div className="max-w-7xl w-full">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* LEFT SIDE - Add Task Form */}
            <div className="p-8 lg:p-12 border-r border-gray-200 bg-white flex flex-col">
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-gray-900 mb-8">
                  Add a Task
                </h1>
                <div className="space-y-6">
                  <div>
                    <label 
                      htmlFor="title" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      placeholder=""
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.shiftKey) {
                          e.preventDefault();
                          addTask();
                        }
                      }}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label 
                      htmlFor="description" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      placeholder=""
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      rows={4}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addTask}
                    disabled={loading}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    {loading ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Tasks List */}
            <div className="p-8 lg:p-12 bg-gray-50">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Tasks
              </h2>
              <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No tasks yet</p>
                  </div>
                ) : (
                  tasks
                    .filter((task) => !task.is_completed)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="bg-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {task.title}
                            </h3>
                            <p className="text-sm text-gray-700">
                              {task.description || "No description"}
                            </p>
                          </div>
                          <button
                            onClick={() => markAsDone(task.id)}
                            className="flex-shrink-0 bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all shadow-sm"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}