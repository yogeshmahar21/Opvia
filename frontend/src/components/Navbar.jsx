import React from 'react';
import { NavLink } from 'react-router-dom';
import { BsBellFill, BsFillChatDotsFill } from 'react-icons/bs';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = ({ token }) => {
  const authLinks = (
    <ul>
      <li><NavLink to="/dashboard">Dashboard</NavLink></li>
      <li><NavLink to="/feed">Feed</NavLink></li>
      <li><NavLink to="/connections">Connections</NavLink></li>
      <li><NavLink to="/jobs">Jobs</NavLink></li>
      <li><NavLink to="/notifications"><BsBellFill /></NavLink></li>
      <li><NavLink to="/chat"><BsFillChatDotsFill /></NavLink></li>
      <li><NavLink to="/profile"><FaUserCircle /></NavLink></li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li><NavLink to="/login">Login</NavLink></li>
      <li><NavLink to="/signup">Sign Up</NavLink></li>
    </ul>
  );

  return (
    <nav className="navbar">
      <div className="logo">Opvia</div>
      {token ? authLinks : guestLinks}
    </nav>
  );
};

export default Navbar;
