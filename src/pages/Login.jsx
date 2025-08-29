import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authUtils';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Helper function to render error messages
  const renderErrorMessages = (errorObj) => {
    if (!errorObj) return null;

    // If it's just a plain string
    if (typeof errorObj === "string") {
      return <p className="text-red-400 text-sm mt-2">{errorObj}</p>;
    }

    // If it has a .message property
    if (
      typeof errorObj === "object" &&
      errorObj !== null &&
      "message" in errorObj
    ) {
      // If message is a string → render directly
      if (typeof errorObj.message === "string") {
        return <p className="text-red-400 text-sm mt-2">{errorObj.message}</p>;
      }

      // If message is an object → treat it like DRF serializer errors
      if (typeof errorObj.message === "object" && errorObj.message !== null) {
        return (
          <ul className="text-red-400 text-sm mt-2 list-disc list-inside">
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
        <ul className="text-red-400 text-sm mt-2 list-disc list-inside">
          {Object.entries(errorObj).map(([field, messages]) => (
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

    return null;
  };


  const validateEmail = (email) => {
    // Basic email validation regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = () => {
    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (isValid) {
      dispatch(login({ email, password }));
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    // Changed main background to a dark gray
    <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-[url('/bg-dark.svg')] p-4">
      {/* Changed card background to a slightly lighter dark gray */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        {/* Changed heading text color */}
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>

        {error && renderErrorMessages(error)}

        <div className="mb-4">
          {/* Changed label text color */}
          <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
            Email
          </label>
          {/* Changed input background and text color, updated placeholder color */}
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400"
          />
          {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
        </div>

        <div className="mb-6">
          {/* Changed label text color */}
          <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
            Password
          </label>
          {/* Changed input background and text color, updated placeholder color */}
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400"
          />
          {passwordError && <p className="text-red-400 text-sm mt-1">{passwordError}</p>}
          <p className="text-gray-400 no-underline text-sm mt-4 hover:text-blue-400 cursor-pointer" onClick={() => navigate('/account/change-password')}>Forgot your password?</p>
        </div>
        

        {/* Changed button colors for dark mode */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full
                    disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Changed link text and color */}
        <p className="mt-4 text-center text-gray-400 text-sm">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-400 hover:text-blue-500 font-bold">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;