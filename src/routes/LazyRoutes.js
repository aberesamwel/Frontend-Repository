/**
 * Lazy Routes - Code splitting for faster initial load
 * Heavy pages load only when needed
 */
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorBoundary from '../components/ErrorBoundary';

// Lazy load heavy components
const Dashboard = lazy(() => import('../pages/Dashboard'));
const MetalWorks = lazy(() => import('../pages/MetalWorks'));
const TruckBodyProjects = lazy(() => import('../pages/TruckBodyProjects'));
const Materials = lazy(() => import('../pages/Materials'));
const Tools = lazy(() => import('../pages/Tools'));
const Analytics = lazy(() => import('../pages/Analytics'));

// Lightweight wrapper for lazy routes
const LazyRoute = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={<SkeletonLoader />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={
      <LazyRoute>
        <Dashboard />
      </LazyRoute>
    } />
    
    <Route path="/metalworks" element={
      <LazyRoute>
        <MetalWorks />
      </LazyRoute>
    } />
    
    <Route path="/projects" element={
      <LazyRoute>
        <TruckBodyProjects />
      </LazyRoute>
    } />
    
    <Route path="/materials" element={
      <LazyRoute>
        <Materials />
      </LazyRoute>
    } />
    
    <Route path="/tools" element={
      <LazyRoute>
        <Tools />
      </LazyRoute>
    } />
    
    <Route path="/analytics" element={
      <LazyRoute>
        <Analytics />
      </LazyRoute>
    } />
  </Routes>
);

export default AppRoutes;