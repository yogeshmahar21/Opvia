// src/pages/Suggestions.jsx
import React, { useState, useEffect } from 'react';
import api from '../api'; // Assuming you might have a suggestions API in the future
import { Link } from 'react-router-dom';

export default function Suggestions({ currentUserId, currentUserProfileId }) {
  const [suggestedProfiles, setSuggestedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      // In a real application, this would fetch suggestions from your backend.
      // E.g., /api/users/suggestions?userId=... or /api/users/profile/:profileId/suggestions
      // For now, we'll simulate dummy data.
      if (!currentUserId || !currentUserProfileId) {
        setLoading(false);
        setError("Please log in to see suggestions.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Fetch current user's profile to exclude self from suggestions
        const myProfileRes = await api.get(`/api/users/profile/${currentUserProfileId}`);
        const myProfile = myProfileRes.data.profile;
        const myConnections = new Set(myProfile.connectionIds || []);
        const myRequestsSent = new Set(myProfile.connectionReqIds || []);

        // Fetch ALL profiles (for dummy suggestion)
        // In production, this should be a dedicated backend endpoint for suggestions
        // which handles filtering by connections, requests, and relevance.
        // There is no /api/users/getAll endpoint in your backend currently.
        // So, this is purely dummy data or would require a backend addition.
        const allProfilesResponse = {
          data: {
            profiles: [ // Simulating a backend response structure
              { _id: 'profile101', name: 'Alice Smith', userStatus: 'Software Engineer', profilePic: 'https://placehold.co/100x100/e0e7ff/4338ca?text=AS' },
              { _id: 'profile102', name: 'Bob Johnson', userStatus: 'Product Manager', profilePic: 'https://placehold.co/100x100/e0e7ff/4338ca?text=BJ' },
              { _id: 'profile103', name: 'Charlie Brown', userStatus: 'UX Designer', profilePic: 'https://placehold.co/100x100/e0e7ff/4338ca?text=CB' },
              { _id: 'profile104', name: 'Diana Prince', userStatus: 'Data Scientist', profilePic: 'https://placehold.co/100x100/e0e7ff/4338ca?text=DP' },
              // Exclude current user's own profile for demo
              // { _id: currentUserProfileId, name: myProfile.name, userStatus: myProfile.userStatus, profilePic: myProfile.profilePic },
            ].filter(p => p._id !== currentUserProfileId) // Exclude self
          }
        };
        
        const filteredSuggestions = allProfilesResponse.data.profiles.filter(p => 
          !myConnections.has(p._id) && !myRequestsSent.has(p._id)
        );
        
        setSuggestedProfiles(filteredSuggestions);

      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setError('Failed to load suggestions. Backend endpoint needed or network error.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [currentUserId, currentUserProfileId]); // Rerun if user/profile ID changes

  const handleConnect = async (targetProfileId) => {
    if (!currentUserProfileId) {
      alert("Your profile ID is missing. Cannot send connection request.");
      return;
    }
    try {
      // Backend: POST /api/users/request/connection/:Id (sender's ID)
      // Body: { profileId: receiver's profile ID }
      await api.post(`/api/users/request/connection/${currentUserProfileId}`, { profileId: targetProfileId });
      alert('Connection request sent!');
      // Remove from suggestions list immediately or re-fetch
      setSuggestedProfiles(prev => prev.filter(p => p._id !== targetProfileId));
    } catch (err) {
      console.error('Error sending connection request:', err);
      alert(err.response?.data?.message || 'Failed to send request.');
    }
  };

  if (!currentUserId || !currentUserProfileId) {
    return (
      <div className="page-container text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Suggestions</h2>
        <p className="text-gray-600">Please log in and ensure your profile is created to view suggestions.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container text-center">
        <p className="text-gray-600">Loading suggestions...</p>
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

  return (
    <div className="page-container max-w-2xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">People You May Know</h2>
      
      {suggestedProfiles.length === 0 ? (
        <p className="text-gray-600 text-center">No new suggestions at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {suggestedProfiles.map(profile => (
            <div key={profile._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex items-center justify-between">
              <Link to={`/users/${profile._id}`} className="flex items-center">
                <img 
                  src={profile.profilePic || `https://placehold.co/48x48/d1e0e0/5c5c5c?text=${profile.name.charAt(0).toUpperCase()}`} 
                  alt={profile.name} 
                  className="w-12 h-12 rounded-full object-cover mr-4 border border-gray-300" 
                />
                <div>
                  <h4 className="font-medium text-gray-800">{profile.name}</h4>
                  <p className="text-gray-500 text-sm">{profile.userStatus || 'No status'}</p>
                </div>
              </Link>
              <button 
                onClick={() => handleConnect(profile._id)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-md transition-colors duration-200"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}