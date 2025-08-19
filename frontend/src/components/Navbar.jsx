// src/components/Navbar.jsx
// Navigation bar component.
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ isAuthenticated, currentUserId, updateAuth }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profileId"); // Clear profileId on logout
    updateAuth(); // Update auth state in App.jsx
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="text-xl font-bold">Opvia</Link>
        <div className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/feed" className="hover:text-gray-300">Feed</Link>
              <Link to="/jobs" className="hover:text-gray-300">Jobs</Link>
              <Link to="/connections" className="hover:text-gray-300">Connections</Link>
              <Link to="/chat" className="hover:text-gray-300">Chat</Link>
              <Link to="/profile" className="hover:text-gray-300">Profile</Link>
              <Link to="/notifications" className="hover:text-gray-300">Notifications</Link>
              <Link to="/settings" className="hover:text-gray-300">Settings</Link>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/signup" className="hover:text-gray-300">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}