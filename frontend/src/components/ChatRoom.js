import React, { useState, useEffect } from "react";
import socket from "../socket";
import axios from "axios";

const ChatRoom = ({ chatId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Join the chat room when component mounts
  useEffect(() => {
    socket.emit("joinChat", chatId);

    // Listen for new messages
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Fetch existing chat messages from API
    const fetchMessages = async () => {
      const res = await axios.get(`/api/chat/${chatId}/messages`);
      setMessages(res.data);
    };

    fetchMessages();

    // Cleanup listener when leaving chat
    return () => {
      socket.off("receiveMessage");
    };
  }, [chatId]);

  // Send message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    socket.emit("sendMessage", {
      chatId,
      senderId: userId,
      content: newMessage
    });

    setNewMessage(""); // clear input
  };

  return (
    <div style={{ width: "400px", border: "1px solid #ccc", padding: "10px" }}>
      <h3>Chat Room</h3>
      <div style={{
        height: "300px",
        overflowY: "auto",
        border: "1px solid #ddd",
        padding: "5px",
        marginBottom: "10px"
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "5px" }}>
            <strong>{msg.sender?.name || "User"}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ width: "80%", padding: "5px" }}
      />
      <button onClick={handleSendMessage} style={{ width: "18%", marginLeft: "2%" }}>
        Send
      </button>
    </div>
  );
};

export default ChatRoom;
