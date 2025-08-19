// src/pages/EditProfile.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import Button from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [form, setForm] = useState({
    name: "",      // Will remain read-only
    skills: "",    // Editable
    status: "",    // Editable
    username: "",  // Included, but changes won't persist without backend update
  });

  const [profileId, setProfileId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const storedId = localStorage.getItem("profileId");
        console.log("Fetching profile for ID:", storedId);
        if (!storedId) throw new Error("Missing profile ID in localStorage");

        const { data } = await api.get(`/api/users/profile/${storedId}`);
        const profile = data.profile;

        if (!profile) throw new Error("No profile returned");

        setForm({
          name: profile.name || "",
          skills: (profile.skills || []).join(", "),
          status: profile.userStatus || "",
          username: profile.username || "", // Assume 'username' might be available from profile
        });

        setProfileId(profile._id);
      } catch (err) {
        console.error("Profile fetch error:", err.response?.data || err.message || err);
        alert("Failed to load profile. Please create one.");
        navigate("/onboarding");
      }
    })();
  }, [navigate]);

  const save = async () => {
    try {
      // The backend has a flaw here, as it expects a single string and then
      // wraps it in a new array, overwriting existing skills. This is a temporary
      // fix that sends the skills as a single string to work with the current backend.
      // A proper fix would be to update the backend to use $addToSet.
      await Promise.all([
        api.post(`/api/users/profile/updateSkills/${profileId}`, { skills: form.skills }),
        api.post(`/api/users/profile/update/status/${profileId}`, { newStatus: form.status }),
        // No backend routes for updating name or username provided, so no API calls for them here.
      ]);

      window.location.href = "/profile"; // Full page reload to show updated data

    } catch (err) {
      console.error("Save error:", err.response?.data || err.message || err);
      alert("Update failed");
    }
  };

  return (
    <div className="page-container max-w-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Edit Profile</h2>
      
      {/* Name is read-only as no backend route exists to update it */}
      <Input
        placeholder="Name"
        value={form.name}
        readOnly
        style={{ cursor: "not-allowed", backgroundColor: "#f0f0f0" }} // Add some visual cue
      />
      {/* Removed: About textarea from JSX as per request */}

      <Input
        placeholder="Skills (comma separated)"
        value={form.skills}
        onChange={(e) => setForm({ ...form, skills: e.target.value })}
      />
      <Input
        placeholder="Status"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      />
      {/* Username field - changes will not persist without backend support */}
      <Input
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        title="Changes to username will not be saved without backend support." // Tooltip for user
      />

      <Button onClick={save}>Save</Button>
    </div>
  );
}