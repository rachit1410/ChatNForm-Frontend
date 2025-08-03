import { useDispatch, useSelector } from "react-redux"; // Import useDispatch
import { logout } from "../features/auth/authUtils";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const dispatch = useDispatch(); // Initialize useDispatch hook
  const navigate = useNavigate()
  const { isAuthenticated, error } = useSelector(state => state.auth);

  const handleNavigateToDashboard = () => {
    navigate("/dashboard")
  }

  const handleLogout = () => {
    dispatch(logout());
  };

  const [dots, setDots] = useState(1)

  useEffect(() => {
    // Set up the interval
    const intervalId = setInterval(() => {
      // Use the functional update form of setDots to ensure you're always
      // working with the latest 'dots' state value.
      setDots(prevDots => {
        // If prevDots is 3 (meaning we have '...'), reset to 0 (for '')
        // Otherwise, increment prevDots
        return prevDots === 3 ? 0 : prevDots + 1;
      });
    }, 1000); // Update every 1000ms (1 second)

    // Clear the interval when the component unmounts or the effect re-runs
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Function to render the dots based on the 'dots' state
  const renderDots = () => {
    return '•'.repeat(dots);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-lg w-full transform transition-transform duration-500 hover:scale-105">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-6 animate-fade-in">
          Welcome Home!
        </h1>
        <p className="text-gray-700 text-lg mb-8">
          This is Home Page. Website in development {renderDots()}
        </p>

        {/* Conditionally render the Logout button if authenticated */}
        {isAuthenticated ? (
          <>
            <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
          >
            Logout
          </button>
          <button
            onClick={handleNavigateToDashboard}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 mx-2 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
          >
            Dashboard
          </button>
          </>
        ) : (
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="/login" // Assuming you have a /login route
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
            >
              Login
            </a>
            <a
              href="/register" // Assuming you have a /register route
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
            >
              Register
            </a>
          </div>
        )}
        { error && <div className="text-red-400 text-center p-2 text-3xl" >{error}</div> }
      </div>
    </div>
  );
}

export default Home;
