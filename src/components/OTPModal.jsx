import React from 'react';

const OTPModal = ({ otp, setOtp, onSubmit, onClose }) => (
  // Fixed overlay for the modal
  // Changed background to a darker gray with a slight transparency
  <div className="fixed inset-0 bg-gray-900 bg-[url('/bg-dark.svg')] flex justify-center items-center z-50 p-4">
    {/* Modal content container */}
    {/* Changed background to a dark gray, text to white */}
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-sm w-full transform transition-all duration-300 scale-100 opacity-100">
      {/* Changed heading text color to a lighter gray for contrast */}
      <h3 className="text-2xl font-bold text-gray-200 mb-4 text-center">Enter OTP</h3>

      {/* OTP Input Field */}
      {/* Changed input background to a darker gray, text to white, border to a lighter gray */}
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter 6-digit OTP"
        className="shadow appearance-none border rounded w-full py-3 px-4 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-outline text-center text-lg tracking-widest border-gray-600"
        maxLength="6" // Typically OTPs are 6 digits
        inputMode="numeric" // Suggests numeric keyboard on mobile
        pattern="[0-9]*" // Restricts input to numbers
      />

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        {/* Changed Cancel button colors to a dark theme palette */}
        <button
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-5 rounded-full shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
        >
          Cancel
        </button>
        {/* Changed Verify button colors for dark theme consistency */}
        <button
          onClick={onSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        >
          Verify
        </button>
      </div>
    </div>
  </div>
);

export default OTPModal;