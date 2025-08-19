// src/pages/Profile.jsx
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
    <div className="page-container max-w-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h2>
      
      <div className="flex flex-col items-center mb-6">
        {me.profilePic ? (
          <img 
            src={me.profilePic} 
            alt="Profile" 
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 shadow-md" 
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-5xl font-semibold border-4 border-gray-400">
            {me.name.charAt(0).toUpperCase()}
          </div>
        )}
        <h3 className="text-2xl font-semibold text-gray-800 mt-4">{me.name}</h3>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6 space-y-3">
        <p className="text-gray-700 text-base">
          <strong>Skills:</strong> {(me.skills || []).join(", ") || "No skills listed"}
        </p>
        <p className="text-gray-700 text-base">
          <strong>Status:</strong> {me.userStatus || "N/A"}
        </p>
        <p className="text-gray-700 text-base">
          <strong>Username:</strong> {me.username || "N/A"}
        </p>
        {/* Removed: Email, Role, About fields as per previous requests */}
      </div>
      
      <div className="text-center">
        <Link 
          to="/edit-profile" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
}