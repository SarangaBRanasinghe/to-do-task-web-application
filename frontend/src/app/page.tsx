"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`);
        const data = await res.json();
        console.log('Fetched tasks:', data);
        Promise.resolve().then(() => setTasks(data));
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load tasks",
          confirmButtonColor: "#3b82f6",
        });
      }
    };
    loadTasks();
  }, []);

  // Add task
  const addTask = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (!title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Title",
        text: "Please enter a task title",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }
    if (!description.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Description",
        text: "Please enter a task description",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }
    setLoading(true);
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    })
      .then(() => {
        setTitle("");
        setDescription("");
        Swal.fire({
          icon: "success",
          title: "Task Added!",
          text: "Your task has been created successfully",
          confirmButtonColor: "#3b82f6",
          timer: 2000,
          timerProgressBar: true,
        });
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`);
      })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => {
        console.error("Error adding task:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to add task",
          confirmButtonColor: "#3b82f6",
        });
      })
      .finally(() => setLoading(false));
  };

  // Mark task as done
  const markAsDone = (id: number, taskTitle: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}/done`, {
      method: "PUT",
    })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Task Completed!",
          text: `"${taskTitle}" has been marked as done`,
          confirmButtonColor: "#3b82f6",
          timer: 2000,
          timerProgressBar: true,
        });
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`);
      })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => {
        console.error("Error marking task as done:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to complete task",
          confirmButtonColor: "#3b82f6",
        });
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex justify-center items-start py-12 px-4">
      <div className="max-w-7xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* LEFT SIDE - Add Task Form */}
            <div className="p-8 lg:p-12 border-r border-gray-100 bg-white flex flex-col">
              <div className="flex-1">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Add New Task
                  </h1>
                  <p className="text-gray-500">Create a new task to stay organized</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <label 
                      htmlFor="title" 
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      placeholder="Enter task title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.shiftKey) {
                          e.preventDefault();
                          addTask();
                        }
                      }}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label 
                      htmlFor="description" 
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      placeholder="Add task details..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 resize-none"
                      rows={4}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addTask}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
                  >
                    {loading ? "Adding Task..." : "Add Task"}
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Tasks List */}
            <div className="p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-blue-50">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Your Tasks
                </h2>
                <p className="text-gray-500">
                  {tasks.filter(t => !t.is_completed).length} active tasks
                </p>
              </div>
              <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                {tasks.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-lg font-medium">No tasks yet</p>
                    <p className="text-gray-400 text-sm mt-1">Create your first task to get started</p>
                  </div>
                ) : (
                  tasks
                    .filter((task) => !task.is_completed)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 group"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {task.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {task.description || "No description"}
                            </p>
                          </div>
                          <button
                            onClick={() => markAsDone(task.id, task.title)}
                            className="flex-shrink-0 bg-white hover:bg-green-500 active:bg-green-600 border-2 border-green-500 text-green-600 hover:text-white active:text-white px-6 py-2.5 rounded-lg font-semibold focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-green-500/30 hover:-translate-y-0.5"
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

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}