// src/pages/Suggestions.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function Suggestions() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/api/connections/suggestions");
      setPeople(data);
    })();
  }, []);

  const connect = async (userId) => {
    await api.post("/api/connections/request", { userId });
    alert("Request sent");
  };

  return (
    <div>
      <h2>People You May Know</h2>
      <ul>
        {people.map((p) => (
          <li key={p._id}>
            {p.name} — <button onClick={() => connect(p._id)}>Connect</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
