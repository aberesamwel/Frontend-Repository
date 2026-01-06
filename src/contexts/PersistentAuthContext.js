/**
 * Persistent Auth Context - Prevents re-initialization on reload
 * Uses localStorage for instant auth state restoration
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  // Initialize from localStorage immediately - no API call
  const [authState, setAuthState] = useState(() => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user_data');
    
    return {
      isAuthenticated: !!token,
      token,
      user: user ? JSON.parse(user) : null,
      isLoading: false // Start as false for immediate render
    };
  });

  // Background token validation (non-blocking)
  useEffect(() => {
    if (authState.token) {
      validateTokenInBackground();
    }
  }, []);

  const validateTokenInBackground = async () => {
    try {
      const response = await fetch('/api/auth/validate/', {
        headers: { 'Authorization': `Bearer ${authState.token}` }
      });
      
      if (!response.ok) {
        logout();
      }
    } catch (error) {
      // Silent fail - keep user logged in for better UX
      console.warn('Token validation failed:', error);
    }
  };

  const login = (token, userData) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setAuthState({
      isAuthenticated: true,
      token,
      user: userData,
      isLoading: false
    });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null,
      isLoading: false
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};