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


  // Redirect to login page if registration is successful
  if (isRegistered) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-[url('/bg-dark.svg')] p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Register</h2>

        {/* Render all error messages */}
        {error && renderErrorMessages(error)}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            disabled={emailVerified}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400"
          />
        </div>

        {!emailVerified && (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full
                        disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            disabled={loading}
            onClick={handleSendOtp}
          >
            {loading ? "Getting OTP..." : "Get OTP"}
          </button>
        )}
        {emailVerified && (
          <p className="text-green-400 text-center mt-4 mb-4">
            ✔ Email Verified! Please complete registration.
          </p>
        )}

        {emailVerified && (
          <>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400"
              />
            </div>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full
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
        <p className="mt-4 text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-400 hover:text-blue-500 font-bold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;