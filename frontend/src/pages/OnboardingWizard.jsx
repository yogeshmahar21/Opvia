// src/pages/OnboardingWizard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import AvatarUploader from '../components/AvatarUploader';
import { createProfile } from '../api';
import { jwtDecode } from 'jwt-decode';

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [profileName, setProfileName] = useState('');
  const [profileAbout, setProfileAbout] = useState('');
  const [profileSkills, setProfileSkills] = useState(''); // comma-separated string
  const [profileStatus, setProfileStatus] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Extract username from token to use as default profile name
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log(token);
      try {
        const decodedToken = jwtDecode(token);
        const fetchName = async () => {
          const res = await fetch(`http://localhost:5000/api/users`, {
            method: 'GET',
            headers: {
              'Content-Type' : 'application/json',
              'Authorization' : `Bearer ${token}`
            }
          });

          const data = await res.json();

          if(res.ok) {
            setProfileName(data.Username);
            console.log(data);
          } else {
            console.error('failed to fetch');
            console.log(res);
          }
        }
        fetchName();
      } catch (e) {
        console.error("Error decoding token for username:", e);
      }
    }
  }, []);

  const handleNext = () => {
    setError(null); // Clear errors on next
    if (step === 1) {
      if (!profileName.trim()) {
        setError("Name is required.");
        return;
      }
      if (!profilePicFile) {
        setError("Profile picture is required.");
        return;
      }
    } else if (step === 2) {
      // About is optional, skills are required
      if (!profileSkills.trim()) {
        setError("Skills are required (comma-separated).");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep(step - 1);
  };

  const handleFileChange = (file) => {
    setProfilePicFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePicPreview(null);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('skills', profileSkills.split(',').map(s => s.trim()).filter(Boolean).join(',')); // Backend expects comma-separated string
    formData.append('userStatus', profileStatus); // Match backend field name
    formData.append('ProfileImg', profilePicFile);
    if (profilePicFile) {
      // formData.append('ProfileImg', profilePicFile); // Match backend's expected field name
    }
    // 'name' is part of the URL param on backend, not body for createProfile

    try {
      // Backend createProfile route: POST /api/users/profile/:name
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/user/profile/${profileName}`, {
          method: 'POST',
          headers: {
            'Authorization' : `Bearer ${token}`
          },
          body: formData
        });

        const data = await res.json();

        if(res.ok) {
          console.log('Profile created successfully!');
          alert(data);
          setTimeout(()=>{
            navigate('/dashboard');
          },2000);
        }
      } catch (err) {
        console.error(err);
      }
      const response = await createProfile(profileName, formData);
      localStorage.setItem('profileId', response.ProfileID); // Store the returned profile ID
      alert('Profile created successfully!');
      navigate('/dashboard'); // Redirect to dashboard or profile page
    } catch (err) {
      console.error('Error creating profile:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {step === 1 && "Create Your Profile (Step 1/2)"}
          {step === 2 && "Tell Us More (Step 2/2)"}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Input
              placeholder="Your Full Name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              readOnly={true} // Name is read-only, pulled from JWT/User
              style={{ cursor: "not-allowed", backgroundColor: "#f0f0f0" }}
            />
            <AvatarUploader onFileChange={handleFileChange} previewUrl={profilePicPreview} />
            <Button onClick={handleNext} className="w-full">Next</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <textarea
              placeholder="Tell us about yourself (e.g., your experience, interests)"
              rows="4"
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={profileAbout}
              onChange={(e) => setProfileAbout(e.target.value)}
            />
            <Input
              placeholder="Skills (e.g., React, Node.js, Marketing, Sales)"
              value={profileSkills}
              onChange={(e) => setProfileSkills(e.target.value)}
            />
            <Input
              placeholder="Current Status (e.g., Open to Work, Hiring, Student)"
              value={profileStatus}
              onChange={(e) => setProfileStatus(e.target.value)}
            />
            <div className="flex justify-between gap-4">
              <Button onClick={handleBack} className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800">Back</Button>
              <Button onClick={handleSubmit} disabled={loading} className="w-1/2 bg-blue-600 hover:bg-blue-700">
                {loading ? 'Creating Profile...' : 'Finish'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}