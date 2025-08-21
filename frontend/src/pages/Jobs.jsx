// src/pages/Jobs.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllJobs, searchJobs } from '../api';
import JobCard from '../components/JobCard';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

  const navigate = useNavigate();

const fetchAllJobs = async () => {
  try {
    setLoading(true);
    setError(null);

    const data = await getAllJobs(); // Use the API function
    console.log('Fetched jobs:', data);

    setJobs(data.jobs || []);
  } catch (err) {
    console.error('Error fetching all jobs:', err);
    setError(err.response?.data?.message || 'Failed to load jobs. Please try again later.');
    setJobs([]);
  } finally {
    setLoading(false);
  }
};


  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearchSubmitted(true);  
    if (!searchTerm.trim()) {
      setIsSearchSubmitted(false);
      fetchAllJobs(); // If search term is empty, fetch all jobs again
      return;
    }
    try {
      setLoading(true);
      setError(null);
      // Backend expects query parameters: /api/jobs/search?title=keyword&location=city
      // Adapt this based on how your backend's searchJobs route expects parameters.
      // For now, assuming it searches by title or description with a single 'q' parameter.
      const queryParams = { q: searchTerm }; // Adjust if backend uses different params like { title: searchTerm }
      const { jobs: searchedJobs } = await searchJobs(queryParams);
      setJobs(searchedJobs || []);
    } catch (err) {
      console.error('Error searching jobs:', err);
      setError('Failed to search jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const handlePostJobClick = () => {
    navigate('/post-job');
  };

  return (
    <div className="page-container">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Job Listings</h2>

      <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
          <Input
            placeholder="Search jobs by title, company, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Search Jobs
          </Button>
        </form>
        {!searchTerm.trim() && (
        <div className="text-center md:text-left">
          <Button onClick={handlePostJobClick} className="bg-green-600 hover:bg-green-700">
            Post a New Job
          </Button>
          </div>
        )}
      </div>

      {loading && <p className="text-center text-gray-600">Loading jobs...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {!loading && !error && jobs.length === 0 && (
        <p className="text-center text-gray-600">No jobs found. Try adjusting your search or be the first to post one!</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!loading && !error && jobs.map(job => (
          <JobCard key={job._id} job={job} isSearchResult={isSearchSubmitted}/>
        ))}
      </div>
    </div>
  );
}