// profile.jsx (from your provided latest artifact - NO CHANGES NEEDED)
import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [me, setMe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const profileId = localStorage.getItem("profileId");
      console.log("Loaded profileId:", profileId);

      if (!profileId) {
        console.error("No profileId found in localStorage. Navigating to onboarding.");
        navigate('/onboarding');
        return;
      }

      try {
        const { data } = await api.get(`/api/users/profile/${profileId}`);
        console.log("Fetched profile data:", data);
        setMe(data.profile); // Access the nested profile object
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    })();
  }, [navigate]);

  if (!me) return <div>Loading…</div>;

  return (
    <div>
      <h2>My Profile</h2>
      {me.profilePic && <img src={me.profilePic} alt="" width={96} height={96} />}
      <div>Name: {me.name}</div>
      <div>Skills: {(me.skills || []).join(", ")}</div>
      <div>Status: {me.userStatus || "N/A"}</div> {/* Display userStatus */}
      {/* Assuming 'username' might be a field if added later, though not in your current model */}
      <div>Username: {me.username || "N/A"}</div>
      {/* Removed: Email, Role, About fields as per request */}
      <a href="/edit-profile">Edit Profile</a>
    </div>
  );
}