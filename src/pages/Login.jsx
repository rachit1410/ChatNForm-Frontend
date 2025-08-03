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

    if (typeof errorObj === 'object' && errorObj.hasOwnProperty('message')) {
      console.log('Error Object:', errorObj);

      return <p className="text-red-500 text-sm mt-2">{errorObj.message}</p>;
    }

    if (typeof errorObj === 'object' && Object.keys(errorObj).length > 0) {
      return (
        <ul className="text-red-500 text-sm mt-2 list-disc list-inside">
          {Object.entries(errorObj).map(([field, messages]) => (
            <li key={field}>
              <strong>{field}:</strong>{' '}
              {Array.isArray(messages) ? (
                messages.map((msg, index) => (
                  <span key={index}>
                    {msg}
                    {index < messages.length - 1 && '; '}
                  </span>
                ))
              ) : (
                <span>{messages}</span>
              )}
            </li>
          ))}
        </ul>
      );
    }

    if (typeof errorObj === 'string') {
      return <p className="text-red-500 text-sm mt-2">{errorObj}</p>;
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        {error && renderErrorMessages(error)}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
          {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-500 hover:text-blue-700 font-bold">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;