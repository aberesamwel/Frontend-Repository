/**
 * App Shell - Renders immediately without API dependencies
 * Critical for fast perceived performance
 */
import React, { Suspense } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Navigation from './Navigation';
import SkeletonLoader from './SkeletonLoader';

const AppShell = ({ children }) => {
  const { theme } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();

  // Render shell immediately - no API blocking
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navigation renders immediately with cached user data */}
      <Navigation />
      
      <main className="flex-1">
        {isLoading ? (
          <SkeletonLoader />
        ) : isAuthenticated ? (
          <Suspense fallback={<SkeletonLoader />}>
            {children}
          </Suspense>
        ) : (
          <div>Please log in</div>
        )}
      </main>
    </div>
  );
};

export default AppShell;