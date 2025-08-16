// src/pages/Notifications.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function Notifications() {
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data } = await api.get("/api/notifications");
    setItems(data);
  };

  const markRead = async (id) => {
    await api.put(`/api/notifications/${id}/read`);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {items.map((n) => (
          <li key={n._id}>
            <span>{n.type}: {n.content}</span>
            {!n.readStatus && <button onClick={() => markRead(n._id)}>Mark as read</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
