const OTPModal = ({ otp, setOtp, onSubmit, onClose }) => (
  // Fixed overlay for the modal
  <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
    {/* Modal content container */}
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full transform transition-all duration-300 scale-100 opacity-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Enter OTP</h3>

      {/* OTP Input Field */}
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter 6-digit OTP"
        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-outline text-center text-lg tracking-widest"
        maxLength="6" // Typically OTPs are 6 digits
        inputMode="numeric" // Suggests numeric keyboard on mobile
        pattern="[0-9]*" // Restricts input to numbers
      />

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-full shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
        >
          Cancel
        </button>
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
