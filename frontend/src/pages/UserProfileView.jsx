// src/pages/UserProfileView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { sendConnectionRequest } from "../api";
import Button from "../components/Button";

export default function UserProfileView({ currentUserId, currentUserProfileId }) {
  const { id } = useParams(); // This is the profile ID of the user being viewed
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRequestSent, setIsRequestSent] = useState(false); // To manage button state

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        // Corrected API endpoint to match the backend router /api/users/profile/:profileId
        const { data } = await api.get(`/api/users/profile/${id}`);
        setUserProfile(data.profile); // Correctly access the nested profile object
        
        // Check if connection request already sent
        if (currentUserProfileId && data.profile.connectionReqIds.includes(currentUserProfileId)) {
          setIsRequestSent(true);
        } else {
          setIsRequestSent(false);
        }

      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile. It might not exist or there was a network error.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [id, currentUserProfileId]); // Re-fetch if viewed profile ID or current user's profile ID changes

  const handleConnect = async () => {
    if (!currentUserProfileId) {
      alert("You must be logged in and have a profile to send a connection request.");
      // Optionally redirect to login/onboarding
      return;
    }

    if (!userProfile) return; // Should not happen if data loaded

    setIsRequestSent(true); // Optimistically update UI
    try {
      // Backend expects sender's ID in URL params, receiver's ID in body as 'profileId'
      await sendConnectionRequest(currentUserProfileId, userProfile._id);
      alert("Connection request sent!");
    } catch (err) {
      console.error("Error sending connection request:", err);
      setError(err.response?.data?.message || "Failed to send request.");
      setIsRequestSent(false); // Revert UI if error
    }
  };

  if (loading) {
    return (
      <div className="page-container text-center">
        <p className="text-gray-600">Loading user profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="page-container text-center">
        <p className="text-gray-600">User profile not found.</p>
      </div>
    );
  }

  // Determine if the viewed profile is the current user's own profile
  const isMyOwnProfile = currentUserProfileId === userProfile._id;

  // Determine if the viewed profile is already a connection
  const isAlreadyConnected = userProfile.connectionIds?.includes(currentUserProfileId);


  return (
    <div className="page-container max-w-xl">
      <div className="flex flex-col items-center mb-6">
        {userProfile.profilePic ? (
          <img 
            src={userProfile.profilePic} 
            alt="Profile" 
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 shadow-md" 
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-5xl font-semibold border-4 border-gray-400">
            {userProfile.name.charAt(0).toUpperCase()}
          </div>
        )}
        <h2 className="text-3xl font-bold text-gray-800 mt-4">{userProfile.name}</h2>
        <p className="text-gray-600 text-lg">{userProfile.userStatus || 'No status'}</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6 space-y-3">
        <p className="text-gray-700 text-base">
          <strong>About:</strong> {userProfile.about || "No 'about' information provided."}
        </p>
        <p className="text-gray-700 text-base">
          <strong>Skills:</strong> {(userProfile.skills || []).join(", ") || "No skills listed."}
        </p>
        {/* Add more fields if desired from userProfileModel like email, role etc. */}
      </div>

      <div className="text-center">
        {!isMyOwnProfile && currentUserId && (
          isAlreadyConnected ? (
            <span className="text-green-600 font-semibold text-lg">Connected <i className="fas fa-check-circle ml-2"></i></span>
          ) : isRequestSent ? (
            <Button disabled={true} className="bg-gray-400 cursor-not-allowed">
              Request Sent <i className="fas fa-paper-plane ml-2"></i>
            </Button>
          ) : (
            <Button onClick={handleConnect}>Connect</Button>
          )
        )}
      </div>
    </div>
  );
}