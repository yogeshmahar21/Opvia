import React, { useEffect, useState } from "react";
import api from "../api";
import PostCard from "../components/PostCard";
import Button from "../components/Button";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [composer, setComposer] = useState("");
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      // There is no backend route for "/api/posts/feed".
      // This call will fail with a 404. We'll simulate no posts found.
      console.log("Cannot load feed: No backend route exists for '/api/posts/feed'.");
      setPosts([]);
      setError("No feed data available. This feature needs a backend route.");
    } catch (err) {
      console.error("Error loading feed:", err);
      setError("Failed to load feed.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createPost = async () => {
    // The backend post route requires a userId and a file upload.
    // This frontend component only has a text field. This functionality is not compatible.
    alert("Posting functionality is not compatible with the backend API. It requires a file upload.");
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
      {error ? (
        <p>{error}</p>
      ) : posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} onLike={() => {}} onComment={() => {}} />
        ))
      )}
    </div>
  );
}