import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authUtils";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaSave,
  FaArrowLeft,
  FaArrowRight,
  FaSignOutAlt,
  FaUsers,
  FaUserFriends,
} from "react-icons/fa";
import { getChatList } from "../features/chat/chatServices";
import { updateAccount } from "../features/auth/authUtils";
import { urlHelper } from "../utilities/utils";

/**
 * MyAccount component displays and manages the user's account information.
 * It allows the user to update their name and profile image, view their
 * owned and joined groups, and log out.
 */
function MyAccount() {
  // Hooks for state management and navigation
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state selectors to get user info, loading status, and messages
  const { user, isAuthenticated, loading, error, success } = useSelector(
    (state) => state.auth
  );
  const userGroups = useSelector((state) => state.chat.chatGroups);

  // Local state for UI and form data
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [name, setName] = useState(user.name);
  const [profile, setProfile] = useState(
    user.profile_image
      ? `${urlHelper.getBaseUrl()}${user.profile_image}`
      : `https://placehold.co/128x128/333333/FFFFFF?text=${
          user?.name ? user.name[0] : "U"
        }`
  );
  const [profileFile, setProfileFile] = useState(null); // File object for upload
  const [message, setMessage] = useState("");

  /**
   * Effect to show success or error messages after an account update.
   */
  useEffect(() => {
    if (success) {
      setMessage("Profile updated successfully!");
    }
    if (error) {
      setMessage(error);
    }
  }, [success, error]);

  /**
   * Effect to fetch the list of chat groups when the component mounts or
   * the user's authentication state changes.
   */
  useEffect(() => {
    dispatch(getChatList());
  }, [isAuthenticated, user, dispatch]);

  /**
   * Handles changes to the username input field.
   * @param {Event} e - The change event.
   */
  const handleNameChange = (e) => {
    setName(e.target.value);
    setShowSaveButton(true);
  };

  /**
   * Handles changes to the profile image file input.
   * Creates a local URL for preview and stores the file object for upload.
   * @param {Event} e - The change event.
   */
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      setProfile(URL.createObjectURL(file)); // Set the temporary image for preview
    }
    setShowSaveButton(true);
  };

  /**
   * Handles the form submission for updating the account.
   * Dispatches the updateAccount action and resets the save button state.
   * @param {Event} e - The form submission event.
   */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear message on new submission
    dispatch(updateAccount({ profile: profileFile, name: name }));
    setShowSaveButton(false);
  };

  /**
   * Handles user logout. Dispatches the logout action and navigates to the home page.
   */
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  /**
   * Navigates back to the previous page.
   */
  const handleGoBack = () => {
    navigate(-1);
  };

  // If the user is not authenticated, redirect them to the login page.
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  // Filter groups into 'My Groups' (owned) and 'Joined Groups'
  const myGroups = userGroups.filter((group) => group.group_owner === user.id);
  const joinedGroups = userGroups.filter(
    (group) => group.group_owner !== user.id
  );

  // Main component render
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 bg-[url('/bg-dark.svg')] bg-fixed text-white p-4 font-sans">
      <div className="w-full max-w-3xl p-8 bg-gray-800 rounded-2xl shadow-2xl relative">
        {/* Back and Logout Buttons */}
        <div className="absolute top-4 left-4">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-400 hover:text-white transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
        </div>
        <div className="absolute top-4 right-4">
          <button
            onClick={handleLogout}
            className="flex items-center text-red-500 hover:text-red-400 transition-colors duration-200"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <FaUserCircle className="text-emerald-500 text-6xl mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-50">My Account</h1>
          <p className="text-gray-400 mt-2">Manage your profile and settings</p>
        </div>

        {/* Profile Details Display (Card) */}
        <div className="p-6 bg-gray-700 rounded-xl mb-6 shadow-md">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                className="h-16 w-16 rounded-full ring-2 ring-gray-600 object-cover"
                src={profile}
                alt="Profile Placeholder"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-50">
                {user?.name || "Guest"}
              </h2>
              <p className="text-gray-400">{user?.email || "N/A"}</p>
            </div>
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate("/account/change-password");
              }}
              className="text-sm text-blue-500 hover:text-blue-400 font-semibold transition duration-300 ease-in-out ml-auto cursor-pointer"
            >
              Change password <FaArrowRight className="inline ml-1 w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Update Profile Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-400"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={name}
              onChange={handleNameChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 text-gray-50"
              required
            />
          </div>
          <div>
            <label
              htmlFor="profileImage"
              className="block text-sm font-medium text-gray-400"
            >
              Profile Image
            </label>
            <input
              type="file"
              name="profileImage"
              id="profileImage"
              onChange={handleProfileChange}
              className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-emerald-500 hover:file:bg-gray-600"
              accept="image/*"
            />
          </div>
          {showSaveButton && (
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition-all duration-300 transform text-white ${
                loading
                  ? "bg-emerald-900 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 hover:scale-105"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <FaSave className="mr-2" /> Save Changes
                </>
              )}
            </button>
          )}
        </form>

        {/* Message area */}
        {message && (
          <div className="mt-4 text-center">
            <p
              className={`text-sm ${error ? "text-red-500" : "text-emerald-500"}`}
            >
              {message}
            </p>
          </div>
        )}

        {/* Two-Column Group Layout */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* My Groups Section */}
          <div className="p-6 bg-gray-700 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <FaUsers className="text-gray-400 mr-2 text-xl" />
              <h3 className="text-xl font-semibold text-gray-50">My Groups</h3>
            </div>
            {myGroups.length > 0 ? (
              <ul className="space-y-3">
                {myGroups.map((group) => (
                  <li
                    key={group.uid}
                    className="flex justify-between items-center bg-gray-600 p-4 rounded-lg"
                  >
                    <span className="font-medium text-gray-50">
                      {group.group_name}
                    </span>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        group.group_type === "private"
                          ? "bg-emerald-400 text-gray-900"
                          : "bg-red-400 text-gray-900"
                      }`}
                    >
                      {group.group_type}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-center">
                You have not created any groups yet.
              </p>
            )}
          </div>

          {/* Joined Groups Section */}
          <div className="p-6 bg-gray-700 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <FaUserFriends className="text-gray-400 mr-2 text-xl" />
              <h3 className="text-xl font-semibold text-gray-50">
                Joined Groups
              </h3>
            </div>
            {joinedGroups.length > 0 ? (
              <ul className="space-y-3">
                {joinedGroups.map((group) => (
                  <li
                    key={group.uid}
                    className="flex justify-between items-center bg-gray-600 p-4 rounded-lg"
                  >
                    <span className="font-medium text-gray-50">
                      {group.group_name}
                    </span>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        group.group_type === "private"
                          ? "bg-emerald-400 text-gray-900"
                          : "bg-red-400 text-gray-900"
                      }`}
                    >
                      {group.group_type}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-center">
                You are not a member of any groups.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;