import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Connections() {
  const [connections, setConnections] = useState([]);
  const [error, setError] = useState(null);

  const load = async () => {
    const profileId = localStorage.getItem("profileId");
    if (!profileId) {
      setError("No user profile found.");
      return;
    }

    try {
      // FIX: Fetch the user profile and extract connection IDs.
      // NOTE: This assumes the backend returns connection IDs and not full user objects.
      const { data } = await api.get(`/api/users/profile/${profileId}`);
      if (data.profile && data.profile.connectionIds) {
        // You would need another API call to get the details for each connectionId.
        // For now, we'll display the IDs.
        setConnections(data.profile.connectionIds);
        setError(null);
      } else {
        setConnections([]);
      }
    } catch (err) {
      console.error("Error loading connections:", err);
      setError("Failed to load connections.");
    }
  };

  const remove = async (id) => {
    // There is no corresponding DELETE route in the backend.
    // The connection route in userProfileRouter is a POST request.
    // You would need to make a POST request to handle this, but for now, this is
    // a backend limitation. The function is removed.
    alert("Removing connections is not yet implemented on the backend.");
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>My Connections</h2>
      <Link to="/suggestions">People You May Know</Link>
      {error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {connections.map((id) => (
            <li key={id}>
              {/* FIX: Displaying the ID as the name for now, as full user objects are not fetched. */}
              <Link to={`/profile/${id}`}>{id}</Link> — <button onClick={() => remove(id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}