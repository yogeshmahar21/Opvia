// src/pages/Jobs.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import JobCard from "../components/JobCard";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/api/jobs", { params: { q } });
      setJobs(data);
    })();
  }, [q]);

  return (
    <div>
      <h2>Jobs</h2>
      <input placeholder="Search jobs" value={q} onChange={(e) => setQ(e.target.value)} />
      <a href="/post-job">Post a Job</a>
      <div>
        {jobs.map((job) => <JobCard key={job._id} job={job} />)}
      </div>
    </div>
  );
}
