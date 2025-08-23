// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { loginUser } from '../api';
import { API_URL } from '../config/config';

export default function Login({ updateAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('profileId', response.profileId); // Store profileId
      updateAuth();
      try {
        const res = await fetch(`${API_URL}/api/user/profile`, {
          method: 'GET',
          headers: {
            'Accept':'application/json',
            'Authorization':`Bearer ${response.token}`
          }
        });
        if(res.ok) {
          window.location.reload();
        }
      } catch (err) {
        console.error(err);
      }
       // Notify App.jsx about authentication change
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (err) {
      console.error('Login error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend's Google OAuth initiation endpoint
    window.location.href = `${API_URL}/auth/google`; 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login to Opvia</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Logging In...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">Or log in with</p>
          <Button 
            onClick={handleGoogleLogin} 
            className="w-full bg-red-600 hover:bg-red-700 flex items-center justify-center space-x-2"
          >
            <i className="fab fa-google"></i> <span>Login with Google</span>
          </Button>
        </div>

        <p className="mt-8 text-center text-gray-700">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}