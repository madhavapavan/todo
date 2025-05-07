import { useState } from "react";
import axios from "axios";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { email, password }
        : { username, email, password };
      const res = await axios.post(`https://todo-kx52.onrender.com${endpoint}`, payload);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username || username);
      window.location.href = "/todos";
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="relative flex min-h-screen bg-linear-to-r from-gray-800 via-blue-700 to-gray-900 items-center justify-center p-4 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500">
      <h1 className="absolute top-20 text-white text-4xl font-bold z-10">The todo u all need</h1>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {!isLogin && (
            <input
              className="p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          )}
          <input
            className="p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            className="p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-600 text-sm text-center mt-4">
          {isLogin ? "Need an account?" : "Already have an account?"}
          <button
            className="text-blue-500 hover:underline ml-1"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setUsername("");
              setEmail("");
              setPassword("");
            }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;