import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authUtils";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaComments, FaTasks, FaUserPlus, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

// Helper component for rendering different types of error messages
const renderErrorMessages = (errorObj) => {
  if (!errorObj) return null;

  if (typeof errorObj === "string") {
    return <p className="text-red-400 text-sm mt-2">{errorObj}</p>;
  }

  if (typeof errorObj === "object" && errorObj !== null) {
    // Handling API error messages with a nested 'message' object
    const messages = errorObj.message || errorObj;
    if (typeof messages === "object" && messages !== null) {
      return (
        <ul className="text-red-400 text-sm mt-2 list-disc list-inside">
          {Object.entries(messages).map(([field, msgs]) => (
            <li key={field}>
              <strong>{field}:</strong> {Array.isArray(msgs) ? msgs.join("; ") : String(msgs)}
            </li>
          ))}
        </ul>
      );
    }
    // Handling simple string messages
    return <p className="text-red-400 text-sm mt-2">{messages}</p>;
  }
  return null;
};

// Main Home component
function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error } = useSelector(state => state.auth);

  const handleNavigateToDashboard = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 text-white p-4 font-sans min-w-full overflow-hidden min-h-screen fixed">
      
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto py-20 px-6">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-4 animate-fade-in-down">
          Chat, Collaborate, and Conquer Forms.
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8">
          Streamline your team's communication and data collection with our all-in-one platform.
        </p>
        
        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-10">
          {isAuthenticated ? (
            <>
              <button
                onClick={handleNavigateToDashboard}
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              >
                <FaComments className="mr-2" /> Go to Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/register"
                className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
              >
                <FaUserPlus className="mr-2" /> Get Started
              </a>
              <a
                href="/login"
                className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
              >
                <FaSignInAlt className="mr-2" /> Login
              </a>
            </>
          )}
        </div>
        
        {/* Development Status Indicator */}
        <div className="mt-4 text-lg text-gray-500">
          A project by <span className="font-semibold text-red-700">Rachit</span>
        </div>
      </div>

      {/* Optional: Add a features section */}
      <div className="w-full bg-gray-800 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10 text-white">Why Choose Our App?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-700 p-8 rounded-2xl shadow-xl transform transition-transform duration-300 hover:scale-105">
              <FaComments className="text-emerald-400 text-5xl mb-4 mx-auto" />
              <h3 className="text-2xl font-semibold mb-2 text-white">Real-time Chat</h3>
              <p className="text-gray-300">
                Keep your team connected with instant messaging, file sharing, and dedicated channels for every project.
              </p>
            </div>
            <div className="bg-gray-700 p-8 rounded-2xl shadow-xl transform transition-transform duration-300 hover:scale-105">
              <FaTasks className="text-red-400 text-5xl mb-4 mx-auto" />
              <h3 className="text-2xl font-semibold mb-2 text-white">Powerful Forms</h3>
              <p className="text-gray-300">
                Create custom forms to collect data, manage surveys, and automate your workflows effortlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Error Message Display */}
      {error && (
        <div className="mt-8 p-4 bg-red-900 bg-opacity-50 rounded-lg max-w-md w-full text-center shadow-lg">
          {renderErrorMessages(error)}
        </div>
      )}
    </div>
  );
}

export default Home;