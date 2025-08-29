import { Search, X, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchGroup } from "../features/search/searchServices";
import { resetSearch } from "../features/search/searchSlice";
import { sendJoinRequest } from "../features/chat/chatServices";
import { urlHelper } from "../utilities/utils";

const ChatSidebar = ({ chats = [], selectedChat = "", handleChatSelect }) => {
  // Format date as DD/MM/YYYY
  function formatTime(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  }

  // Component for the success message popup
  const MessagePopup = ({ message, visible }) => {
    return (
      <div
        className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border border-gray-700
        transition-opacity duration-700 ease-in-out 
        ${
          visible
            ? "opacity-100 bg-emerald-700 text-white"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <CheckCircle2 className="w-5 h-5 text-white" />
        <span className="font-medium">{message}</span>
      </div>
    );
  };

  // State for managing UI behavior
  const [requestSent, setRequestSent] = useState(false);
  const [isSeachOpen, setIsSearchOpen] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Redux hooks for state management
  const dispatch = useDispatch();
  const hits = useSelector((state) => state.search.hits);

  /**
   * Effect to manage the visibility and lifecycle of the success popup.
   * It shows the popup, then fades it out and resets the state.
   */
  useEffect(() => {
    let timeoutId;
    let hideTimeout;

    if (requestSent) {
      setPopupVisible(true);

      // first hide the popup (fade out)
      timeoutId = setTimeout(() => {
        setPopupVisible(false);
      }, 2500);

      // then fully reset the state after fade finishes
      hideTimeout = setTimeout(() => {
        setRequestSent(false);
      }, 3200);
    }

    // Cleanup function to prevent memory leaks
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(hideTimeout);
    };
  }, [requestSent]);

  /**
   * Opens the search bar and clears previous search results.
   */
  const handleSearchOpen = () => {
    setIsSearchOpen(true);
    dispatch(resetSearch());
  };

  /**
   * Closes the search bar and clears the search input and results.
   */
  const handleCancel = () => {
    setIsSearchOpen(false);
    dispatch(resetSearch());
    setSearchValue("");
  };

  /**
   * Handles the search input changes, dispatching a search action to Redux.
   */
  const onSearch = (e) => {
    let value = e.target.value;
    setSearchValue(value);
    if (value.trim() && value.length > 2) {
      dispatch(searchGroup(value));
    } else {
      dispatch(resetSearch());
      value = "";
    }
  };


  const handleSendRequest = (hit) => {
    if (hit && hit?.uid) {
      dispatch(sendJoinRequest(hit.uid));
      setRequestSent(true);
      handleCancel();
    }
  };

  // Main component render
  return (
    <div className="flex flex-col bg-gray-900 shadow-lg h-full w-full relative text-gray-200">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-700 bg-gray-900 sticky top-0 z-20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-700 border border-transparent focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all text-gray-50 placeholder-gray-400"
            onClick={handleSearchOpen}
            onChange={onSearch}
            value={searchValue}
          />
          {isSeachOpen && (
            <X
              onClick={handleCancel}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 cursor-pointer"
            />
          )}
        </div>
      </div>

      {/* Overlay for Search Results */}
      {isSeachOpen && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-95 z-10 mt-13 overflow-y-auto p-4 custom-scrollbar">
          {hits && hits.length > 0 ? (
            hits.map((hit) => (
              <div
                key={hit.uid}
                className="flex items-center p-3 mb-2 cursor-pointer hover:bg-gray-800 rounded-lg transition-all"
                onClick={() => {
                  handleSendRequest(hit);
                }}
              >
                <img
                  src={
                    hit.group_profile?.image
                      ? `${urlHelper.getBaseUrl()}${hit.group_profile.image}`
                      : `https://placehold.co/40x40/FF5733/FFFFFF?text=${
                          hit.group_name?.[0] || ""
                        }`
                  }
                  alt={hit.group_name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-700"
                />
                <div className="ml-3 flex-1">
                  <h3 className="font-medium text-gray-50">{hit.group_name}</h3>
                  <p className="text-xs text-emerald-500">
                    send join request to {hit.group_owner.name}
                  </p>
                </div>
              </div>
            ))
          ) : (
            isSeachOpen && searchValue.length > 2 && (
              <p className="text-center text-gray-400">No results found</p>
            )
          )}
        </div>
      )}

      {/* Success message popup */}
      <MessagePopup message="Request sent successfully!" visible={popupVisible} />

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar hide-scrollbar">
        {chats.map((chat) => {
          const isActive = selectedChat?.id === chat.uid;
          return (
            <div
              key={chat.uid}
              className={`flex items-center p-3 cursor-pointer transition-all rounded-lg ${
                isActive ? "bg-emerald-800 shadow-sm" : "hover:bg-gray-800"
              }`}
              onClick={() => handleChatSelect(chat)}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={
                    chat.group_profile?.image
                      ? `${import.meta.env.VITE_DJANGO_URL}${
                          chat.group_profile.image
                        }`
                      : `https://placehold.co/40x40/FF5733/FFFFFF?text=${
                          chat.group_name?.[0] || ""
                        }`
                  }
                  alt={chat.group_name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-700"
                />
                {isActive && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-gray-900 rounded-full"></span>
                )}
              </div>

              <div className="flex-1 ml-4">
                <h3 className="font-semibold text-gray-50 line-clamp-1">
                  {chat.group_name}
                </h3>
              </div>
              <span className="text-xs text-gray-400 ml-3 whitespace-nowrap">
                {formatTime(chat.created_at)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSidebar;