import './darkScroll.css'
import { Paperclip, Send, Settings, StepBack, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import {
  getChatMessages,
  getMembersList,
  deleteMessage,
  uploadFile,
} from "../features/chat/chatServices";
import {
  connectToChat,
  sendMessage,
  clearChatMessages,
  wsMessageReceived,
  disconnectFromChat,
} from "../features/websocket/websocketServices";
import LoadingScreen from "./LoadingScreen";
import {
  setSelectedChat,
  toggleIsGroupSettingOpen,
} from "../features/chat/chatSlice";
import GroupSettings from "./GroupSettings";
import { urlHelper } from "../utilities/utils";
import { v4 as uuidv4 } from "uuid";
import api from "../api/axios";


function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);

  if (diffWeek > 0) return `${diffWeek} week${diffWeek > 1 ? "s" : ""} ago`;
  if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  if (diffHr > 0) return `${diffHr} hr${diffHr > 1 ? "s" : ""} ago`;
  if (diffMin > 0) return `${diffMin} min${diffMin > 1 ? "s" : ""} ago`;
  return "just now";
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

const isImageFile = (url) => {
  if (!url) return false;
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
};

const getFileName = (url) => {
  if (!url) return "unknown";
  const parts = url.split("/");
  return parts[parts.length - 1] || "unknown";
};

/**
 * Helper to safely get message text regardless of backend field name.
 */
const getMsgText = (msg) => {
  return msg?.text_message ?? msg?.message ?? "";
};

/**
 * Helper to safely get file path/url regardless of backend field name.
 * Returns empty string when none present.
 */
const getMsgFile = (msg) => {
  return msg?.file_message ?? msg?.file ?? msg?.file_url ?? "";
};

