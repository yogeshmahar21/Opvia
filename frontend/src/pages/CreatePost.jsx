// src/pages/CreatePost.jsx
import React, { useEffect, useState } from "react";
import { createPost } from "../api";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userProfileId, setUserProfileId] = useState('');
  const navigate = useNavigate();

  useEffect(()=> {
    const getUserId = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch('http://localhost:5000/api/user/profile', {
        method: 'Get',
        headers : {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${token}`
        }
      });

      const data = await res.json();

      if(res.ok) {
        console.log(data);
        const decodedData = data['profile'];
        setUserProfileId(decodedData['_id']);
        console.log(decodedData['_id']);  
      }

      
    } catch (err) {
      console.error(err, data);
    }
  };
  getUserId();
  },[])

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('button clicked 1');
    
    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("description", description);
      if (imageFile) {
        formData.append("postImg", imageFile);
      }

      try {
        const token = localStorage.getItem('token');
        console.log('userPID',userProfileId);
        console.log(`http://localhost:5000/api/posts/${userProfileId}`);
        const res = await fetch(`http://localhost:5000/api/posts/${userProfileId}`, {
          method: 'POST',
          headers: {
            'Authorization' : `Bearer ${token}`
          },
          body: formData
        });

        const data = await res.json();

        if(res.ok) {
          console.log(data);
          alert(data['message']);
        }
      } catch (err) {
        console.error(err);
      }
      
      // Redirect to feed after successful post
      navigate("/feed");
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.response?.data?.message || "Failed to create post. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/feed");
  };

  return (
    <div className="page-container max-w-2xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Create New Post</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Description (required):
          </label>
          <textarea
            id="description"
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Share something with your network..."
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
            Image (optional):
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {previewUrl && (
          <div className="mb-4">
            <img 
              src={previewUrl} 
              alt="Image Preview" 
              className="w-full max-h-80 object-contain rounded-md border border-gray-300" 
            />
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Post..." : "Create Post"}
          </button>
          
          <button 
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}