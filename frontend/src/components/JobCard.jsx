// src/components/JobCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
      <Link to={`/jobs/${job._id}`} className="block">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors duration-200">
          {job.title}
        </h3>
      </Link>
      <p className="text-gray-600 text-sm mb-2">
        <strong>Company:</strong> {job.companyName}
      </p>
      <p className="text-gray-700 text-base mb-4">
        {job.description?.substring(0, 100)}...
      </p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>
          <i className="fas fa-map-marker-alt mr-1"></i> {job.location || 'Remote'}
        </span>
        <span>
          <i className="fas fa-money-bill-wave mr-1"></i> {job.salary ? `$${job.salary}` : 'Negotiable'}
        </span>
      </div>
    </div>
  );
}