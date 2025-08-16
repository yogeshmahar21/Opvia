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
  });

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/api/profile");
      setForm({
        name: data.name || "",
        about: data.about || "",
        skills: (data.skills || []).join(", "),
      });
    })();
  }, []);

  const save = async () => {
    try {
      await api.put("/api/users/me", {
        name: form.name,
        about: form.about,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      window.location.href = "/profile";
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <textarea placeholder="About" value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
      <Input placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
      <Button onClick={save}>Save</Button>
    </div>
  );
}
