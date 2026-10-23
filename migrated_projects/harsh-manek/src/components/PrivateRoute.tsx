import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { } = useAuth(); // session removed
  
  if (false) {
    return <Navigate to="/portal/login" replace />;
  }
  
  return <>{children}</>;
};

