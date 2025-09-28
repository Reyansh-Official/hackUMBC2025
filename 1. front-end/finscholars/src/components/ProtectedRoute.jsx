import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Component that protects routes requiring authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isNewUser } = useAuth();
  
  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect new users to onboarding
  if (isNewUser) {
    return <Navigate to="/onboarding" replace />;
  }
  
  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;