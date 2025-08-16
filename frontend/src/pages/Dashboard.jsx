// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import PostCard from "../components/PostCard";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/dashboard");
        setSummary(data);
      } catch {
        setSummary({ posts: [], connections: [], applications: [] });
      }
    })();
  }, []);

  if (!summary) return <div>Loading…</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <div>Posts: {summary.posts?.length || 0}</div>
        <div>Connections: {summary.connections?.length || 0}</div>
        <div>Applications: {summary.applications?.length || 0}</div>
      </div>

      <h3>Recent Posts</h3>
      {(summary.posts || []).map((p) => (
        <PostCard key={p._id} post={p} onLike={() => {}} onComment={() => {}} />
      ))}
    </div>
  );
}
