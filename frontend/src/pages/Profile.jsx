// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function Profile() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/api/profile");
      setMe(data);
    })();
  }, []);

  if (!me) return <div>Loading…</div>;

  return (
    <div>
      <h2>My Profile</h2>
      {me.profilePic && <img src={me.profilePic} alt="" width={96} height={96} />}
      <div>Name: {me.name}</div>
      <div>Email: {me.email}</div>
      <div>Role: {me.role}</div>
      <div>About: {me.about}</div>
      <div>Skills: {(me.skills || []).join(", ")}</div>
      <a href="/edit-profile">Edit Profile</a>
    </div>
  );
}
