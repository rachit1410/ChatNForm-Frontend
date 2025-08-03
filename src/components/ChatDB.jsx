import React, { useState, useEffect } from 'react';
import ChatSB from './ChatSB';
import { getChatList } from '../features/chat/chatServices'
import { useDispatch, useSelector } from 'react-redux';
import ChatMain from './ChatMain';
import AddGroup from './AddGroup';

// Main App Component
function ChatDB() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const addGroup = useSelector((state) => state.chat.addGroup);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.chat.loading);

  useEffect(() => {
    dispatch(getChatList());
  }, []);

  const chatGroups = useSelector((state) => state.chat.chatGroups)

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };


  return (
      <>
        <div className="flex flex-1"> {/* This flex container now holds sidebar and chat area */}
        {/* Sidebar */}
        <div className={`w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
          <ChatSB
            isSidebarOpen={isSidebarOpen}
            chats={chatGroups}
            selectedChat={selectedChat}
            handleChatSelect={handleChatSelect}
          />
        </div>
        {/* Chat Area */}
        {addGroup ? <AddGroup addGroup={addGroup}/> : <ChatMain
          selectedChat={selectedChat}
          setIsSidebarOpen={setIsSidebarOpen}
          setSelectedChat={setSelectedChat}/> }
      </div>
      </>
  );
}

export default ChatDB;
