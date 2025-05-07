import { useEffect, useState, useRef } from "react";
import { MdOutlineDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Todo() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedPriority, setEditedPriority] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const navigate = useNavigate();
  const isLoggingOut = useRef(false);
  const logoutTimerRef = useRef(null);

  // Axios instance with auth header
  const api = axios.create({
    baseURL: "https://todo-kx52.onrender.com/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // Fetch username
  const fetchUsername = async () => {
    if (isLoggingOut.current || !localStorage.getItem("token")) return;
    try {
      const res = await api.get("/auth/me");
      setUsername(res.data.username);
      localStorage.setItem("username", res.data.username);
    } catch (err) {
      console.error("Error fetching username:", err.response?.data || err.message);
      if (err.response?.status === 401 || err.response?.status === 404) {
        handleLogout();
      }
    }
  };

  // Fetch todos
  const fetchTodos = async () => {
    if (isLoggingOut.current || !localStorage.getItem("token")) return;
    try {
      const res = await api.get("/todos");
      console.log("Fetched todos:", res.data);
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err.response?.data || err.message);
      if (err.response?.status === 401) handleLogout();
    }
  };

  // Logout function
  const handleLogout = () => {
    if (isLoggingOut.current) return;
    isLoggingOut.current = true;
    console.log("Initiating logout...");

    // Clear session timer
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    // Remove event listeners
    window.removeEventListener("click", resetTimer);
    window.removeEventListener("keypress", resetTimer);

    // Clear localStorage and state
    localStorage.clear();
    setUsername("");
    setTodos([]);

    // Navigate to landing page with increased delay
    setTimeout(() => {
      navigate("/", { replace: true });
      isLoggingOut.current = false;
    }, 300);
  };

  // Session timer reset function
  const resetTimer = () => {
    if (isLoggingOut.current) return;
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    logoutTimerRef.current = setTimeout(() => {
      handleLogout();
    }, 15 * 60 * 1000);
  };

  // Session management and initial fetches
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/", { replace: true });
      return;
    }

    fetchUsername();
    fetchTodos();

    logoutTimerRef.current = setTimeout(() => {
      handleLogout();
    }, 15 * 60 * 1000);

    window.addEventListener("click", resetTimer);
    window.addEventListener("keypress", resetTimer);

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("keypress", resetTimer);
    };
  }, [navigate]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim() || !priority) return;
    try {
      const response = await api.post("/todos", {
        text: newTodo,
        priority,
        category: category || null,
      });
      console.log("Added todo:", response.data);
      setTodos([...todos, response.data]);
      setNewTodo("");
      setPriority("");
      setCategory("");
    } catch (err) {
      console.error("Error adding todo:", err.response?.data || err.message);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      if (!todo) return;
      const res = await api.patch(`/todos/${id}`, {
        completed: !todo.completed,
      });
      console.log("Toggled todo:", res.data);
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Error toggling todo:", err.response?.data || err.message);
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
    setEditedPriority(todo.priority || "");
    setEditedCategory(todo.category || "");
  };

  const saveEditing = async (id) => {
    try {
      const res = await api.patch(`/todos/${id}`, {
        text: editedText,
        priority: editedPriority,
        category: editedCategory || null,
      });
      console.log("Updated todo:", res.data);
      setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
      setEditingTodo(null);
      setEditedText("");
      setEditedPriority("");
      setEditedCategory("");
    } catch (err) {
      console.error("Error saving edit:", err.response?.data || err.message);
    }
  };

  const delTodo = async (id) => {
    try {
      const res = await api.delete(`/todos/${id}`);
      console.log("Deleted todo:", res.data);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err.response?.data || err.message);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesPriority = filterPriority ? todo.priority === filterPriority : true;
    const matchesCategory = filterCategory ? todo.category === filterCategory : true;
    return matchesPriority && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-linear-to-r from-gray-800 via-blue-700 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            {username ? `Hello, welcome back ${username}` : "Task Manager"}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
          >
            Logout
          </button>
        </div>

        <form onSubmit={addTodo} className="flex flex-col gap-2 mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className="flex-1 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400 text-sm"
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              required
            />
            <select
              className="p-2 border border-gray-300 rounded-lg text-gray-700 text-sm"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <option value="">Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-700 text-sm"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category (optional)"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Add
            </button>
          </div>
        </form>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <select
            className="p-2 border border-gray-300 rounded-lg text-gray-700 text-sm"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-700 text-sm"
            type="text"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            placeholder="Filter by category"
          />
        </div>

        <div>
          {filteredTodos.length === 0 ? (
            <p className="text-gray-500 text-center text-sm">No tasks match your filters!</p>
          ) : (
            <ul className="space-y-2">
              {filteredTodos.map((todo) =>
                editingTodo === todo._id ? (
                  <li
                    key={todo._id}
                    className="flex flex-col gap-2 p-2 rounded-lg border border-gray-300 bg-gray-50"
                  >
                    <div className="flex gap-2">
                      <input
                        className="flex-1 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm"
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                      />
                      <select
                        className="p-2 border border-gray-300 rounded-lg text-gray-700 text-sm"
                        value={editedPriority}
                        onChange={(e) => setEditedPriority(e.target.value)}
                      >
                        <option value="">Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <input
                        className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-700 text-sm"
                        type="text"
                        value={editedCategory}
                        onChange={(e) => setEditedCategory(e.target.value)}
                        placeholder="Category (optional)"
                      />
                      <div className="flex gap-1">
                        <button
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          onClick={() => saveEditing(todo._id)}
                        >
                          <MdOutlineDone size={16} />
                        </button>
                        <button
                          className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                          onClick={() => setEditingTodo(null)}
                        >
                          <IoClose size={16} />
                        </button>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li
                    key={todo._id}
                    onClick={() => toggleTodo(todo._id)}
                    className={`flex items-center justify-between p-2 rounded-lg border text-sm ${
                      todo.priority === "high"
                        ? "bg-red-100 border-red-400"
                        : todo.priority === "medium"
                        ? "bg-yellow-100 border-yellow-400"
                        : "bg-green-100 border-green-400"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleTodo(todo._id)}
                        className={`h-4 w-4 border rounded-full flex items-center justify-center transition-colors ${
                          todo.completed
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {todo.completed && <MdOutlineDone size={12} className="text-white" />}
                      </button>
                      <span
                        className={`text-gray-700 ${
                          todo.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {todo.text} {todo.category && `(${todo.category})`}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        className="p-1 text-blue-500 hover:bg-gray-200 rounded-lg transition-colors"
                        onClick={() => startEditing(todo)}
                      >
                        <MdModeEditOutline size={16} />
                      </button>
                      <button
                        className="p-1 text-red-500 hover:bg-gray-200 rounded-lg transition-colors"
                        onClick={() => delTodo(todo._id)}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Todo;