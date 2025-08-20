// src/pages/Feed.jsx
import React, { useEffect, useState } from "react";
import { fetchPosts, likePost, createComment } from "../api";
import PostCard from "../components/PostCard";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function Feed({ currentUserId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to load posts from the backend
  const loadPosts = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await fetchPosts();
    console.log("Fetched posts response:", response);
    const fetchedPosts = response.posts;
    setPosts(fetchedPosts || []);
  } catch (err) {
    console.error("Error loading posts:", err);
    setError("Failed to load posts. Please try again later.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    console.log("currentUserId in Feed:", currentUserId);
    loadPosts();
  }, []); // Empty dependency array means this runs once on mount

  const handleLike = async (postId) => {
    if (!currentUserId) {
      alert("Please log in to like posts");
      return;
    }
    
    try {
      await likePost(postId);
      loadPosts(); // Re-fetch posts to update like counts
    } catch (err) {
      console.error("Error liking post:", err);
      alert(err.response?.data?.message || "Failed to like post.");
    }
  };

  const handleComment = async (writerId, postId, commentData) => {
    if (!currentUserId) {
      alert("Please log in to comment");
      return;
    }

    try {
      await createComment(writerId, postId, commentData);
      loadPosts(); // Re-fetch posts to see new comments
    } catch (err) {
      console.error("Error creating comment:", err);
      alert(err.response?.data?.message || "Failed to add comment.");
    }
  };

  const handleCreatePost = () => {
    if (!currentUserId) {
      alert("Please log in to create a post");
      return;
    }
    navigate("/create-post");
  };

  return (
    <div className="page-container">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Home Feed</h2>
      
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm flex justify-between items-center">
        <p className="text-blue-800 font-medium">What's on your mind?</p>
        <Button onClick={handleCreatePost}>Create New Post</Button>
      </div>
      
      {loading && <p className="text-center text-gray-600">Loading posts...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {!loading && !error && posts.length === 0 && (
        <p className="text-center text-gray-600">No posts yet. Be the first to create one!</p>
      )}
      
      {!loading && !error && posts.length > 0 && (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard 
              key={post._id} 
              post={post} 
              onLike={handleLike} 
              onComment={handleComment}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}