// src/components/ProtectedRoute.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchUser } from "../features/auth/authUtils";

const ProtectedRoute = function ({ children }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, accessToken, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (accessToken && !user && !loading && !error) {
      dispatch(fetchUser());
    }
  }, [accessToken, user, loading, error, isAuthenticated, dispatch]);


  if (error) {
    const errorMessage = typeof error === 'string' ? error : error.message || JSON.stringify(error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-700 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
          <p>{errorMessage}</p>
          <button
            onClick={() => dispatch(clearAuth())} // Assuming clearAuth resets error too
            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">
        <div className="text-xl font-semibold">Loading...</div> {/* Or a proper spinner component */}
      </div>
    );
  }

  if (isAuthenticated && user && !loading) {
    return <>{children}</>;
  }else {
    return <Navigate to="/login" replace />; // Use `replace` to prevent going back to protected route via browser back button
  }

  
};

export default ProtectedRoute;
