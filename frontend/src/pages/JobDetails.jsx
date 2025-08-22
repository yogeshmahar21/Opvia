// src/pages/JobDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById, applyForJob } from '../api';
import Button from '../components/Button';

export default function JobDetails({ currentUserId }) {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);
        const { job: fetchedJob } = await getJobById(jobId); // Assuming backend returns { job: {...} }
        setJob(fetchedJob);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. It might not exist or there was a network error.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleApply = async () => {
    if (!currentUserId) {
      alert("Please log in to apply for jobs.");
      navigate("/login");
      return;
    }

    if (!job) return;

    setIsApplying(true);
    try {
      // Assuming your applyForJob backend endpoint requires a userId in the body
      // and the jobId in the URL params.
      // Adjust applicationData structure based on what your backend expects for an application.
      // const applicationData = {
      //   userId: currentUserId,
      //   jobId: job._id,
      //   // Potentially add more fields like a cover letter, resume link, etc.
      //   // For now, it might just be the user applying for the job.
      // };
      
      const data = await applyForJob(job._id); // Pass jobId to the API function
      alert(data.message);
      // Optionally, redirect user or show confirmation
      navigate('/jobs'); // Go back to jobs list
    } catch (err) {
      console.error('Error applying for job:', err);
      alert(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container text-center">
        <p className="text-gray-600">Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container text-center text-red-600">
        <p>{error}</p>
        <Button onClick={() => navigate('/jobs')} className="mt-4">Back to Jobs</Button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="page-container text-center">
        <p className="text-gray-600">Job not found.</p>
        <Button onClick={() => navigate('/jobs')} className="mt-4">Back to Jobs</Button>
      </div>
    );
  }

  return (
    <div className="page-container max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-2"><strong>Job Title: {job.title}</strong></h1>
      <p className="text-lg text-gray-600 mb-4">
        <strong>Company:</strong> {job.companyName}
      </p>

      <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
        <p className="text-gray-700 text-base mb-3">
          <i className="fas fa-map-marker-alt text-gray-500 mr-2"></i>
          <strong>Location:</strong> {job.location || 'Remote'}
        </p>
        <p className="text-gray-700 text-base mb-3">
          <i className="fas fa-money-bill-wave text-gray-500 mr-2"></i>
          <strong>Salary:</strong> {job.salary ? `${job.salary}` : 'Negotiable'}
        </p>
        <p className="text-gray-700 text-base mb-3">
          <i className="fas fa-calendar-alt text-gray-500 mr-2"></i>
          <strong>Posted:</strong> {new Date(job.createdAt).toLocaleDateString()}
        </p>
        {job.jobImg && (
          <div className="mt-4">
            <img 
              src={job.jobImg} 
              alt="Job Illustration" 
              className="w-full max-h-60 object-contain rounded-md border border-gray-300" 
            />
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Job Description</h3>
        <p className="text-gray-700 leading-relaxed">{job.description}</p>
      </div>

      <div className="flex justify-end gap-4">
        <Button 
          onClick={handleApply} 
          disabled={isApplying} 
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg text-lg"
        >
          {isApplying ? 'Applying...' : 'Apply Now'}
        </Button>
        <Button 
          onClick={() => navigate('/jobs')} 
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-8 rounded-lg text-lg"
        >
          Back to Jobs
        </Button>
      </div>
    </div>
  );
}