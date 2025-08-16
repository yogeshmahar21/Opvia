// src/components/PostCard.jsx
import React from "react";

export default function PostCard({ post, onLike, onComment }) {
  return (
    <div>
      <div>
        <strong>{post.author?.name}</strong> • {new Date(post.createdAt).toLocaleString()}
      </div>
      <p>{post.content}</p>
      {post.media && <img src={post.media} alt="" />}
      <div>
        <button onClick={() => onLike(post._id)}>Like ({post.likes?.length || 0})</button>
      </div>
      <div>
        <input
          placeholder="Write a comment…"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              onComment(post._id, e.currentTarget.value.trim());
              e.currentTarget.value = "";
            }
          }}
        />
        <ul>
          {(post.comments || []).map((c) => (
            <li key={c._id}><strong>{c.author?.name}:</strong> {c.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
