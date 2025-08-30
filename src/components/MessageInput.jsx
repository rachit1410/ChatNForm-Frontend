import React from "react";
import { Send, X, Paperclip } from "lucide-react";

const MessageInput = React.memo(({ newMessage, setNewMessage, handleSendMessage, disabled, handleFileChange, file, removeFile }) => {
  return (
           <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-900 flex items-center h-[72px] z-10">
          {/* Hidden file input */}
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            className="hidden"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            disabled={disabled}
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
            disabled={disabled}
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
  );
});

export default MessageInput;