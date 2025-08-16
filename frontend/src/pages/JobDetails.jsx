// src/pages/JobDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Button from "../components/Button";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/api/jobs/${id}`);
      setJob(data);
    })();
  }, [id]);

  const apply = async () => {
    await api.post(`/api/jobs/${id}/apply`);
    alert("Applied!");
  };

  if (!job) return <div>Loading…</div>;

  return (
    <div>
      <h2>{job.title}</h2>
      <div>{job.location} · {job.type}</div>
      <p>{job.description}</p>
      <Button onClick={apply}>Apply</Button>
    </div>
  );
}
