import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useMemo, useEffect } from "react";
import Landing from "./pages/Landing.jsx";
import Auth from "./pages/Auth.jsx";
import Todo from "./pages/Todo.jsx";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const isAuthenticated = useMemo(() => !!localStorage.getItem("token"), [location.pathname]);
  return isAuthenticated ? children : <Navigate to="/" replace state={{ from: location }} />;
}

function RouterContent() {
  const location = useLocation();
  useEffect(() => {
    console.log(`Navigated to: ${location.pathname}`);
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          localStorage.getItem("token") ? <Navigate to="/todos" replace /> : <Auth />
        }
      />
      <Route
        path="/todos"
        element={
          <ProtectedRoute>
            <Todo />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <RouterContent />
    </BrowserRouter>
  );
}

export default App;