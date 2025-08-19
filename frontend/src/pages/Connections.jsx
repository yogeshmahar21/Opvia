// src/pages/Connections.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

export default function Connections({ currentUserId, currentUserProfileId }) {
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConnectionsData = async () => {
      if (!currentUserProfileId) {
        setLoading(false);
        setError("User profile ID not found. Please ensure your profile is created and you are logged in.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/api/users/profile/${currentUserProfileId}`);
        const profile = response.data.profile;

        if (profile) {
          // Fetch details for each connection and request
          // NOTE: This will make N+1 queries. For production, a backend endpoint
          // that returns full connected profiles/requests would be better.
          const fetchedConnections = await Promise.all(
            (profile.connectionIds || []).map(async (id) => {
              try {
                const connRes = await api.get(`/api/users/profile/${id}`);
                return connRes.data.profile;
              } catch (connErr) {
                console.error(`Error fetching connection ${id}:`, connErr);
                return null;
              }
            })
          );
          setConnections(fetchedConnections.filter(Boolean)); // Filter out any nulls

          const fetchedRequests = await Promise.all(
            (profile.connectionReqIds || []).map(async (id) => {
              try {
                const reqRes = await api.get(`/api/users/profile/${id}`);
                return reqRes.data.profile;
              } catch (reqErr) {
                console.error(`Error fetching request ${id}:`, reqErr);
                return null;
              }
            })
          );
          setRequests(fetchedRequests.filter(Boolean)); // Filter out any nulls
        }
      } catch (err) {
        console.error("Error fetching connections and requests:", err);
        setError("Failed to load connections or requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchConnectionsData();
  }, [currentUserProfileId]);

  const handleAcceptRequest = async (requesterProfileId) => {
    if (!currentUserProfileId) {
      alert("Your profile ID is missing. Cannot accept request.");
      return;
    }
    try {
      // Backend: POST /api/users/connection/:profileId (accepter's profileId)
      // Body: { id: requester's profileId }
      await api.post(`/api/users/connection/${currentUserProfileId}`, { id: requesterProfileId });
      alert('Connection accepted!');
      // Re-fetch data to update lists
      window.location.reload(); // Simple reload for now, or refine fetchConnectionsData
    } catch (err) {
      console.error('Error accepting connection:', err);
      alert('Failed to accept connection.');
    }
  };

  if (!currentUserId || !currentUserProfileId) {
    return (
      <div className="page-container text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Connections</h2>
        <p className="text-gray-600">Please log in and ensure your profile is created to view connections.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container text-center">
        <p className="text-gray-600">Loading connections...</p>
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
    <div className="page-container">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Connections</h2>

      {/* Connection Requests Section */}
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Connection Requests ({requests.length})</h3>
        {requests.length === 0 ? (
          <p className="text-gray-600">No new connection requests.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((req) => (
              <div key={req._id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center justify-between">
                <Link to={`/users/${req._id}`} className="flex items-center">
                  <img
                    src={req.profilePic || `https://placehold.co/40x40/cbd5e1/475569?text=${req.name.charAt(0).toUpperCase()}`}
                    alt={req.name}
                    className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-300"
                  />
                  <span className="font-medium text-gray-800 hover:text-blue-600">{req.name}</span>
                </Link>
                <button
                  onClick={() => handleAcceptRequest(req._id)}
                  className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My Connections Section */}
      <section>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">My Connections ({connections.length})</h3>
        {connections.length === 0 ? (
          <p className="text-gray-600">You don't have any connections yet. Start by sending requests to others!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections.map((conn) => (
              <Link to={`/users/${conn._id}`} key={conn._id} className="bg-white p-4 rounded-lg shadow-md flex items-center hover:shadow-lg transition-shadow duration-200">
                <img
                  src={conn.profilePic || `https://placehold.co/50x50/e2e8f0/4a5568?text=${conn.name.charAt(0).toUpperCase()}`}
                  alt={conn.name}
                  className="w-12 h-12 rounded-full object-cover mr-4 border border-gray-300"
                />
                <div>
                  <h4 className="font-medium text-gray-800">{conn.name}</h4>
                  <p className="text-gray-500 text-sm">{conn.userStatus || 'No status'}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}