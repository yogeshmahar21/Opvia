// src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="page-container text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Opvia!</h2>
      <p className="text-lg text-gray-700 mb-8">
        Your professional network and career hub.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/feed" className="block p-6 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out">
          <i className="fas fa-newspaper text-4xl mb-3"></i>
          <h3 className="text-xl font-semibold mb-2">View Feed</h3>
          <p className="text-sm opacity-90">See what's new from your connections.</p>
        </Link>
        
        <Link to="/jobs" className="block p-6 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-300 ease-in-out">
          <i className="fas fa-briefcase text-4xl mb-3"></i>
          <h3 className="text-xl font-semibold mb-2">Find Jobs</h3>
          <p className="text-sm opacity-90">Explore new career opportunities.</p>
        </Link>
        
        <Link to="/profile" className="block p-6 bg-purple-500 text-white rounded-lg shadow-lg hover:bg-purple-600 transition duration-300 ease-in-out">
          <i className="fas fa-user-circle text-4xl mb-3"></i>
          <h3 className="text-xl font-semibold mb-2">My Profile</h3>
          <p className="text-sm opacity-90">Manage your professional identity.</p>
        </Link>

        <Link to="/connections" className="block p-6 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300 ease-in-out">
          <i className="fas fa-users text-4xl mb-3"></i>
          <h3 className="text-xl font-semibold mb-2">My Network</h3>
          <p className="text-sm opacity-90">Connect with other professionals.</p>
        </Link>

        <Link to="/chat" className="block p-6 bg-indigo-500 text-white rounded-lg shadow-lg hover:bg-indigo-600 transition duration-300 ease-in-out">
          <i className="fas fa-comments text-4xl mb-3"></i>
          <h3 className="text-xl font-semibold mb-2">Messages</h3>
          <p className="text-sm opacity-90">Chat with your connections.</p>
        </Link>

        <Link to="/create-post" className="block p-6 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-300 ease-in-out">
          <i className="fas fa-feather-alt text-4xl mb-3"></i>
          <h3 className="text-xl font-semibold mb-2">Create Post</h3>
          <p className="text-sm opacity-90">Share your thoughts and updates.</p>
        </Link>
      </div>

      <p className="mt-12 text-gray-500 text-sm">
        Opvia - Connecting professionals, empowering careers.
      </p>
    </div>
  );
}