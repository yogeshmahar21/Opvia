// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="logo">Opvia</div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/feed">Feed</Link></li>
        <li><Link to="/jobs">Jobs</Link></li>
        <li><Link to="/connections">Connections</Link></li>
        <li><Link to="/chat">Chat</Link></li>
        {user ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={onLogout} className="logout-btn">Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
