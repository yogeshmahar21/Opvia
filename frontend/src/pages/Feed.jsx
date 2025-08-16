// src/pages/Feed.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import PostCard from "../components/PostCard";
import Button from "../components/Button";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [composer, setComposer] = useState("");

  const load = async () => {
    const { data } = await api.get("/api/posts/feed");
    setPosts(data);
  };

  useEffect(() => {
    load();
  }, []);

  const createPost = async () => {
    if (!composer.trim()) return;
    const { data } = await api.post("/api/posts", { content: composer });
    setComposer("");
    setPosts((p) => [data, ...p]);
  };

  const like = async (postId) => {
    const { data } = await api.post(`/api/posts/${postId}/like`);
    setPosts((prev) => prev.map((p) => (p._id === postId ? data : p)));
  };

  const comment = async (postId, text) => {
    const { data } = await api.post(`/api/posts/${postId}/comment`, { text });
    setPosts((prev) => prev.map((p) => (p._id === postId ? data : p)));
  };

  return (
    <div>
      <h2>Home Feed</h2>
      <div>
        <textarea placeholder="Share something…" value={composer} onChange={(e) => setComposer(e.target.value)} />
        <Button onClick={createPost}>Post</Button>
      </div>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} onLike={like} onComment={comment} />
      ))}
    </div>
  );
}
