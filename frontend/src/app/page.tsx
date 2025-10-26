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

const taskColors = [
  { bg: 'bg-gradient-to-br from-purple-50 to-purple-100', border: 'border-purple-500', accent: 'bg-purple-500', hover: 'hover:shadow-purple-200' },
  { bg: 'bg-gradient-to-br from-blue-50 to-blue-100', border: 'border-blue-500', accent: 'bg-blue-500', hover: 'hover:shadow-blue-200' },
  { bg: 'bg-gradient-to-br from-green-50 to-green-100', border: 'border-green-500', accent: 'bg-green-500', hover: 'hover:shadow-green-200' },
  { bg: 'bg-gradient-to-br from-orange-50 to-orange-100', border: 'border-orange-500', accent: 'bg-orange-500', hover: 'hover:shadow-orange-200' },
  { bg: 'bg-gradient-to-br from-pink-50 to-pink-100', border: 'border-pink-500', accent: 'bg-pink-500', hover: 'hover:shadow-pink-200' },
  { bg: 'bg-gradient-to-br from-teal-50 to-teal-100', border: 'border-teal-500', accent: 'bg-teal-500', hover: 'hover:shadow-teal-200' },
];

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

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
        setSelectedTaskId(null);
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

  const activeTasks = tasks.filter(t => !t.is_completed);
  const selectedTask = selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : null;
  const selectedTaskColor = selectedTask ? taskColors[selectedTask.id % taskColors.length] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex justify-center items-start py-12 px-4">
      <div className="max-w-7xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* LEFT SIDE - Add Task Form */}
            <div className={`p-8 lg:p-12 border-r ${selectedTask ? `border-l-8 ${selectedTaskColor?.border}` : 'border-gray-100'} ${selectedTask ? selectedTaskColor?.bg : 'bg-white'} flex flex-col transition-all duration-300`}>
              <div className="flex-1">
                <div className="mb-8">
                  <h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${selectedTask ? 'text-gray-800' : 'text-gray-900'}`}>
                    {selectedTask ? 'Task Details' : 'Add New Task'}
                  </h1>
                  <p className="text-gray-600">
                    {selectedTask ? 'Review your task information' : 'Create a new task to stay organized'}
                  </p>
                </div>

                {selectedTask ? (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                        Task Title
                      </label>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {selectedTask.title}
                      </h2>
                      
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                        Description
                      </label>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {selectedTask.description || "No description"}
                      </p>

                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                        Created
                      </label>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedTask.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => markAsDone(selectedTask.id, selectedTask.title)}
                        className="flex-1 bg-green-500 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-xl hover:-translate-y-0.5"
                      >
                        Mark as Done
                      </button>
                      <button
                        onClick={() => setSelectedTaskId(null)}
                        className="flex-1 bg-gray-200 text-gray-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-200 hover:-translate-y-0.5"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
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
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding Task...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Task
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDE - Tasks List */}
            <div className="p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-blue-50">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Your Tasks
                </h2>
                <p className="text-gray-500">
                  {activeTasks.length} active {activeTasks.length === 1 ? 'task' : 'tasks'}
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
                  activeTasks.map((task) => {
                    const colorScheme = taskColors[task.id % taskColors.length];
                    const isSelected = selectedTaskId === task.id;
                    
                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className={`${colorScheme.bg} rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 ${colorScheme.border} cursor-pointer group relative overflow-hidden ${isSelected ? 'ring-4 ring-offset-2 ring-gray-300 scale-[1.02]' : ''} ${colorScheme.hover}`}
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${colorScheme.accent} transition-all duration-300 ${isSelected ? 'w-2' : ''}`}></div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                              {task.title}
                            </h3>
                            <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                              {task.description || "No description"}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsDone(task.id, task.title);
                              }}
                              className="bg-white hover:bg-green-500 active:bg-green-600 border-2 border-green-500 text-green-600 hover:text-white active:text-white px-8 py-2.5 rounded-lg font-semibold focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-green-500/30 hover:-translate-y-0.5 whitespace-nowrap"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
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
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}