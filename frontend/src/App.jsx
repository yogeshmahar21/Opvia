// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Connections from "./pages/Connections";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import PostJob from "./pages/PostJob";
import ChatWindow from "./pages/ChatWindow";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import EditProfile from "./pages/EditProfile";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const token = localStorage.getItem("token");

function App() {
  return (
    <>
      <Navbar token={token} />
      <Routes>
        {token ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:jobId" element={<JobDetails />} /> 
            <Route path="/chat" element={<ChatWindow />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
