import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import Button from "../components/Button";

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jobId) {
      setError("Invalid job ID.");
      return;
    }

    (async () => {
      try {
        const { data } = await api.get(`/api/jobs/get/${jobId}`);
        console.log("Job fetched:", data);
        setJob(data.job);
        setError(null);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Job not found or may have been deleted.");
      }
    })();
  }, [jobId]);

  const apply = async () => {
    try {
      // FIX: Changed from api.post to api.get to match the backend route
      await api.get(`/api/jobs/apply/${jobId}`);
      alert("Applied!");
    } catch (err) {
      console.error("Error applying:", err);
      alert("Failed to apply.");
    }
  };

  if (error) return (
    <div>
      <p>{error}</p>
      <Button onClick={() => navigate("/jobs")}>Back to Jobs</Button>
    </div>
  );

  if (!job) return <div>Loading…</div>;

  return (
    <div>
      {/* FIX: The backend job model seems to have a "name" property for the job title. */}
      <h2>Title: {job.title || job.name}</h2>
      {/* FIX: The backend doesn't seem to save location/type, but we can try to render it if it exists. */}
      <div>{job.location} · {job.type}</div>
      <p>Description: {job.description}</p>
      {job.image && (
        <img src={job.image} alt="Job" style={{ maxWidth: "400px", marginTop: "1rem" }} />
      )}
      <Button onClick={apply}>Apply</Button>
      <Button onClick={() => navigate("/jobs")}>Back to Jobs</Button>
    </div>
  );
}