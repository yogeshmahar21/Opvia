// src/components/PostCard.jsx
import React, { useState } from "react";
import { likePost, createComment } from "../api";

export default function PostCard({ post, onLike, onComment, currentUserId }) {
  const [commentText, setCommentText] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  // Check if the current user has liked this post (assuming `post.likedBy` array of user IDs)
  // For now, `post.like` is a number, so we'll just show the count.
  // If backend supports `likedBy` array, replace with: `const hasLiked = post.likedBy?.includes(currentUserId);`
  // For now, no direct visual indicator of *user's* like status without `likedBy` array.

  const handleLike = async () => {
    if (!currentUserId) {
      alert("Please log in to like posts");
      return;
    }
    
    setIsLiking(true);
    try {
      await onLike(post._id);
    } catch (err) {
      console.error("Error liking post:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    if (!currentUserId) {
      alert("Please log in to comment");
      return;
    }
    
    setIsCommenting(true);
    try {
      await onComment(currentUserId, post._id, { message: commentText }); // Pass writerId, postId, commentData
      setCommentText("");
    } catch (err) {
      console.error("Error creating comment:", err);
      alert(err.response?.data?.message || "Failed to add comment.");
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="post-card bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
      <div className="flex items-center mb-4">
        {/* Author's profile pic placeholder, assuming author might be embedded or fetched */}
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-semibold mr-3">
          {post.author?.name ? post.author.name.charAt(0).toUpperCase() : <i className="fas fa-user"></i>}
        </div>
        <div>
          <strong className="text-gray-800">{post.author?.name || "Unknown User"}</strong>
          <span className="text-gray-500 text-sm ml-2">
            • {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
      
      {post.description && (
        <p className="text-gray-700 mb-4">{post.description}</p>
      )}
      
      {post.postImg && (
        <img 
          src={post.postImg} 
          alt="Post" 
          className="w-full max-h-96 object-cover rounded-lg mb-4 border border-gray-300" 
        />
      )}
      
      <div className="flex items-center gap-4 mb-4 text-gray-600">
        <button 
          onClick={handleLike}
          disabled={isLiking}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 px-3 py-1 rounded-md"
        >
          <i className="fas fa-thumbs-up"></i>
          <span>{isLiking ? "Liking..." : `Like (${post.like || 0})`}</span>
        </button>
        {/* Comments count - assuming post.commentIds refers to the number of comments */}
        <span className="flex items-center space-x-2">
          <i className="fas fa-comment"></i>
          <span>Comment ({post.commentIds?.length || 0})</span>
        </span>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <form onSubmit={handleComment} className="flex mb-4">
          <input
            type="text"
            placeholder="Write a comment…"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button 
            type="submit"
            disabled={isCommenting || !commentText.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-r-md transition-colors duration-200"
          >
            {isCommenting ? "Sending..." : "Post Comment"}
          </button>
        </form>
        
        {/* Display comments */}
        {post.comments && post.comments.length > 0 && (
          <ul className="list-none p-0 m-0">
            {post.comments.map((comment) => (
              <li 
                key={comment._id} 
                className="bg-gray-50 p-3 rounded-md mb-2 border border-gray-100"
              >
                <strong className="text-gray-800">{comment.from?.name || "Unknown"}:</strong>{' '}
                <span className="text-gray-700">{comment.message}</span>
                <span className="text-gray-500 text-xs ml-2">
                  • {new Date(comment.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}