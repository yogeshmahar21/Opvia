// src/pages/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client'; // Uncomment if using socket.io

export default function ChatWindow({ currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [activeChat, setActiveChat] = useState(null); // Represents the other user in the chat
  const messagesEndRef = useRef(null);

  // Placeholder for socket.io connection
  // const socket = useRef(null);

  // Dummy chat data for demonstration
  const dummyChats = [
    { id: 'user123', name: 'Alice' },
    { id: 'user456', name: 'Bob' },
  ];

  const dummyMessages = {
    'user123': [
      { id: 1, sender: 'user123', text: 'Hi there!', timestamp: new Date() },
      { id: 2, sender: currentUserId, text: 'Hello Alice! How are you?', timestamp: new Date() },
    ],
    'user456': [
      { id: 3, sender: 'user456', text: 'Hey, checking in.', timestamp: new Date() },
      { id: 4, sender: currentUserId, text: 'Hi Bob! What\'s up?', timestamp: new Date() },
    ],
  };

  useEffect(() => {
    // Scroll to the bottom of messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    // Simulate fetching messages for the active chat
    if (activeChat) {
      setMessages(dummyMessages[activeChat.id] || []);
    } else {
      setMessages([]);
    }

    // Initialize socket connection (uncomment when backend socket is ready)
    /*
    socket.current = io('http://localhost:5000'); // Connect to your backend socket server
    socket.current.on('connect', () => {
      console.log('Socket connected');
      // Emit 'joinChat' or similar event with currentUserId and activeChat.id
      // socket.current.emit('joinChat', { userId: currentUserId, chatId: activeChat.id });
    });
    socket.current.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      socket.current.disconnect();
    };
    */
  }, [activeChat, currentUserId]); // Depend on activeChat and currentUserId

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && activeChat) {
      const newMessage = {
        id: messages.length + 1,
        sender: currentUserId, // Or current user's actual ID
        text: inputMessage.trim(),
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage('');

      // Emit message via socket.io (uncomment when backend socket is ready)
      // socket.current.emit('sendMessage', {
      //   chatId: activeChat.id,
      //   senderId: currentUserId,
      //   message: inputMessage.trim(),
      // });
    }
  };

  const selectChat = (chat) => {
    setActiveChat(chat);
  };

  if (!currentUserId) {
    return (
      <div className="page-container text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Chat</h2>
        <p className="text-gray-600">Please log in to view your chats.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100"> {/* Adjust height based on Navbar height */}
      {/* Sidebar for chat list */}
      <div className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">My Chats</h3>
        {dummyChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => selectChat(chat)}
            className={`flex items-center p-3 rounded-lg cursor-pointer mb-2 transition-colors duration-200 ${
              activeChat?.id === chat.id ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-semibold mr-3">
              {chat.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium">{chat.name}</span>
          </div>
        ))}
      </div>

      {/* Main chat window */}
      <div className="flex-1 flex flex-col bg-white">
        {activeChat ? (
          <>
            <div className="border-b border-gray-200 p-4 bg-gray-50 flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-semibold mr-3">
                {activeChat.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{activeChat.name}</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}> {/* Adjust for header and input */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex mb-4 ${
                    msg.sender === currentUserId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg shadow ${
                      msg.sender === currentUserId
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className="block text-xs text-right mt-1 opacity-75">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* Scroll target */}
            </div>
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-gray-50 flex">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-r-lg transition-colors duration-200"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Select a chat to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
}