// src/pages/ChatWindow.jsx
import React, { useState, useEffect, useRef } from "react";
import api from "../api";

export default function ChatWindow({ currentUserId }) {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch all chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/api/chats"); // backend returns populated participants
        const userChats = res.data.filter(chat =>
          chat.participants.some(p => p._id?.toString() === currentUserId?.toString())
        );
        setChats(userChats);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };
    if (currentUserId) fetchChats();
  }, [currentUserId]);

  // Fetch messages of selected chat
  const fetchMessages = async (chatId) => {
    try {
      const res = await api.get(`/api/chats/${chatId}/messages`);
      setMessages(res.data);
      setSelectedChat(chatId);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    try {
      await api.post("/api/chats/message", {
        chatId: selectedChat,
        sender: currentUserId,
        text: newMessage,
      });
      setNewMessage("");
      fetchMessages(selectedChat);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Auto scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window" style={{ display: "flex", height: "90vh" }}>
      {/* Sidebar - Chat list */}
      <div style={{ width: "30%", borderRight: "1px solid #ccc", padding: "1rem" }}>
        <h3>Your Chats</h3>
        {chats.length > 0 ? (
          chats.map((chat) => {
            const otherParticipants = chat.participants.filter(
              (p) => p._id.toString() !== currentUserId.toString()
            );
            return (
              <div
                key={chat._id}
                style={{
                  padding: "0.5rem",
                  cursor: "pointer",
                  backgroundColor: selectedChat === chat._id ? "#eee" : "transparent",
                }}
                onClick={() => fetchMessages(chat._id)}
              >
                {otherParticipants.map((p) => p.username).join(", ")}
              </div>
            );
          })
        ) : (
          <p>No chats yet</p>
        )}
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
          {messages.map((msg) => (
            <div
              key={msg._id}
              style={{
                textAlign: msg.sender === currentUserId ? "right" : "left",
                margin: "0.5rem 0",
              }}
            >
              <strong>
                {msg.sender === currentUserId ? "You" : msg.sender.username}
              </strong>
              : {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {selectedChat && (
          <div style={{ display: "flex", padding: "0.5rem", borderTop: "1px solid #ccc" }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              style={{ flex: 1, padding: "0.5rem" }}
            />
            <button onClick={handleSendMessage} style={{ marginLeft: "0.5rem" }}>
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
