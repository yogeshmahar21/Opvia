// src/components/AvatarUploader.jsx
// Component for uploading user profile avatars.
import React, { useState } from 'react';

export default function AvatarUploader({ onFileChange, previewUrl }) {
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        onFileChange(null);
        return;
      }
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('Only JPEG, PNG, and GIF images are allowed');
        onFileChange(null);
        return;
      }
      setError(null);
      onFileChange(file);
    } else {
      onFileChange(null);
    }
  };

  return (
    <div className="flex flex-col items-center mb-4 p-4 border rounded-lg shadow-sm bg-gray-50">
      <label htmlFor="avatar-upload" className="block text-gray-700 text-sm font-bold mb-2">
        Profile Picture
      </label>
      <input
        type="file"
        id="avatar-upload"
        accept="image/jpeg,image/png,image/gif"
        onChange={handleFileSelect}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {previewUrl && (
        <div className="mt-4">
          <img src={previewUrl} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover border-2 border-blue-400 shadow" />
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}