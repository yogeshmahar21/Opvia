// src/main.jsx
// This is the entry point of your React application.
// It sets up the root React component and integrates React Router for navigation.
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css'; // Global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter enables client-side routing */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);