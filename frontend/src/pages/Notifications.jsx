// src/pages/Notifications.jsx
import React, { useState, useEffect } from 'react';
// import api from '../api'; // Uncomment if you have a backend notifications API

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching notifications from a backend
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real app, you'd fetch from your backend:
        // const response = await api.get('/api/notifications');
        // setNotifications(response.data);

        // Dummy data for now
        const dummyNotifications = [
          { id: 1, type: 'post_like', message: 'John liked your post.', timestamp: new Date(Date.now() - 3600000) },
          { id: 2, type: 'connection_request', message: 'Alice sent you a connection request.', timestamp: new Date(Date.now() - 7200000) },
          { id: 3, type: 'comment', message: 'Bob commented on your post.', timestamp: new Date(Date.now() - 10800000) },
          { id: 4, type: 'job_application', message: 'Your job application for "Software Engineer" was viewed.', timestamp: new Date(Date.now() - 14400000) },
          { id: 5, type: 'connection_accepted', message: 'Sarah accepted your connection request.', timestamp: new Date(Date.now() - 18000000) },
        ];
        setNotifications(dummyNotifications);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'post_like':
        return <i className="fas fa-thumbs-up text-blue-500"></i>;
      case 'connection_request':
        return <i className="fas fa-user-plus text-green-500"></i>;
      case 'comment':
        return <i className="fas fa-comment text-purple-500"></i>;
      case 'job_application':
        return <i className="fas fa-briefcase text-yellow-500"></i>;
      case 'connection_accepted':
        return <i className="fas fa-users text-indigo-500"></i>;
      default:
        return <i className="fas fa-bell text-gray-500"></i>;
    }
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    let interval = seconds / 31536000; // years
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000; // months
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400; // days
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600; // hours
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60; // minutes
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  if (loading) {
    return (
      <div className="page-container text-center">
        <p className="text-gray-600">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container max-w-2xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h2>
      
      {notifications.length === 0 ? (
        <p className="text-gray-600 text-center">No new notifications.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className="flex items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 mr-4 text-xl">
                {getNotificationIcon(notification.type)}
              </div>
              <div>
                <p className="text-gray-700 text-base">{notification.message}</p>
                <span className="text-gray-500 text-sm">{getTimeAgo(notification.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}