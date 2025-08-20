// src/components/JobCard.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from './Button';

export default function JobCard({ job, isSearchResult }) {
  const navigate = useNavigate();

  const handleApply = () => {
    navigate(`/jobs/${job._id}`);
  };

  const handleBack = () => {
    navigate('/jobs');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
      <h3>
  <Link
    to={`/jobs/${job._id}`}
    className="inline-block px-4 py-2 mb-2 bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition no-underline cursor-pointer"
  >
    {job.title}
  </Link>
</h3>


      <p className="text-gray-600 text-sm mb-2">
        <strong>Company:</strong> {job.companyName}
      </p>
      <p className="text-gray-700 text-base mb-4">
        {job.description?.substring(0, 100)}...
      </p>
      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <span>
          <i className="fas fa-map-marker-alt mr-1"></i> {job.location || 'Remote'}
        </span>
        <span>
          <i className="fas fa-money-bill-wave mr-1"></i> {job.salary ? `$${job.salary}` : 'Negotiable'}
        </span>
      </div>

      {isSearchResult && (
        <div className="flex gap-4 mt-2">
          <Button
            onClick={handleApply}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Apply Now
          </Button>
          <Button
            onClick={handleBack}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
          >
            Back to Jobs
          </Button>
        </div>
      )}
    </div>
  );
}
