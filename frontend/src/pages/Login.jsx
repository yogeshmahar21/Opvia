// src/pages/Login.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button>Login</button>
        <Link to="/signup">Don’t have an account? Sign Up</Link>
        <a href="/auth/google" className="google-btn">Login with Google</a>
      </div>
    </div>
  );
}
