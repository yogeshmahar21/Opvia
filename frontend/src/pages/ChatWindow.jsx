import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import socket from "../socket";

export default function ChatWindow() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const endRef = useRef(null);

  // Load chats list
  const loadChats = async () => {
    try {
      // FIX: No backend route exists for "/api/chat". We'll simulate an empty list.
      // This part of the code will not work until a backend route is created.
      console.log("Cannot load chats: No backend route exists for '/api/chat'.");
      setChats([]);
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
      // FIX: Change URL to match the backend route from chatRouter.js
      const { data } = await api.post(`/api/chat/message`, {
        chatId: activeChatId,
        sender: localStorage.getItem("userId"), // You might need to add this
        content: msg.trim(),
      });

      socket.emit("sendMessage", { chatId: activeChatId, ...data });

      setMessages((m) => [...m, data]);
      setMsg("");
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId);

      socket.emit("joinChat", activeChatId);

      socket.on("receiveMessage", (message) => {
        if (message.chatId === activeChatId) {
          setMessages((prev) => [...prev, message]);
          endRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      });

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
        <div>
          <h3>Your Chats</h3>
          <ul>
            {/* FIX: This will be empty due to backend limitations */}
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