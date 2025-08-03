import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, verifyOtp, register } from '../features/auth/authUtils';
import { setError } from '../features/auth/authSlice';
import OTPModal from '../components/OTPModal';
import { Navigate } from 'react-router-dom'; // Ensure Navigate is imported for redirection

const Register = () => {
  const dispatch = useDispatch();
  const { emailVerified, error, loading, isRegistered } = useSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      dispatch(setError("Please enter your email."));
    } else {
      await dispatch(sendOtp(email));
      setShowModal(true);
    }
  };

  const handleVerifyOtp = async () => {
    await dispatch(verifyOtp({ email, otp }));
    setShowModal(false);
  };

  const handleRegister = async () => {
    await dispatch(register({ email, name, password }));
  };

  // Helper function to render error messages (reused from previous interactions)
  const renderErrorMessages = (errorObj) => {
    if (!errorObj) return null;

    if (typeof errorObj === 'string') {
      return <p className="text-red-500 text-sm mt-2">{errorObj}</p>;
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
    return null;
  };

  // Redirect to login page if registration is successful
  if (isRegistered) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>

        {/* Render all error messages */}
        {error && renderErrorMessages(error)}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            disabled={emailVerified}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {!emailVerified && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            disabled={loading}
            onClick={handleSendOtp}
          >
            {loading ? "Getting OTP..." : "Get OTP"}
          </button>
        )}
        {emailVerified && (
          <p className="text-green-500 text-center mt-4 mb-4">
            ✔ Email Verified! Please complete registration.
          </p>
        )}

        {emailVerified && (
          <>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
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
                placeholder="Choose a password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              disabled={loading}
              onClick={handleRegister}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </>
        )}

        {showModal && !emailVerified && (
          <OTPModal
            otp={otp}
            setOtp={setOtp}
            onSubmit={handleVerifyOtp}
            onClose={() => setShowModal(false)}
          />
        )}

        {/* Optional: Link to login page */}
        <p className="mt-4 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:text-blue-700 font-bold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
