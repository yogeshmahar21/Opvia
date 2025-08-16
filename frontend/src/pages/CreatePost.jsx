// src/pages/CreatePost.jsx
import React, { useState } from "react";

export default function CreatePost() {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!content.trim()) return;
    console.log("Post submitted:", content); // replace with API call later
    setContent("");
    // redirect back to feed (using react-router)
    window.location.href = "/feed";
  };

  return (
    <div>
      <h2>Create Post</h2>
      <textarea
        rows="4"
        style={{ width: "100%" }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share something with your network..."
      />
      <br />
      <button onClick={handleSubmit}>Post</button>
      <button onClick={() => (window.location.href = "/feed")} style={{ marginLeft: 8 }}>
        Cancel
      </button>
    </div>
  );
}
