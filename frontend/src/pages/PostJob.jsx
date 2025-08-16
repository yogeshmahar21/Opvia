// src/pages/PostJob.jsx
import React, { useState } from "react";
import api from "../api";
import Input from "../components/Input";
import Button from "../components/Button";

export default function PostJob() {
  const [form, setForm] = useState({ title: "", description: "", location: "", type: "" });

  const post = async () => {
    try {
      await api.post("/api/jobs", form);
      window.location.href = "/jobs";
    } catch {
      alert("Failed to post job");
    }
  };

  return (
    <div>
      <h2>Post a Job</h2>
      <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
      <Input placeholder="Type (e.g., Full-time)" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
      <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <Button onClick={post}>Publish</Button>
    </div>
  );
}
