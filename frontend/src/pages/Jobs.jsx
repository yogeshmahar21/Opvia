// src/pages/Jobs.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
  (async () => {
    try {
      const { data } = await api.get("/api/jobs", { params: { q } });
      console.log("Jobs fetched:", data);
      setJobs(data.jobs); // ✅ FIXED
      setError(null);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
      setError("Failed to load jobs.");
    }
  })();
}, [q]);


  return (
    <div>
      <h2>Jobs</h2>

      <input
        placeholder="Search jobs"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <a href="/post-job">Post a Job</a>

      {error ? (
        <p>{error}</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul>
          {jobs
          .filter(job => job && job.title && job.description)
          .map((job) => (
            <li key={job._id}>
              <Link to={`/jobs/${job._id}`}>{job.title}</Link> — {job.location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
