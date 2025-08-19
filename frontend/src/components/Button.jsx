// src/components/Button.jsx
// Reusable button component with basic styling.
import React from 'react';

export default function Button({ children, onClick, disabled, className = '' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}