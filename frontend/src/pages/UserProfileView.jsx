// src/pages/UserProfileView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function UserProfileView() {
  const { id } = useParams();
  const [u, setU] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/api/users/${id}`);
      setU(data);
    })();
  }, [id]);

  const connect = async () => {
    await api.post("/api/connections/request", { userId: id });
    alert("Request sent");
  };

  if (!u) return <div>Loading…</div>;

  return (
    <div>
      <h2>{u.name}</h2>
      {u.profilePic && <img src={u.profilePic} alt="" width={96} height={96} />}
      <div>{u.about}</div>
      <div>Skills: {(u.skills || []).join(", ")}</div>
      <button onClick={connect}>Connect</button>
    </div>
  );
}
