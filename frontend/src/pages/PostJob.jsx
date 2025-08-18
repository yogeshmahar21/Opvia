// src/pages/PostJob.jsx
import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function PostJob() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [jobImg, setJobImg] = useState(null); // ✅ file object
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (
      !title.trim() ||
      !location.trim() ||
      !type.trim() ||
      !description.trim() ||
      !jobImg
    ) {
      setMessage("Please fill in all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("type", type);
    formData.append("description", description);
    formData.append("JobImg", jobImg); // ✅ send file as 'JobImg'

    try {
      const response = await api.post("/api/jobs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Job posted successfully:", response.data);
      setMessage("Job posted successfully!");
      navigate("/jobs");
    } catch (err) {
      console.error("Error posting job:", err.response?.data || err.message);
      setMessage(
        err.response?.data?.message ||
          "Failed to post job. Check console for details."
      );
    }
  };

  return (
    <div>
      <h2>Post a Job</h2>

      <input
        type="text"
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <br />

      <input
        type="text"
        placeholder="Job Type (e.g. Full-time)"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />
      <br />

      <textarea
        rows="4"
        placeholder="Job Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setJobImg(e.target.files[0])}
      />
      <br />

      <button onClick={handleSubmit}>Submit</button>
      <button onClick={() => navigate("/jobs")} style={{ marginLeft: 8 }}>
        Cancel
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
