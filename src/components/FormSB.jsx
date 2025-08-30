import { Search } from "lucide-react"

const FormSB = function ({ chats = [], selectedChat, handleChatSelect }) {
    chats = Array.isArray(chats) ? chats : [];
    return (
        <>
          {/* Search Bar */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search or start new chat"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${selectedChat?.id === chat.id ? 'bg-gray-100' : ''} rounded-md`}
                onClick={() => handleChatSelect(chat)}
              >
                <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full mr-4" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{chat.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                </div>
                <span className="text-xs text-gray-400">{chat.time}</span>
              </div>
            ))}
          </div>
        </>
    )
}

export default FormSB