const ChatMain = function ({ setIsSidebarOpen }) {
  // State variables
  const [newMessage, setNewMessage] = useState("");
  const [canMessage, setCanMessage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [file, setFile] = useState(null);

  // Redux hooks for state management
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const isGroupSettingOpen = useSelector(
    (state) => state.chat.isGroupSettingOpen
  );
  const loading = useSelector((state) => state.message.loading);
  const chatMessages = useSelector((state) => state.chat.chatMessages);
  const membersList = useSelector((state) => state.chat.membersList);
  const newMessages = useSelector((state) => state.message.messages);

  // Local state for messages to manage message updates
  const [messages, setMessages] = useState([]);
  const members = membersList["members"] || [];

  // Refs for managing DOM elements, used for auto-scrolling
  const chatBodyRef = useRef(null);
  const lastMessageRef = useRef(null);

  /**
   * Effect hook to connect to the chat WebSocket when a chat is selected.
   * Clears previous messages and fetches new ones.
   */
  useEffect(() => {
    if (!selectedChat) return;
    dispatch(connectToChat(selectedChat?.uid));
    dispatch(clearChatMessages());
    dispatch(getChatMessages(selectedChat?.uid));
    dispatch(getMembersList(selectedChat?.uid));
    if (isGroupSettingOpen) {
      dispatch(toggleIsGroupSettingOpen());
    }
    // Cleanup function to disconnect when the component unmounts or selected chat changes
    return () => {
      dispatch(disconnectFromChat());
    };
  }, [selectedChat, dispatch]);

  /**
   * Effect to update the local messages state when the Redux store's chatMessages change.
   */
  useEffect(() => {
    if (selectedChat && chatMessages[selectedChat?.uid]) {
      setMessages(chatMessages[selectedChat?.uid]);
    } else {
      setMessages([]);
    }
  }, [chatMessages, selectedChat]);

  // Define the menu items for message hover actions (Copy, Delete, Download)
  const menuItems = [
    {
      getName: (message_type) =>
        message_type === "file" ? "Download" : "Copy",
      style: "hover:text-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-800 dark:hover:text-white",
      action: async (msg) => {
        // Action to download a file or copy text to clipboard
        if (msg.message_type === "file" && msg.file_message) {
          try {
            const response = await api.get(
              `${urlHelper.getBaseUrl()}${msg.file_message}`,
              { responseType: "blob" }
            );

            const blobUrl = window.URL.createObjectURL(response.data);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = getFileName(msg.file_message);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
          } catch (err) {
            console.error("File download failed:", err);
          }
        } else {
          copyToClipboard(msg.text_message || msg.message);
        }
      },
    },
    {
      getName: (message_type) => "Delete",
      style: "hover:text-red-500 hover:bg-red-200 dark:hover:bg-red-800 dark:hover:text-white",
      action: (msg) => {
        // Action to delete a message after user confirmation
        const canDelete = window.confirm(
          "Are you sure you want to delete this message ?"
        );
        if (canDelete) {
          dispatch(deleteMessage(msg.uid));
          setMessages((prev) => prev.filter((m) => m.uid !== msg.uid));
        }
      },
    },
  ];

  /**
   * Effect to check the user's role in the group and determine if they can send messages.
   */
  useEffect(() => {
    if (members.length > 0) {
      const me = members.find((member) => member.member.id === user.id);
      if (me) {
        setCanMessage(me.role !== "reader");
      }
    }
  }, [members]);

  /**
   * Handles sending a new message, either text or a file.
   */
  const handleSendMessage = async () => {
    let newMsg = null;

    if (file && selectedChat) {
      try {
        const uploadedFileUrl = await dispatch(uploadFile(file)).unwrap();
        if (uploadedFileUrl.status !== true) {
          console.error("File upload failed:", uploadedFileUrl.message);
          return;
        }
        newMsg = {
          id: uuidv4(),
          message_type: "file",
          message: newMessage || "",
          sender: user.id,
          file_url: uploadedFileUrl?.data?.file_url, // actual URL from backend
        };
      } catch (err) {
        console.error("File upload failed:", err);
        return;
      }
    } else if (newMessage.trim() && selectedChat) {
      newMsg = {
        id: uuidv4(),
        message_type: "text",
        message: newMessage,
        sender: user.id,
      };
    }

    if (newMsg) {
      dispatch(sendMessage(newMsg));
      dispatch(
        wsMessageReceived({
          id: uuidv4(),
          group_id: selectedChat?.uid,
          type: newMsg.message_type,
          file: newMsg.file_url,
          message: newMsg.message,
          sender_id: user.id,
          sender_name: user.name,
          timestamp: new Date().toISOString(),
        })
      );
      // Clear the input and file preview after sending
      setNewMessage("");
      setFile(null);
    }
  };

  /**
   * Effect to auto-scroll to the last message when new messages are added.
   * It only scrolls if the user is already near the bottom of the chat.
   */
  useEffect(() => {
    const chatBody = chatBodyRef.current;
    const lastMsg = lastMessageRef.current;
    if (!chatBody || !lastMsg) return;

    // Detect if user is near the bottom
    const isNearBottom =
      chatBody.scrollHeight - chatBody.scrollTop - chatBody.clientHeight < 150;

    // Only scroll to bottom on first load or when user is near bottom
    if (isNearBottom) {
      lastMsg.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, newMessages]);


  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
    }
  };

  /**
   * Removes the selected file from the state.
   */
  const removeFile = () => {
    setFile(null);
  };

  // Conditional rendering for different states of the component
  if (loading) {
    return <LoadingScreen />;
  }

  if (!selectedChat) {
    return null;
  }

  // Render GroupSettings if the corresponding state is true
  if (isGroupSettingOpen) {
    return <GroupSettings chat={selectedChat} />;
  }

  // Main component render
  return (
    <div className="flex-1 bg-gray-900 md:block relative h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 text-gray-200 shadow-md mx-auto max-w-4xl font-sans overflow-hidden rounded-xl">
        <div className="flex items-center space-x-4 animate-slideInFromLeft">
          {/* Back button for mobile view */}
          <button
            className="md:hidden text-gray-400 focus:outline-none hover:text-emerald-500 transition-colors"
            onClick={() => {
              setIsSidebarOpen(true);
              dispatch(setSelectedChat(null));
            }}
          >
            <StepBack className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3">
            {/* Group profile picture */}
            <img
              src={
                selectedChat?.group_profile && selectedChat?.group_profile.image
                  ? `${urlHelper.getBaseUrl()}${selectedChat?.group_profile.image}`
                  : `https://placehold.co/40x40/FF5733/FFFFFF?text=${encodeURIComponent(
                      selectedChat?.group_name?.[0] ?? "G"
                    )}`
              }
              alt={selectedChat?.group_name}
              className="w-12 h-12 rounded-full object-cover shadow-sm"
            />
            {/* Group name and members list */}
            <div>
              <h2 className="font-bold text-lg text-gray-50">
                {selectedChat?.group_name}
              </h2>
              <p className="text-sm text-gray-400 truncate w-40 md:w-64">
                {members.map((member) => (
                  <span key={member.uid} className="mr-1">
                    {member.member.name} •
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
        {/* Settings button */}
        <div className="flex space-x-4 text-gray-400 animate-slideInFromRight">
          <Settings
            onClick={() => dispatch(toggleIsGroupSettingOpen())}
            className="w-5 h-5 cursor-pointer hover:text-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Scrollable Chat Body */}
      <div
        id="chat-body"
        ref={chatBodyRef}
        className="absolute top-[76px] bottom-[72px] left-6 right-6 overflow-y-auto p-6 bg-gray-900 bg-cover bg-center  hide-scrollbar"
      >
        {/* Render existing messages */}
        {messages.map((msg) => {
          const isOwnMessage = msg?.sent_by?.id === user.id;
          const fileUrl = getMsgFile(msg);
          return (
            <div
              key={msg.uid}
              className={`flex mb-2 ${
                isOwnMessage ? "justify-end" : "justify-start"
              }`}
            >
              <div className="relative group">
                {/* Message bubble */}
                <div
                  className={`p-2 rounded-lg max-w-lg ${
                    isOwnMessage
                      ? "bg-emerald-700 text-gray-50 text-right"
                      : "bg-gray-700 text-gray-50 text-left"
                  }`}
                >
                  {/* Sender name for other users' messages */}
                  {!isOwnMessage && (
                    <p className="text-xs font-semibold text-emerald-400 mb-1">
                      From: {msg?.sent_by?.name}
                    </p>
                  )}

                  {/* Message content based on type (file or text) */}
                  { (msg.message_type ?? msg.type) === "file" && fileUrl ? (
                    isImageFile(fileUrl) ? (
                      <img
                        src={`${urlHelper.getBaseUrl()}${fileUrl}`}
                        alt="sent"
                        className="max-w-xs object-cover rounded"
                        onClick={() =>
                          setPreviewImage(`${urlHelper.getBaseUrl()}${fileUrl}`)
                        }
                        onLoad={() => {
                          lastMessageRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "end",
                          });
                        }}
                      />
                    ) : (
                      <div className="flex items-center space-x-1">
                        <Paperclip className="w-5 h-5 text-gray-400" />
                        <a
                          href={`${urlHelper.getBaseUrl()}${fileUrl}`}
                          download
                          className="text-blue-400 underline inline-flex"
                        >
                          {getFileName(fileUrl) || "Download file"}
                        </a>
                      </div>
                    )
                  ) : (
                    <pre className="text-sm whitespace-pre-wrap break-words">
                      {getMsgText(msg)}
                    </pre>
                  )}

                  {/* Image preview modal */}
                  {previewImage && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                      <img
                        src={previewImage}
                        alt="preview"
                        className="max-h-[90%] max-w-[90%] object-contain"
                      />
                      <button
                        className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
                        onClick={() => setPreviewImage(null)}
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  )}

                  {/* Caption for files with text */}
                  {(msg.message_type ?? msg.type) === "file" &&
                    getMsgText(msg) && (
                      <pre className="text-sm whitespace-pre-wrap break-words mt-1">
                        {getMsgText(msg)}
                      </pre>
                    )}

                  {/* Timestamp */}
                  <p className="text-[10px] text-gray-400 mt-1">
                    {timeAgo(msg.created_at)}
                  </p>
                </div>
                {/* Hover menu for message actions */}
                <div
                  className={`absolute top-0 ${
                    isOwnMessage ? "left-0" : "right-0"
                  } hidden group-hover:flex flex-col bg-gray-800 shadow-md rounded z-10`}
                >
                  {menuItems.map((item) => (
                    <button
                      key={item.getName(msg.message_type)}
                      className={`px-2 py-1 text-xs text-gray-200 ${item.style}`}
                      onClick={() => item.action(msg)}
                    >
                      {item.getName(msg.message_type)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        {/* Render new messages from WebSocket */}
        {newMessages &&
          newMessages.map((msg) => {
            const isOwnMessage = msg.sender_id === user.id;
            return (
              <div
                key={msg.id}
                className={`flex mb-2 ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-lg max-w-sm ${
                    isOwnMessage
                      ? "bg-emerald-700 text-gray-50 text-right"
                      : "bg-gray-700 text-gray-50 text-left"
                  }`}
                >
                  {/* Sender name for new messages */}
                  {!isOwnMessage && (
                    <p className="text-xs font-semibold text-emerald-400 mb-1">
                      From: {msg?.sender_name}
                    </p>
                  )}
                  {/* Content for new messages */}
                  {msg.type === "file" || msg.message_type === "file" ? (
                    isImageFile(msg.file) ? (
                      <img
                        src={`${urlHelper.getBaseUrl()}${msg.file}`}
                        alt="sent"
                        className="max-w-52 object-cover rounded"
                        onClick={() =>
                          setPreviewImage(
                            `${urlHelper.getBaseUrl()}${msg.file}`
                          )
                        }
                        onLoad={() => {
                          lastMessageRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "end",
                          });
                        }}
                      />
                    ) : (
                      <div className="flex items-center space-x-1">
                        <Paperclip className="w-5 h-5 text-gray-400" />
                        <a
                          href={`${urlHelper.getBaseUrl()}${msg.file}`}
                          download
                          className="text-blue-400 underline inline-flex"
                        >
                          {getFileName(msg.file) || "Download file"}
                        </a>
                      </div>
                    )
                  ) : (
                    <pre className="text-sm whitespace-pre-wrap break-words">
                      {msg.message}
                    </pre>
                  )}
                  {/* Caption for new files with text */}
                  {msg.type === "file" && msg.message && (
                    <pre className="text-sm whitespace-pre-wrap break-words mt-1">
                      {msg.message}
                    </pre>
                  )}

                  {/* Image preview modal (re-rendered for new messages) */}
                  {previewImage && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                      <img
                        src={previewImage}
                        alt="preview"
                        className="max-h-[90%] max-w-[90%] object-contain"
                      />
                      <button
                        className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
                        onClick={() => setPreviewImage(null)}
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  )}

                  {/* Timestamp for new messages */}
                  <p className="text-[10px] text-gray-400 mt-1">
                    {timeAgo(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        {/* Empty div for auto-scrolling to the bottom */}
        <div ref={lastMessageRef} className="h-0"></div>
      </div>

      {/* Fixed Input Bar */}
      {canMessage ? (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-900 flex items-center h-[72px] z-10">
          {/* Hidden file input */}
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            className="hidden"
          />
          {/* File input label with icon */}
          <label htmlFor="fileInput" className="cursor-pointer mr-3">
            <Paperclip className="w-5 h-5 text-gray-400" />
          </label>
          {/* Message text input */}
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 px-4 py-2 rounded-full bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-50 placeholder-gray-400"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          {/* File preview */}
          {file && (
            <div className="relative flex items-center border rounded p-1 ml-2 border-gray-600">
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <span className="text-sm text-gray-50">{file.name}</span>
              )}
              <button
                onClick={removeFile}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* Send message button */}
          <button
            className={`p-2 rounded-2xl shadow-md bg-emerald-500 hover:bg-emerald-600  
                   text-white transition-colors flex items-center ml-2 justify-center
                   disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={handleSendMessage}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      ) : (
        // UI for read-only groups
        <div className="absolute flex flex-col items-center justify-center bottom-0 right-0 left-0 p-4 border-t-2 border-red-500 z-10 bg-gray-800 shadow-lg">
          <p className="text-lg text-red-400 text-center font-semibold">
            You are not allowed to message in this group.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatMain;