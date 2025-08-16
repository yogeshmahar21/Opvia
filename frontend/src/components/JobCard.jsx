// src/components/JobCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <div>
      <h3><Link to={`/jobs/${job._id}`}>{job.title}</Link></h3>
      <div>{job.location} · {job.type}</div>
      <p>{job.description?.slice(0, 120)}{job.description?.length > 120 ? "..." : ""}</p>
    </div>
  );
}
