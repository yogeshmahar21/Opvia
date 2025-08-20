// src/components/Input.jsx
// Reusable input component with basic styling.
import React from 'react';

export default function Input({ name, placeholder, value, onChange, type = 'text', className = '', readOnly = false, style = {}, title = '' }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      style={style}
      title={title}
      className={`w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
}