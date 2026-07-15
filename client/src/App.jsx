import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Import Screens
import Login from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import DashboardContainer from './pages/DashboardContainer.jsx'; // Your main app layout code

export default function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Authentication Gateways */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" replace />} />
        <Route path="/reset-password/:token" element={!user ? <ResetPassword /> : <Navigate to="/" replace />} />

        {/* Private Core Application Routing */}
        <Route path="/" element={user ? <DashboardContainer /> : <Navigate to="/login" replace />} />
        
        {/* Global Fallback Redirect */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}