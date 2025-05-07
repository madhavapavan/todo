import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    console.log("Get Started button clicked, navigating to /login");
    try {
      navigate("/login");
    } catch (err) {
      console.error("Navigation failed, using fallback:", err);
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-blue-500 via-cyan-500 to-teal-500 flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4 animate-fade-in">
          Welcome to TaskMaster
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 animate-fade-in-delay">
          Organize your life with ease. Create, manage, and track your tasks in one place.
          Stay productive, stay on top!
        </p>
        <button
          onClick={handleGetStarted}
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Get Started
        </button>
      </div>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow animate-slide-up">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Prioritize Tasks</h3>
          <p className="text-gray-600">
            Categorize tasks by priority to focus on what matters most.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow animate-slide-up delay-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Organize with Categories</h3>
          <p className="text-gray-600">
            Group tasks into custom categories for better organization.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow animate-slide-up delay-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Track Progress</h3>
          <p className="text-gray-600">
            Mark tasks as complete and monitor your productivity.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Landing;

// Tailwind CSS animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .animate-fade-in {
    animation: fadeIn 1s ease-out;
  }
  .animate-fade-in-delay {
    animation: fadeIn 1s ease-out 0.3s forwards;
    opacity: 0;
  }
  .animate-slide-up {
    animation: slideUp 0.8s ease-out forwards;
  }
  .delay-100 {
    animation-delay: 0.1s;
  }
  .delay-200 {
    animation-delay: 0.2s;
  }
`;