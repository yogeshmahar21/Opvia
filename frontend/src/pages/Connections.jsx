// src/pages/Connections.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function Connections() {
  const [connections, setConnections] = useState([]);

  const load = async () => {
    const { data } = await api.get("/api/connections");
    setConnections(data);
  };

  const remove = async (id) => {
    await api.delete(`/api/connections/${id}`);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>My Connections</h2>
      <a href="/suggestions">People You May Know</a>
      <ul>
        {connections.map((c) => (
          <li key={c._id}>
            {c.name} — <button onClick={() => remove(c._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
