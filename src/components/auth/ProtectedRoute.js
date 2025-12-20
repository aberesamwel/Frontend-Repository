import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './LoginForm';
import ForgotPasswordForm from './ForgotPasswordForm';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, login } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showForgotPassword) {
      return (
        <ForgotPasswordForm 
          onBack={() => setShowForgotPassword(false)}
        />
      );
    }
    
    return (
      <LoginForm 
        onLogin={login}
        onForgotPassword={() => setShowForgotPassword(true)}
      />
    );
  }

  return children;
};

export default ProtectedRoute;