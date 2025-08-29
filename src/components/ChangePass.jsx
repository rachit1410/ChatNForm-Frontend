import React, { useState, useEffect } from "react";
import OTPModal from "./OTPModal";
import { useSelector, useDispatch } from "react-redux";
import {
  forgotPassword,
  verifyOtpCp,
  changePassword,
} from "../features/auth/authUtils";
import { useNavigate } from "react-router-dom";

const ChangePass = () => {
  // State variables for form fields and UI steps
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [currentStep, setCurrentStep] = useState("email"); // 'email', 'password', 'success'
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const { error, isOtpCorrect } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      setMessage(error);
    }
  }, [error]);

  // Watch user and set email/OTP modal only once when user changes
  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const startSessionTimer = () => {
    const timer = setTimeout(() => {
      setCurrentStep("email");
      setMessage("Session expired. Please request a new OTP.");
      setOtp("");
    }, 25 * 60 * 1000); // 25 minutes

    return () => clearTimeout(timer);
  };

  // Handle "Send OTP" button click
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    setMessage("");
    dispatch(forgotPassword(email));
    setShowOtpModal(true);
  };

  // Handle OTP verification
  const handleOtpSubmit = () => {
    dispatch(verifyOtpCp({ email, otp }));

    if (!isOtpCorrect) {
      setMessage("OTP verification failed.");
      return;
    }
  };

  useEffect(() => {
    if (isOtpCorrect) {
      setShowOtpModal(false);
      setCurrentStep("password");
      setMessage("");
      setOtp("");
      startSessionTimer();
    }
  }, [isOtpCorrect]);

  // Handle password change
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    setMessage("");
    dispatch(changePassword({ email, newPassword }));
    setCurrentStep("success");
    setNewPassword("");
    setConfirmPassword("");
    setOtp("");
    navigate(-1);
  };

  // Render the appropriate form based on the current step
  const renderStep = () => {
    switch (currentStep) {
      case "email":
        return (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                disabled={user ? true : false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </div>
            {message && (
              <p className="text-red-400 text-sm text-center">{message}</p>
            )}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Send OTP
            </button>
          </form>
        );

      case "password":
        return (
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-300"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-700 text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={`
                    mt-4 rounded-lg block py-2 px-4 text-sm focus:outline-none text-gray-400 hover:text-gray-200 border-2
                    ${
                      showPassword
                        ? "border-gray-500 bg-gray-700 hover:bg-gray-600"
                        : "border-blue-500 hover:bg-blue-800 transition duration-200"
                    }
                  `}
              >
                {showPassword ? "Hide password" : "Show password"}
              </button>
            </div>
            {message && (
              <p className="text-red-400 text-sm text-center">{message}</p>
            )}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Change Password
            </button>
          </form>
        );

      case "success":
        return (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-green-400">
              Password Changed!
            </h2>
            <p className="text-gray-400">
              Your password has been successfully updated.
            </p>
            <button
              onClick={() => window.history.back()}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go Back
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 bg-[url('/bg-dark.svg')] flex items-center justify-center p-4 relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-gray-400 hover:text-gray-200 transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div className="bg-gray-800 text-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          Change Password
        </h1>
        {renderStep()}
      </div>
      {showOtpModal && (
        <OTPModal
          otp={otp}
          setOtp={setOtp}
          onSubmit={handleOtpSubmit}
          onClose={() => {
            setShowOtpModal(false);
            setOtp("");
          }}
        />
      )}
    </div>
  );
};

export default ChangePass;