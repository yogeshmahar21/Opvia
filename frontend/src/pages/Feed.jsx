// src/pages/Feed.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import PostCard from "../components/PostCard";
import Button from "../components/Button";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [composer, setComposer] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/api/posts/feed");
      setPosts(data);
    } catch (err) {
      console.error("Error loading feed:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createPost = async () => {
    if (!composer.trim()) return;
    try {
      const { data } = await api.post("/api/posts", { content: composer });
      setComposer("");
      setPosts((p) => [data, ...p]);
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <div className="page-container">
      <h2>Home Feed</h2>
      <div className="composer-box">
        <textarea
          placeholder="Share something…"
          value={composer}
          onChange={(e) => setComposer(e.target.value)}
        />
        <Button onClick={createPost}>Post</Button>
      </div>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} onLike={() => {}} onComment={() => {}} />
        ))
      )}
    </div>
  );
}
