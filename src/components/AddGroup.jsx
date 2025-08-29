import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearNewGroup,
  toggleAddGroup,
  setNewGroupName,
  addMemberToNewGroup,
  removeMemberFromNewGroup,
  setNewGroupType,
  setNewGroupDescription,
} from "../features/chat/chatSlice";
import { resetSearch } from "../features/search/searchSlice";
import { searchUser } from "../features/search/searchServices";
import { Plus } from "lucide-react";
import { createChatGroup, getChatList } from "../features/chat/chatServices";

const AddGroup = function ({ addGroup }) {
  const dispatch = useDispatch();
  const { newGroup } = useSelector((state) => state.chat);
  const [profileImage, setProfileImage] = useState(null);

  const handleGroupNameChange = (e) => {
    dispatch(setNewGroupName(e.target.value));
  };

  const handleDiscard = () => {
    dispatch(clearNewGroup());
    dispatch(toggleAddGroup());
    dispatch(resetSearch());
  };

  const handleSearchUser = (e) => {
    const query = e.target.value;
    if (query.length > 2) {
      setTimeout(() => {
        dispatch(searchUser(query));
      }, 500);
    } else {
      dispatch(resetSearch());
    }
  };

  const handleProfileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleGroupTypeChange = (e) => {
    dispatch(setNewGroupType(e.target.value));
  };

  const handleGroupDescriptionChange = (e) => {
    dispatch(setNewGroupDescription(e.target.value));
  };

  const users = useSelector((state) => state.search.hits);

  const handleAddMember = (user) => {
    if (!newGroup.members.find((member) => member.id === user.id)) {
      dispatch(addMemberToNewGroup(user));
    }
  };

  const handleRemoveMember = (user) => {
    dispatch(removeMemberFromNewGroup(user));
  };

  const handleCreateGroup = () => {
    if (newGroup.name.trim() && newGroup.members.length > 0) {
      dispatch(
        createChatGroup({
          profile: profileImage,
          name: newGroup.name,
          members: newGroup.members,
          type: newGroup.type,
          description: newGroup.description,
        })
      );
      dispatch(clearNewGroup());
      dispatch(toggleAddGroup());
      dispatch(resetSearch());
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-[url('/bg-dark.svg')] z-30 ${
          addGroup ? "block" : "hidden"
        }`}
      >
        <div className="bg-gray-800 text-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
          <button
            className="absolute top-4 right-4 border-2 rounded-full hover:bg-red-800 p-2 hover:text-red-300 border-red-500 text-red-400"
            onClick={handleDiscard}
          >
            Discard
          </button>
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <label htmlFor="profile" className="cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-gray-600">
                  {profileImage ? (
                    <img
                      src={URL.createObjectURL(profileImage)}
                      alt="Profile Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  )}
                </div>
                <input
                  id="profile"
                  type="file"
                  name="profile"
                  className="hidden"
                  onChange={handleProfileChange}
                />
              </label>
              <span className="absolute bottom-2 right-2 bg-green-600 text-white rounded-full p-1 border-2 border-green-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </span>
            </div>
            <h1 className="text-2xl font-semibold mb-4 text-gray-200">
              Add New Group
            </h1>
            <input
              type="text"
              placeholder="Group Name"
              value={newGroup.name}
              onChange={handleGroupNameChange}
              className="border border-gray-600 p-2 rounded-md w-full mb-4 bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              className="border border-gray-600 p-2 rounded-md w-full mb-4 bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
              value={newGroup.type}
              onChange={handleGroupTypeChange}
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
            <textarea
              placeholder="Group Description"
              onChange={handleGroupDescriptionChange}
              className="border border-gray-600 p-2 rounded-md w-full mb-4 bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              value={newGroup.description}
            />
            <input
              type="text"
              placeholder="Search Members"
              onChange={handleSearchUser}
              className="border border-gray-600 p-2 rounded-md w-full mb-4 bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />

            {/* Display User List */}
            {users && users.length > 0 && (
              <div className="w-full">
                <h2 className="text-lg font-semibold mb-2 text-gray-200">
                  Search Results
                </h2>
                <ul>
                  {users.map((user) => (
                    <li
                      key={user.id}
                      className="flex items-center justify-between p-2 border-b border-gray-700 hover:bg-gray-700 relative transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <img
                          src={
                            user.profile ||
                            `https://placehold.co/40x40/FF5733/FFFFFF?text=${user.name[0]}`
                          }
                          alt={user.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="text-gray-200">{user.name}</span>
                      </div>
                      {/* Plus Icon on Hover */}
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 transition-opacity duration-200">
                        <button
                          onClick={() => handleAddMember(user)}
                          className="text-green-400 border border-green-400 rounded-full p-1 hover:bg-green-600 hover:text-white"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Display Added Members */}
            {newGroup.members.length > 0 && (
              <div className="w-full mt-4">
                <h2 className="text-lg font-semibold mb-2 text-gray-200">
                  Added Members
                </h2>
                <div className="flex flex-wrap">
                  {newGroup.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center bg-gray-700 rounded-full px-3 py-1 mr-2 mb-2"
                    >
                      <img
                        src={
                          member.profile ||
                          `https://placehold.co/40x40/FF5733/FFFFFF?text=${member.name[0]}`
                        }
                        alt={member.name}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span>{member.name}</span>
                      <button
                        onClick={() => handleRemoveMember(member)}
                        className="ml-2 text-red-400 hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full"
              onClick={handleCreateGroup}
            >
              Create Group
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddGroup;