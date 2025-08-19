// src/pages/UserProfileView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function UserProfileView() {
  const { id } = useParams();
  const [u, setU] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // ✅ Corrected API endpoint to match the backend router
        const { data } = await api.get(`/api/users/profile/${id}`);
        // ✅ Correctly access the nested profile object
        setU(data.profile); 
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    })();
  }, [id]);

  const connect = async () => {
    const senderId = localStorage.getItem("profileId"); // 👈 Get the sender's ID
    if (!senderId) {
      alert("You must be logged in to send a connection request.");
      return;
    }

    try {
      // ✅ Corrected API endpoint to match the backend router,
      //    and sent the receiver's ID in the body as expected.
      await api.post(`/api/users/request/connection/${senderId}`, { profileId: id });
      alert("Request sent");
    } catch (err) {
      console.error("Error sending connection request:", err);
      alert("Failed to send request.");
    }
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