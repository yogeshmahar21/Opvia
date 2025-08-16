// src/pages/ChatWindow.jsx
import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import socket from "../socket"; // ✅ import socket instance

export default function ChatWindow() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const endRef = useRef(null);

  // Load chats list
  const loadChats = async () => {
    try {
      const { data } = await api.get("/api/chat");
      setChats(data);
      if (!activeChatId && data[0]?._id) {
        setActiveChatId(data[0]._id);
      }
    } catch (err) {
      console.error("Error loading chats:", err);
    }
  };

  // Load history messages
  const loadMessages = async (chatId) => {
    if (!chatId) return;
    try {
      const { data } = await api.get(`/api/chat/${chatId}/messages`);
      setMessages(data);
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  // Send new message
  const send = async () => {
    if (!msg.trim() || !activeChatId) return;
    try {
      // 1. Save to DB via API
      const { data } = await api.post(`/api/chat/${activeChatId}/messages`, {
        text: msg.trim(),
      });

      // 2. Emit real-time message
      socket.emit("sendMessage", { chatId: activeChatId, ...data });

      // 3. Update UI immediately
      setMessages((m) => [...m, data]);
      setMsg("");
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Initial load of chats
  useEffect(() => {
    loadChats();
  }, []);

  // Reload messages when chat changes
  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId);

      // Join socket room for this chat
      socket.emit("joinChat", activeChatId);

      // Listen for new messages in this chat
      socket.on("receiveMessage", (message) => {
        if (message.chatId === activeChatId) {
          setMessages((prev) => [...prev, message]);
          endRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      });

      // Cleanup listener when chat changes
      return () => {
        socket.emit("leaveChat", activeChatId);
        socket.off("receiveMessage");
      };
    }
  }, [activeChatId]);

  return (
    <div>
      <h2>Messages</h2>

      <div style={{ display: "flex", gap: 16 }}>
        {/* Chat list */}
        <div>
          <h3>Your Chats</h3>
          <ul>
            {chats.map((c) => (
              <li key={c._id}>
                <button onClick={() => setActiveChatId(c._id)}>
                  Chat #{c._id.slice(-5)} —{" "}
                  {c.participants?.map((p) => p.name).join(", ")}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat window */}
        <div style={{ flex: 1 }}>
          <div>
            {(messages || []).map((m) => (
              <div key={m._id}>
                <div>
                  <strong>{m.sender?.name || m.senderId}</strong>
                </div>
                <div>{m.text}</div>
                <small>{new Date(m.timestamp).toLocaleString()}</small>
                <hr />
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div>
            <input
              placeholder="Type a message…"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button onClick={send}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
