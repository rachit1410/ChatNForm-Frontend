import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Trash2,
  Plus,
  X,
  UserMinus,
  UserPlus,
  LogOut,
} from "lucide-react";
import {
  toggleIsGroupSettingOpen,
  setSelectedChat,
} from "../features/chat/chatSlice";
import {
  deleteGroup,
  addMemberToGroup,
  updateMember,
  deleteMember,
  getMembersList,
  updateChatGroup,
  getChatList,
  getJoinRequests,
  deleteJoinRequest,
  clearAllMessages,
} from "../features/chat/chatServices";
import { searchUser } from "../features/search/searchServices";
import { getRandomColorName } from "../utilities/utils";
import { resetSearch } from "../features/search/searchSlice";
import { urlHelper } from "../utilities/utils";
import { clearChatMessages } from "../features/websocket/websocketServices";
import AnimatedButton from "./AnimatedButton";

const GroupSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const membersList = useSelector((state) => state.chat.membersList);
  const hits = useSelector((state) => state.search.hits);
  const isOwner = selectedChat?.group_owner === user.id;
  const joinRequests = useSelector((state) => state.chat.joinRequests);
  const [isAdmin, setIsAdmin] = useState(null);

  const [members, setMembers] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(
    selectedChat.group_type === "private"
  );
  const [description, setDescription] = useState(
    selectedChat?.group_description || ""
  );
  const [profileImage, setProfileImage] = useState(
    selectedChat?.group_profile?.image
      ? `${urlHelper.getBaseUrl()}${selectedChat.group_profile.image}`
      : `https://placehold.co/100x100/${getRandomColorName()}/000000?text=${
          selectedChat.group_name?.[0] || "G"
        }`
  );
  const [showSaveButton, setShowSaveButton] = useState(false);

  useEffect(() => {
    if (membersList.members?.length > 0) {
      const filtered = membersList.members.map((m) => ({
        id: m.uid,
        name: m.member.name,
        profile: m.member.profile_image
          ? `${urlHelper.getBaseUrl()}${m.member.profile_image}`
          : `https://placehold.co/100x100/${getRandomColorName()}/000000?text=${
              m.member.name[0] || "U"
            }`,
        role: m.role,
      }));
      setMembers(filtered);
    } else {
      setMembers([]);
    }
  }, [membersList, selectedChat, dispatch]);

  useEffect(() => {
    if (membersList.members?.length > 0) {
      const me = membersList.members.find((m) => m.member.id === user.id);
      setIsAdmin(me.role === "admin");
    }
  }, [membersList]);

  const handleRejectRequest = (req) => {
    dispatch(
      deleteJoinRequest({
        requestId: req?.uid,
        groupId: null,
        deleteAll: false,
      })
    );
  };

  const handleAcceptRequest = (req) => {
    dispatch(
      addMemberToGroup({ groupId: req.group.uid, memberId: [req.sender.id] })
    );
    dispatch(
      deleteJoinRequest({
        requestId: req?.uid,
        groupId: null,
        deleteAll: false,
      })
    );
  };

  useEffect(() => {
    dispatch(getJoinRequests(selectedChat?.uid));
  }, [selectedChat]);

  const handleDeleteGroup = async () => {
    if (!selectedChat?.uid) return;
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        await dispatch(deleteGroup(selectedChat.uid)).unwrap();
        dispatch(toggleIsGroupSettingOpen(false));
        dispatch(setSelectedChat(null));
      } catch (err) {
        console.error("Failed to delete group:", err);
      }
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setLoading(true);
    if (value.length < 2) {
      dispatch(resetSearch());
      setLoading(false);
      return;
    }
    try {
      dispatch(searchUser(value));
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (user) => {
    try {
      dispatch(
        addMemberToGroup({ groupId: selectedChat.uid, memberId: [user.id] })
      );
      setQuery("");
      dispatch(resetSearch());
      setSearchOpen(false);
      dispatch(getMembersList(selectedChat.uid));
    } catch (err) {
      console.error("Failed to add member:", err);
    }
  };

  const handleRemoveMember = (id) => {
    const groupId = selectedChat?.uid;
    setMembers(members.filter((m) => m.id !== id));
    dispatch(deleteMember({ groupId, memberId: id }));
  };

  const handleRoleChange = (e, id) => {
    const newRole = e.target.value;
    const groupId = selectedChat?.uid;
    dispatch(updateMember({ groupId, memberId: id, newRole }));
    dispatch(getMembersList(selectedChat.uid));
  };

  const handleSaveChanges = async () => {
    try {
      await dispatch(
        updateChatGroup({
          uid: selectedChat?.uid,
          description,
          profile: profileImage instanceof File ? profileImage : null,
          type: isPrivate ? "private" : "public",
        })
      ).unwrap();
      setShowSaveButton(false);
      dispatch(toggleIsGroupSettingOpen(false));
      dispatch(setSelectedChat(null));
      dispatch(getChatList());
    } catch (err) {
      console.error("Failed to save changes:", err);
    }
  };

  const handleProfileChange = (e) => {
    setShowSaveButton(true);
    const file = e.target.files[0];
    if (file) setProfileImage(file);
  };

  const handleTogglePP = () => {
    setShowSaveButton(true);
    const toggle = window.confirm(
      "Are you sure you want to change visibility?"
    );
    if (toggle) {
      setIsPrivate(!isPrivate);
    }
  };

  const handleExitGroup = () => {
    if (!selectedChat?.uid) return;
    if (window.confirm("Are you sure you want to Exit this group?")) {
      try {
        const groupId = selectedChat?.uid;
        const memberId = members.find((m) => m.member.id === user.id);
        dispatch(deleteMember({ groupId, memberId }));
        dispatch(toggleIsGroupSettingOpen(false));
        dispatch(clearChatMessages());
        dispatch(setSelectedChat(null));
        dispatch(getChatList());
      } catch (err) {
        console.error("Failed to delete group:", err);
      }
    }
  };

  const handleClearMessages = () => {
    if (window.confirm("Are you sure you want to clear all messages?")) {
      dispatch(clearAllMessages(selectedChat?.uid));
    }
  };

  return (
    <div className="relative flex flex-col h-full max-h-screen bg-gray-900 text-gray-100 rounded-lg">
      {/* HEADER */}
      <div className="relative flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 shadow-sm">
        {/* Back */}
        <AnimatedButton
          onClick={() => dispatch(toggleIsGroupSettingOpen(false))}
          icon={ArrowLeft}
          label="Back"
          color="gray"
        />

        {/* Title always absolute center */}
        <h2 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-white">
          Group Settings
        </h2>

        <div className="flex gap-3">
          {/* Clear */}
          <AnimatedButton
            onClick={handleClearMessages}
            icon={X}
            label="Clear"
          />

          {isOwner ? (
            <AnimatedButton
              onClick={handleDeleteGroup}
              icon={Trash2}
              label="Delete"
            />
          ) : (
            <AnimatedButton
              onClick={handleExitGroup}
              icon={LogOut}
              label="Exit"
            />
          )}
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 py-4 font-sans">
        {/* Profile */}
        <div className="group relative flex flex-col items-center mb-8">
          <div className="relative w-32 h-32 mb-4">
            <img
              src={
                profileImage instanceof File
                  ? URL.createObjectURL(profileImage)
                  : profileImage
              }
              alt="User Profile"
              className="w-full h-full rounded-full object-cover shadow-lg border-4 border-gray-600 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
            />
            {isAdmin && (
              <div className="absolute inset-0 rounded-full bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-40" />
            )}
          </div>
          {isAdmin && (
            <label className="absolute inset-0 m-auto flex w-32 h-32 cursor-pointer items-center justify-center rounded-full backdrop-blur-sm bg-black/30 text-white opacity-0 transition-all duration-300 transform scale-0 group-hover:opacity-100 group-hover:scale-100 shadow-lg">
              <UserPlus className="w-8 h-8 text-white transition-all duration-300" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleProfileChange}
              />
            </label>
          )}
          <div className="flex justify-center m-2">
            <h1 className="text-4xl text-white">
              {selectedChat?.group_name}
            </h1>
          </div>
        </div>

        {/* Public/Private Toggle */}
        <div className="flex justify-center items-center mb-6">
          <button
            type="button"
            role="switch"
            aria-checked={isPrivate}
            disabled={!isAdmin}
            onClick={handleTogglePP}
            className="relative flex items-center h-10 w-48 rounded-full bg-gray-700 transition-colors duration-300 ease-in-out focus:outline-none"
          >
            <span
              className={`absolute top-0 left-0 h-10 w-1/2 rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                isPrivate
                  ? "translate-x-full bg-emerald-700"
                  : "translate-x-0 bg-red-700"
              }`}
            />
            <span
              className={`flex-1 text-center text-sm font-medium transition-colors ${
                !isPrivate ? "text-gray-100 opacity-50" : "text-white"
              }`}
            >
              Public
            </span>
            <span
              className={`flex-1 text-center text-sm font-medium transition-colors ${
                isPrivate ? "text-gray-100 opacity-50" : "text-white"
              }`}
            >
              Private
            </span>
          </button>
        </div>

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setShowSaveButton(true);
          }}
          disabled={!isAdmin}
          placeholder="description"
          className="w-full p-3 mb-5 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition bg-gray-800 text-white"
          rows={3}
        />
        {/* Save Button */}
        {isAdmin && (
          <div className="flex justify-center">
            {showSaveButton && (
              <button
                onClick={handleSaveChanges}
                className="w-full max-w-xs shadow-lg py-3 mb-4 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition"
              >
                Save Changes
              </button>
            )}
          </div>
        )}
        <div className="flex w-full gap-6 justify-center">
          {/* Members */}
          <div className="w-full max-w-lg p-6 bg-gray-800 rounded-2xl shadow-xl mb-6">
            <h3 className="font-bold text-2xl mb-5 text-gray-200">
              Group Members
            </h3>
            <ul className="space-y-4">
              {members.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between p-4 bg-gray-700 border border-gray-600 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={m.profile}
                      alt={m.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400"
                    />
                    <div className="flex flex-col">
                      <p className="font-semibold text-gray-200">{m.name}</p>
                      <select
                        value={m.role}
                        onChange={(e) => handleRoleChange(e, m.id)}
                        disabled={!isAdmin}
                        className="mt-1 text-xs font-medium text-gray-300 rounded-lg p-1 bg-gray-600 focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="regular">Regular</option>
                        <option value="admin">Admin</option>
                        <option value="reader">Reader</option>
                      </select>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleRemoveMember(m.id)}
                      className="p-2 text-red-400 hover:text-red-600 bg-red-900 rounded-full transition hover:bg-red-800"
                    >
                      <UserMinus size={20} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Join Requests */}
          {isAdmin && joinRequests && joinRequests?.length > 0 && (
            <div className="w-full max-w-lg p-6 bg-gray-800 rounded-2xl shadow-xl mb-6">
              <h3 className="font-bold text-2xl mb-5 text-gray-200">
                Join Requests
              </h3>
              <ul className="space-y-4">
                {joinRequests.map((req) => (
                  <li
                    key={req.uid}
                    className="flex items-center justify-between p-4 bg-gray-700 border border-gray-600 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          req.sender.profile_image
                            ? `${urlHelper.getBaseUrl()}${
                                req.sender.profile_image
                              }`
                            : `https://placehold.co/100x100/${getRandomColorName()}/000000?text=${
                                req.name?.[0] || "U"
                              }`
                        }
                        alt={req.sender.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400"
                      />
                      <p className="font-semibold text-gray-200">
                        {req.sender.name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-2 text-green-400 hover:text-green-600 bg-green-900 rounded-full transition hover:bg-green-800"
                        onClick={() => {
                          handleAcceptRequest(req);
                        }}
                      >
                        <UserPlus size={20} />
                      </button>
                      <button
                        className="p-2 text-red-400 hover:text-red-600 bg-red-900 rounded-full transition hover:bg-red-800"
                        onClick={() => {
                          handleRejectRequest(req);
                        }}
                      >
                        <UserMinus size={20} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Add Member */}
        {isAdmin && (
          <>
            {!searchOpen ? (
              <div className="flex justify-center">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition"
                >
                  <Plus size={16} /> Add Member
                </button>
              </div>
            ) : (
              <div className="relative mt-3 bg-gray-900 p-3 rounded-xl shadow max-w-md mx-auto">
                <div className="flex items-center gap-2 border border-gray-600 rounded-xl px-3 py-2">
                  <input
                    autoFocus
                    value={query}
                    onChange={handleSearch}
                    placeholder="Search users..."
                    className="flex-1 p-1 outline-none text-sm bg-transparent text-white"
                  />
                  <X
                    size={18}
                    className="cursor-pointer text-gray-400 hover:text-gray-200"
                    onClick={() => {
                      setSearchOpen(false);
                      setQuery("");
                      dispatch(resetSearch());
                    }}
                  />
                </div>
                {loading && (
                  <p className="text-sm text-gray-500 mt-2">Searching...</p>
                )}
                {!loading && hits.length > 0 && (
                  <ul className="mt-2 max-h-48 overflow-y-auto space-y-2">
                    {hits.map((user) => (
                      <li
                        key={user.id}
                        onClick={() => handleAdd(user)}
                        className="relative flex items-center justify-between p-2 rounded-xl transition cursor-pointer group hover:bg-emerald-700"
                      >
                        <p className="text-sm font-medium text-gray-100">
                          {user.name}
                        </p>
                        <span className="absolute right-2 hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white text-lg">
                          +
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GroupSettings;