import { MoreVertical, Smile, Paperclip, Send , X, Settings} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {useEffect, useState, useRef} from "react";
import { getChatMessages, getMembersList } from "../features/chat/chatServices";

function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    const diffWeek = Math.floor(diffDay / 7);

    if (diffWeek > 0) return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`;
    if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    if (diffHr > 0) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
    if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    return 'just now';
}

const ChatMain = function ({ selectedChat, setIsSidebarOpen, setSelectedChat }) {
    const [newMessage, setNewMessage] = useState('');
    const chatBodyRef = useRef(null);

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user)

    useEffect(() => {
        if (selectedChat) {
            dispatch(getChatMessages(selectedChat.uid));
            dispatch(getMembersList(selectedChat.uid));
        }
    }, [selectedChat]);

    const chatMessages = useSelector((state) => state.chat.chatMessages);
    
    const membersList = useSelector((state) => state.chat.membersList);
    const messages = chatMessages[selectedChat?.uid] || [];
    const members = membersList['members'] || [];

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const handleSendMessage = () => {
        if (newMessage.trim() && selectedChat) {
        const newMsg = {
            id: chatMessages.length + 1,
            text: newMessage,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setNewMessage('');
        }
    };


  return (
    <>
        <div className={`flex-1 flex flex-col bg-gray-50 ${selectedChat ? 'block' : 'hidden'} md:block relative`}> {/* Added 'relative' here */}
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-emerald-400 text-white z-10"> {/* Added z-10 */}
                <div className="flex items-center">
                  <button
                    className="md:hidden mr-3 text-white focus:outline-none"
                    onClick={() => {setIsSidebarOpen(true); setSelectedChat(null);}}
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <img src={
                    selectedChat.group_profile && selectedChat.group_profile.image
                      ? `${import.meta.env.VITE_DJANGO_URL}${selectedChat.group_profile.image}`
                      : `https://placehold.co/40x40/FF5733/FFFFFF?text=${selectedChat.group_name[0]}`
                  } alt={selectedChat.group_name} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <h2 className="font-semibold text-lg">{selectedChat.group_name}</h2>
                    <p className="text-xs text-green-100">
                        {members.map((member) => (
                          <span key={member.uid} className="mr-1">{member.member.name}, </span>
                        ))}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4">
                    <Settings className="w-5 h-5 cursor-pointer" />
                    <MoreVertical className="w-5 h-5 cursor-pointer" />
                </div>
              </div>

              {/* Chat Body */}

              <div
                id="chat-body"
                ref={chatBodyRef}
                className="absolute inset-0 top-[76px] bottom-[72px] p-6 overflow-y-auto bg-chat-pattern bg-cover bg-center"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.uid}
                    className={`flex mb-4 ${msg.sent_by === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg shadow-md relative ${
                        msg.sent_by === user.id
                          ? 'bg-green-200 text-gray-800 rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm mb-1">{msg.text_message}</p>
                      <span className="text-xs text-gray-500 absolute bottom-1 right-2">
                        {timeAgo(msg.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Positioned absolutely at the bottom */}
              <div className="p-4 border-t border-gray-200 bg-gray-100 flex items-center w-full absolute bottom-0 left-0 right-0 z-10"> {/* Added absolute, bottom-0, left-0, right-0, z-10 */}
                <Smile className="w-5 h-5 text-gray-500 cursor-pointer mr-3" />
                <Paperclip className="w-5 h-5 text-gray-500 cursor-pointer mr-3" />
                <input
                  type="text"
                  placeholder="Type a message"
                  className="flex-1 px-4 py-2 rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  className="ml-3 p-2 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  onClick={handleSendMessage}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
              Select a chat to start messaging
            </div>
          )}
        </div>
    </>
  );
};

export default ChatMain;
