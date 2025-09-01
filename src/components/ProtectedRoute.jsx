// src/components/ProtectedRoute.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { fetchUser } from "../features/auth/authUtils";
import { setLoadState, setError } from "../features/auth/authSlice";

const ProtectedRoute = function ({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(setLoadState(false));
    dispatch(setError(null));
  }, [dispatch]);
  const { user, isAuthenticated, loading, accessExpiry, error } = useSelector(
    (state) => state.auth
  );

  const renderErrorMessages = (errorObj) => {
    if (!errorObj) return null;

    // If it's just a plain string
    if (typeof errorObj === "string") {
      return <p className="text-red-500 text-sm mt-2">{errorObj}</p>;
    }

    // If it has a .message property
    if (
      typeof errorObj === "object" &&
      errorObj !== null &&
      "message" in errorObj
    ) {
      // If message is a string → render directly
      if (typeof errorObj.message === "string") {
        return <p className="text-red-500 text-sm mt-2">{errorObj.message}</p>;
      }

      // If message is an object → treat it like DRF serializer errors
      if (typeof errorObj.message === "object" && errorObj.message !== null) {
        return (
          <ul className="text-red-500 text-sm mt-2 list-disc list-inside">
            {Object.entries(errorObj.message).map(([field, messages]) => (
              <li key={field}>
                <strong>{field}:</strong>{" "}
                {Array.isArray(messages)
                  ? messages.join("; ")
                  : String(messages)}
              </li>
            ))}
          </ul>
        );
      }
    }

    // If it's a DRF serializer error directly
    if (
      typeof errorObj === "object" &&
      errorObj !== null &&
      Object.keys(errorObj).length > 0
    ) {
      return (
        <ul className="text-red-500 text-sm mt-2 list-disc list-inside">
          {Object.entries(errorObj).map(([field, messages]) => (
            <li key={field}>
              <strong>{field}:</strong>{" "}
              {Array.isArray(messages) ? messages.join("; ") : String(messages)}
            </li>
          ))}
        </ul>
      );
    }

    return null;
  };

  useEffect(() => {
    if (accessExpiry && !user && !loading && !error) {
      dispatch(fetchUser());
    }
  }, [accessExpiry, user, loading, error, isAuthenticated, dispatch]);

  if (error && isAuthenticated === false && !user) {
    const errorMessage = renderErrorMessages(error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 bg-[url('/bg-dark.svg')] text-red-700 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
          <p>{errorMessage}</p>
          <button
            onClick={() => {
              dispatch(clearAuth());
              navigate("/login");
            }}
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
      <div className="min-h-screen flex items-center justify-center bg-[url('/bg-dark.svg')] text-gray-700">
        <div className="text-xl font-semibold">Loading...</div>
        {/* Or a proper spinner component */}
      </div>
    );
  }

  if (isAuthenticated && user && !loading) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" replace />; // Use `replace` to prevent going back to protected route via browser back button
  }
};

export default ProtectedRoute;
