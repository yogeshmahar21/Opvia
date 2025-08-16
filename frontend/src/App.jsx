// src/App.jsx
import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import api from "./api";

// pages
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import OnboardingWizard from "./pages/OnboardingWizard";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import PostJob from "./pages/PostJob";
import Connections from "./pages/Connections";
import Suggestions from "./pages/Suggestions";
import UserProfileView from "./pages/UserProfileView";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import ChatWindow from "./pages/ChatWindow";
import CreatePost from "./pages/CreatePost";

// simple top nav (no styles)
const Nav = ({ user, onLogout }) => (
  <nav>
    <a href="/">Home</a>{" | "}
    <a href="/feed">Feed</a>{" | "}
    <a href="/jobs">Jobs</a>{" | "}
    <a href="/connections">Connections</a>{" | "}
    <a href="/chat">Chat</a>{" | "}
    {user ? (
      <>
        <a href="/profile">Profile</a>{" | "}
        <a href="/settings">Settings</a>{" | "}
        <button onClick={onLogout}>Logout</button>
      </>
    ) : (
      <>
        <a href="/login">Login</a>{" | "}
        <a href="/signup">Sign Up</a>
      </>
    )}
  </nav>
);

export const AuthContext = createContext(null);

const Protected = ({ children, user }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  const [user, setUser] = useState(null);

  const loadMe = async () => {
    try {
      const { data } = await api.get("/api/profile"); // returns current user
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, refresh: loadMe }}>
      <Router>
        <Nav user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/onboarding" element={<Protected user={user}><OnboardingWizard /></Protected>} />
          <Route path="/profile" element={<Protected user={user}><Profile /></Protected>} />
          <Route path="/edit-profile" element={<Protected user={user}><EditProfile /></Protected>} />
          <Route path="/dashboard" element={<Protected user={user}><Dashboard /></Protected>} />
          <Route path="/feed" element={<Protected user={user}><Feed /></Protected>} />
          <Route path="/create-post" element={<Protected user={user}><CreatePost /></Protected>} />
          <Route path="/jobs" element={<Protected user={user}><Jobs /></Protected>} />
          <Route path="/jobs/:id" element={<Protected user={user}><JobDetails /></Protected>} />
          <Route path="/post-job" element={<Protected user={user}><PostJob /></Protected>} />
          <Route path="/connections" element={<Protected user={user}><Connections /></Protected>} />
          <Route path="/suggestions" element={<Protected user={user}><Suggestions /></Protected>} />
          <Route path="/users/:id" element={<Protected user={user}><UserProfileView /></Protected>} />
          <Route path="/notifications" element={<Protected user={user}><Notifications /></Protected>} />
          <Route path="/settings" element={<Protected user={user}><Settings /></Protected>} />
          <Route path="/chat" element={<Protected user={user}><ChatWindow /></Protected>} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}
