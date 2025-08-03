import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Paperclip, Send, Smile, Phone, Video, X } from 'lucide-react';
import FormSB from './FormSB';

// Main App Component
function FormDB() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // For responsiveness
  const chatBodyRef = useRef(null); // Ref for scrolling to bottom

  // Dummy Data for Chats and Messages
  const chats = [
    { id: '1', name: 'Alice Smith', lastMessage: 'Hey, how are you?', time: '10:30 AM', avatar: 'https://placehold.co/40x40/FF5733/FFFFFF?text=AS' },
    { id: '2', name: 'Bob Johnson', lastMessage: 'See you tomorrow!', time: 'Yesterday', avatar: 'https://placehold.co/40x40/33FF57/FFFFFF?text=BJ' },
  ];

  const dummyMessages = {
    '1': [
      { id: 1, text: 'Hi Alice!', sender: 'me', time: '10:28 AM' },
      { id: 2, text: 'Hey, how are you?', sender: 'Alice Smith', time: '10:30 AM' },
      { id: 3, text: 'I am doing great, thanks! How about you?', sender: 'me', time: '10:35 AM' },
      { id: 4, text: 'I am good too! Just finishing up some work.', sender: 'Alice Smith', time: '10:40 AM' },
      { id: 5, text: 'Nice! Let me know if you want to grab lunch later.', sender: 'me', time: '10:45 AM' },
      { id: 6, text: 'Sure, sounds good!', sender: 'Alice Smith', time: '10:46 AM' },
      { id: 7, text: 'Adding more messages to test scrolling and sticky input!', sender: 'me', time: '10:47 AM' },
      { id: 8, text: 'This is another test message.', sender: 'Alice Smith', time: '10:48 AM' },
      { id: 9, text: 'And one more for good measure.', sender: 'me', time: '10:49 AM' },
      { id: 10, text: 'Okay, this should definitely make it scroll.', sender: 'Alice Smith', time: '10:50 AM' },
      { id: 11, text: 'Last one, promise!', sender: 'me', time: '10:51 AM' },
      { id: 12, text: 'Got it!', sender: 'Alice Smith', time: '10:52 AM' },
      { id: 13, text: 'Hello there!', sender: 'me', time: '10:53 AM' },
      { id: 14, text: 'General Kenobi!', sender: 'Alice Smith', time: '10:54 AM' },
      { id: 15, text: 'You are a bold one.', sender: 'me', time: '10:55 AM' },
      { id: 16, text: 'This is the way.', sender: 'Alice Smith', time: '10:56 AM' },
      { id: 17, text: 'The quick brown fox jumps over the lazy dog.', sender: 'me', time: '10:57 AM' },
      { id: 18, text: 'A classic test phrase.', sender: 'Alice Smith', time: '10:58 AM' },
      { id: 19, text: 'More content to fill the space and ensure scrolling works as expected.', sender: 'me', time: '10:59 AM' },
      { id: 20, text: 'Indeed, more content is always good for testing.', sender: 'Alice Smith', time: '11:00 AM' },
    ],
    '2': [
      { id: 1, text: 'Hey Bob, are we still on for tomorrow?', sender: 'me', time: 'Yesterday 5:00 PM' },
      { id: 2, text: 'Yes, absolutely! See you tomorrow!', sender: 'Bob Johnson', time: 'Yesterday 5:05 PM' },
    ],
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(dummyMessages[selectedChat.id] || []);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      const newMsg = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    if (window.innerWidth < 768) { // Close sidebar on mobile after selecting chat
      setIsSidebarOpen(false);
    }
  };

  return (
      <div className="flex flex-1"> {/* This flex container now holds sidebar and chat area */}
        {/* Sidebar */}
        <div className={`w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
          <FormSB
            chats={chats}
            selectedChat={selectedChat}
            handleChatSelect={handleChatSelect}
          />
        </div>
        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-gray-50 ${selectedChat ? 'block' : 'hidden'} md:block relative`}> {/* Added 'relative' here */}
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-red-400 text-white z-10"> {/* Added z-10 */}
                <div className="flex items-center">
                  <button
                    className="md:hidden mr-3 text-white focus:outline-none"
                    onClick={() => {setIsSidebarOpen(true); setSelectedChat(null);}}
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <img src={selectedChat.avatar} alt={selectedChat.name} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <h2 className="font-semibold text-lg">{selectedChat.name}</h2>
                    <p className="text-xs text-green-100">Online</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <MoreVertical className="w-5 h-5 cursor-pointer" />
                </div>
              </div>

              {/* Chat Body */}
              {/* Adjusted positioning to fill space between header and input */}
              <div
                id="chat-body"
                ref={chatBodyRef}
                className="absolute inset-0 top-[76px] bottom-[72px] p-6 overflow-y-auto bg-chat-pattern bg-cover bg-center"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex mb-4 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg shadow-md relative ${
                        msg.sender === 'me'
                          ? 'bg-green-200 text-gray-800 rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm mb-1">{msg.text}</p>
                      <span className="text-xs text-gray-500 absolute bottom-1 right-2">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
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
      </div>
  );
}

export default FormDB;
