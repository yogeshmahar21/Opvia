// src/pages/EditProfile.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import Button from "../components/Button";
import Input from "../components/Input";

export default function EditProfile() {
  const [form, setForm] = useState({
    name: "",
    about: "",
    skills: "",
    status: "",
  });

  const [profileId, setProfileId] = useState("");

  useEffect(() => {
  (async () => {
    try {
      const storedId = localStorage.getItem("profileId");
      if (!storedId) throw new Error("Missing profile ID in localStorage");

      const { data } = await api.get(`/api/users/${storedId}`);
      const profile = data.profile;

      if (!profile) throw new Error("No profile returned");

      setForm({
        name: profile.name || "",
        about: profile.about || "",
        skills: (profile.skills || []).join(", "),
        status: profile.userStatus || "",
      });

      setProfileId(profile._id);
    } catch (err) {
      console.error("Profile fetch error:", err.response?.data || err.message || err);
      alert("Failed to load profile");
    }
  })();
}, []);


  const save = async () => {
    try {
      const skillsPayload = {
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      };

      const statusPayload = {
        newStatus: form.status,
      };

      await Promise.all([
        api.put(`/api/users/skills/${profileId}`, skillsPayload),
        api.put(`/api/users/status/${profileId}`, statusPayload),
      ]);

      window.location.href = "/profile";
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>

      <Input
        placeholder="Name"
        value={form.name}
        disabled
      />

      <textarea
        placeholder="About"
        value={form.about}
        disabled
      />

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

      <Button onClick={save}>Save</Button>
    </div>
  );
}
