// src/pages/Settings.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Settings() {
  return (
    <div className="page-container max-w-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Settings</h2>
      
      <div className="space-y-4">
        <Link 
          to="/edit-profile" 
          className="block bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-between"
        >
          <span className="font-medium text-gray-800">Edit Profile Information</span>
          <i className="fas fa-chevron-right text-gray-500"></i>
        </Link>

        {/* Placeholder for other settings options */}
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between text-gray-500 cursor-not-allowed opacity-70">
          <span className="font-medium">Change Password (Not implemented)</span>
          <i className="fas fa-chevron-right"></i>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between text-gray-500 cursor-not-allowed opacity-70">
          <span className="font-medium">Notification Preferences (Not implemented)</span>
          <i className="fas fa-chevron-right"></i>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between text-gray-500 cursor-not-allowed opacity-70">
          <span className="font-medium">Privacy Settings (Not implemented)</span>
          <i className="fas fa-chevron-right"></i>
        </div>
      </div>
    </div>
  );
}