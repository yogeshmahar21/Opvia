// src/components/PostCard.jsx
import React, { useState, useEffect } from "react";
import { getCommentById  } from "../api";
import SingleComment from "./SingleComment";
import { API_URL } from "../config/config";

export default function PostCard({ post, onLike, onComment, currentUserId }) {

  const [commentText, setCommentText] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [postOwnerName, setPostOwnerName] = useState('');
  const [postOwnerId, setPostOwnerId] = useState('');
 const [name, setName] = useState('');
  
  const loadComments = async () => {
    try {
      const fetched = await Promise.all(
        (post.commentIds || []).map((id) => getCommentById(id))
      );
     setComments(fetched.reverse());
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  };

  useEffect(()=>{
    const fetchPostOwner = async() => {
      try {
      const res = await fetch(`${API_URL}/api/user/profile/${post.userId}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if(res.ok) {
        setPostOwnerName(data.profile.name);
        setPostOwnerId(data.profile._id);
      } else {
          console.log('post',post);
        console.log('post.userId', post.userId);
        console.log('data',data);   
      }
    } catch (err) {
      console.error(err);
    }
    }
    fetchPostOwner();
    // setComments(post.commentIds.length);
    // setLikes(post.like);
  },[])


  useEffect(()=>{
    const token = localStorage.getItem('token');
    const fetchName = async() => {
      try {
        const res = await fetch(`${API_URL}/api/user/profile`, {
        method: 'GET',
        headers: {
          'Content-Type':'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (res.ok) {
        const data = await res.json();
        setName(data.profile.name);
      } else {
        console.error('Error fetching Name');
      }
      } catch (err) {
        console.error(err);
      }
    }
    fetchName();
  },[]);
  
  useEffect(() => {
     if (showComments && post.commentIds?.length) {
    loadComments();
  }
}, [showComments, post.commentIds]); // sync whenever IDs change

  const handleLike = async () => {
    if (!currentUserId) {
      alert("Please log in to like posts");
      return;
    }

    setIsLiking(true);
    try {
       const like = await onLike(post._id);
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
    console.log('currentUserId', currentUserId);
    console.log('post._id', post._id);
    console.log('postOwnerId', postOwnerId);
    console.log('commentText', commentText);
    const newComment = await onComment(
      currentUserId,
      post._id,
      { id: postOwnerId, message: commentText }
    );

    setCommentText("");
    setShowComments(true);

    // append new comment immediately
    setComments(prev => [newComment, ...prev]);

  } catch (err) {
    console.error("Error creating comment:", err);
    alert(err?.response?.data?.message || "Failed to add comment.");
  } finally {
    setIsCommenting(false);
  }
};

  const commentCount = comments.length || post.commentIds?.length || 0;

  return (
    <div className="post-card bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
      {/* Post header */}
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-semibold mr-3">
          {postOwnerName ? postOwnerName.charAt(0).toUpperCase() : <i className="fas fa-user"></i>}
        </div>
        <div>
          <strong className="text-gray-800">{postOwnerName || "Unknown User"}</strong>
          <span className="text-gray-500 text-sm ml-2">
            • {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {post.description && <p className="text-gray-700 mb-4">{post.description}</p>}

      {post.postImg && (
        <img 
          src={post.postImg} 
          alt="Post" 
          className="w-full max-h-96 object-cover rounded-lg mb-4 border border-gray-300" 
        />
      )}

      {/* Like & comment count */}
      <div className="flex items-center gap-4 mb-4 text-gray-600">
        <button 
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-colors duration-200
           ${post.likedBy?.includes(name) ? 'text-blue-600 hover:text-blue-800' : 'text-gray-600 hover:text-gray-800'}`}
        >
          <i className="fas fa-thumbs-up"></i>
          <span>
            {isLiking ? "Liking..." : post.like > 0 ? `Like${post.like > 1 ? 's' : ''} (${post.like})` : "Like"}
          </span>
        </button>

        <button 
          onClick={() => setShowComments(prev => !prev)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <i className="fas fa-comment"></i>
          <span>
            Comment{commentCount !== 1 ? "s" : ""} ({commentCount})
          </span>
        </button>
      </div>

      {/* Comment form - always visible */}
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

        {/* Display previous comments only after toggle */}
        {showComments && (
          <>
            {comments.length > 0 ? (
              <ul className="list-none p-0 m-0">
                {comments.map((comment) => (
                  <SingleComment key={comment._id} comment={comment} />
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No comments yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
