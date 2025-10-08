import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://todo-app-inlay-backend.vercel.app";

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Low",
    status: "Incomplete",
  });
  const [filter, setFilter] = useState({});

  const fetchTasks = async () => {
    const query = new URLSearchParams(filter).toString();
    const res = await axios.get(`${BASE_URL}/task?${query}`);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const handleAdd = async () => {
    if (!form.title || !form.description) return;
    await axios.post(`${BASE_URL}/task`, form);
    setForm({
      title: "",
      description: "",
      priority: "Low",
      status: "Incomplete",
    });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${BASE_URL}/task/${id}`);
    fetchTasks();
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === "Complete" ? "Incomplete" : "Complete";
    await axios.put(`${BASE_URL}/task/${task._id}`, {
      ...task,
      status: newStatus,
    });
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        To-Do App (Appinlay Task)
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-xl mx-auto">
        <input
          className="w-full mb-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="w-full mb-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="flex gap-3 mb-3">
          <select
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          onClick={handleAdd}
        >
          Add Task
        </button>
      </div>

      <div className="max-w-xl mx-auto mb-6 flex justify-between">
        <button
          className="bg-red-400 text-white py-1 px-3 rounded-md hover:bg-red-500 transition"
          onClick={() => setFilter({ priority: "High", status: "Incomplete" })}
        >
          Incomplete - High Priority Tasks
        </button>
        <button
          className="bg-gray-400 text-white py-1 px-3 rounded-md hover:bg-gray-500 transition"
          onClick={() => setFilter({})}
        >
          Clear Filters
        </button>
      </div>

      <ul className="max-w-xl mx-auto space-y-3">
        {tasks.map((t) => (
          <li
            key={t._id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <b className="text-gray-800">{t.title}</b> -{" "}
              <span className="text-gray-600">{t.description}</span>
              <div className="text-sm text-gray-500">
                {t.priority} | {t.status}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className={`py-1 px-3 rounded-md transition ${
                  t.status === "Complete"
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-green-400 hover:bg-green-500 text-white"
                }`}
                onClick={() => toggleStatus(t)}
              >
                {t.status === "Complete" ? "Mark Incomplete" : "Mark Complete"}
              </button>

              <button
                className="bg-red-400 text-white py-1 px-3 rounded-md hover:bg-red-600 transition"
                onClick={() => handleDelete(t._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
