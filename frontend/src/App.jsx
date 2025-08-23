// src/App.jsx
// Main application component, handles routing and conditional rendering based on authentication.
import React, { useEffect, useState } from "react";
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
import UserProfileView from "./pages/UserProfileView"; // Import UserProfileView
import OnboardingWizard from "./pages/OnboardingWizard"; // Import OnboardingWizard
import Settings from "./pages/Settings";
import Suggestions from "./pages/Suggestions";
import { jwtDecode } from "jwt-decode"; // For decoding JWT
import AppliedJobs from "./pages/AppliedJobs";
import { API_URL } from './config/config'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserProfileId, setCurrentUserProfileId] = useState(null); // Added for userProfileId

  useEffect(() => {
    const token = localStorage.getItem("token");
    const profileId = localStorage.getItem("profileId"); // Get profileId from localStorage

    if (token) {
      try {
        // const payload = jwtDecode(token);
        // const userId = payload.id || payload._id || payload.userId || payload.sub; // Fallback options for userId
        // console.log("Decoded token payload:", payload, "Resolved userId:", userId);
        const fetchUserProfileId = async() => {
          try {
          const response = await fetch(`${API_URL}/api/user/profile`, {
            method: 'GET',
            headers: {
              'Content-Type':'application/json',
              'Authorization' : `Bearer ${token}`
            }
          });

          const data = await response.json();

          if(response.ok) {
            setCurrentUserId(data.profile._id);
            console.log('currentUserId', data.profile._id);
            setIsAuthenticated(true);
          } else {
            console.log('profileId Error data',data); 
          }
        } catch (err) {
          console.error(err);
        }
        }

        fetchUserProfileId();
        
      } catch (err) {
        console.error("Error decoding token:", err);
        setIsAuthenticated(false);
        localStorage.removeItem("token"); // Clear invalid token
      }
    } else {
      setIsAuthenticated(false);
      setCurrentUserId(null);
    }

    // Set the userProfileId if available
    if (profileId) {
      setCurrentUserProfileId(profileId);
    } else {
      setCurrentUserProfileId(null);
    }

  }, []); // Run once on component mount

  // Function to update auth state (e.g., after login/logout)
  const updateAuth = () => {
    const token = localStorage.getItem("token");
    const profileId = localStorage.getItem("profileId");

    if (token) {
      try {
        const payload = jwtDecode(token);
        const userId = payload.id || payload._id || payload.userId;
        setCurrentUserId(userId);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Error decoding token:", err);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      }
    } else {
      setIsAuthenticated(false);
      setCurrentUserId(null);
    }

    if (profileId) {
      setCurrentUserProfileId(profileId);
    } else {
      setCurrentUserProfileId(null);
    }
  };


  return (
    <>
      {/* Navbar visibility depends on authentication status */}
      <Navbar isAuthenticated={isAuthenticated} currentUserId={currentUserId} updateAuth={updateAuth} />
      <div className="content-area">
        <Routes>
          {isAuthenticated ? (
            // Protected Routes - accessible only when logged in
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/feed" element={<Feed currentUserId={currentUserId} />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/connections" element={<Connections currentUserId={currentUserId} currentUserProfileId={currentUserProfileId} />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:jobId" element={<JobDetails currentUserId={currentUserId} />} />
              <Route path="/post-job" element={<PostJob currentUserId={currentUserId} />} />
              <Route path="/chat" element={<ChatWindow currentUserId={currentUserId} />} />
              {/* Profile page relies on profileId, needs to be handled */}
              <Route path="/profile" element={<Profile currentUserId={currentUserId} />} />
              <Route path="/edit-profile" element={<EditProfile currentUserId={currentUserId} />} />
              <Route path="/users/:id" element={<UserProfileView currentUserId={currentUserId} currentUserProfileId={currentUserProfileId} />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/suggestions" element={<Suggestions />} />
              <Route path="/appliedJobs" element={<AppliedJobs />} />
              {/* Redirect to dashboard or profile if logged in and trying to access auth pages */}
              <Route path="/login" element={<Navigate to="/dashboard" />} />
              <Route path="/signup" element={<Navigate to="/dashboard" />} />
              {/* Onboarding Wizard route */}
              <Route path="/onboarding" element={<OnboardingWizard currentUserId={currentUserId} />} />
              {/* Default route for authenticated users */}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          ) : (
            // Public Routes - accessible when not logged in
            <>
              <Route path="/login" element={<Login updateAuth={updateAuth} />} />
              <Route path="/signup" element={<SignUp />} />
              {/* Redirect to login if not logged in and trying to access protected routes */}
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </div>
    </>
  );
}

export default App;