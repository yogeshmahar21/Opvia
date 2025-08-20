// src/pages/PostJob.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { postJob } from '../api'; // Your API function to post a job
import { jwtDecode } from 'jwt-decode';

export default function PostJob() {
  const [form, setForm] = useState({
    title: '',
    companyName: '',
    location: '',
    salary: '',
    description: '',
    jobImg: null, // For image file upload
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get userId from localStorage
  const getUserId = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = jwtDecode(token);
        return payload.id || payload._id || payload.userId;
      } catch (err) {
        console.error("Error parsing token:", err);
        return null;
      }
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, jobImg: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // const userId = getUserId();
    // if (!userId) {
    //   setError("Please log in to post a job.");
    //   setLoading(false);
    //   return;
    // }

    // if (!form.title || !form.companyName || !form.location || !form.description) {
    //   setError("Please fill in all required fields (Title, Company, Location, Description).");
    //   setLoading(false);
    //   return;
    // }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('companyName', form.companyName);
    formData.append('location', form.location);
    formData.append('salary', form.salary);
    formData.append('description', form.description);
    if (form.jobImg) {
      formData.append('JobImg', form.jobImg); // 'jobImg' must match backend's expected field name
    }

    try {
      // Your backend postJob route is POST /api/jobs/post/:userId
      const token = localStorage.getItem('token');

      try {
        const res = await fetch('http://localhost:5000/api/jobs', {
          method: 'POST',
          headers: {
            'Authorization' : `Bearer ${token}`
          },
          body: formData
        });

        const data = await res.json();

        if(res.ok) {
          console.log(data);
          //alert(data['id']); 
          alert('Job successfully posted!'); 
          navigate(`/jobs/${data.id}`);
          console.log(res)
        }
      } catch (err) {
        console.error(err);
        //console.log(res);
      }
    } catch (err) {
      console.error('Error posting job:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container max-w-3xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Post a New Job</h2>
      
      <form onSubmit={handleSubmit}>
        <Input
          name="title"
          placeholder="Job Title (e.g., Software Engineer, Marketing Manager)"
          value={form.title}
          onChange={handleInputChange}
          required
        />
        <Input
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleInputChange}
          required
        />
        <Input
          name="location"
          placeholder="Location (e.g., New York, Remote)"
          value={form.location}
          onChange={handleInputChange}
          required
        />
        <Input
          name="salary"
          placeholder="Salary (e.g., $80,000 - $100,000 or Negotiable)"
          value={form.salary}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleInputChange}
          rows="6"
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        
        <div className="mb-4">
          <label htmlFor="jobImg" className="block text-gray-700 text-sm font-bold mb-2">
            Job Image (optional):
          </label>
          <input
            type="file"
            id="jobImg"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {previewUrl && (
          <div className="mb-4">
            <img 
              src={previewUrl} 
              alt="Job Image Preview" 
              className="w-full max-h-60 object-contain rounded-md border border-gray-300" 
            />
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
            {loading ? 'Posting Job...' : 'Post Job'}
          </Button>
          <Button type="button" onClick={() => navigate('/jobs')} disabled={loading} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}