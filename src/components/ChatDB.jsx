import React, { useState, useEffect } from "react";
import ChatSB from "./ChatSB";
import { getChatList } from "../features/chat/chatServices";
import { useDispatch, useSelector } from "react-redux";
import ChatMain from "./ChatMain";
import AddGroup from "./AddGroup";
import { disconnectFromChat } from "../features/websocket/websocketServices";
import { setSelectedChat } from "../features/chat/chatSlice";

function ChatDB() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const addGroup = useSelector((state) => state.chat.addGroup);
    const dispatch = useDispatch();
    const selectedChat = useSelector((state) => state.chat.selectedChat);

    useEffect(() => {
        dispatch(getChatList());
    }, [dispatch]);

    const chatGroups = useSelector((state) => state.chat.chatGroups);

    const handleChatSelect = (chat) => {
        dispatch(disconnectFromChat());
        dispatch(setSelectedChat(chat));
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="flex flex-1 overflow-hidden h-full bg-gray-900 text-gray-100">
            {/* Sidebar */}
            <div
                className={`h-full w-full md:w-1/3 lg:w-1/4 bg-gray-800 border-r border-gray-700 flex flex-col ${
                    isSidebarOpen ? "block" : "hidden"
                } md:block`}
            >
                <ChatSB
                    isSidebarOpen={isSidebarOpen}
                    chats={chatGroups}
                    selectedChat={selectedChat}
                    handleChatSelect={handleChatSelect}
                />
            </div>

            {/* Chat Area */}
            <div className="flex-1 h-full">
                {addGroup ? (
                    <AddGroup addGroup={addGroup} />
                ) : (
                    <ChatMain setIsSidebarOpen={setIsSidebarOpen}/>
                )}
            </div>
        </div>
    );
}

export default ChatDB;