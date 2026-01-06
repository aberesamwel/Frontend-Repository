/**
 * Optimized App Component - Fast startup architecture
 * Renders shell immediately, defers heavy operations
 */
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/PersistentAuthContext';
import { QueryProvider, prefetchCriticalData } from './hooks/useQueryClient';
import AppShell from './components/AppShell';
import LazyRoutes from './routes/LazyRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function App() {
  // Prefetch critical data in background after first render
  useEffect(() => {
    // Use setTimeout to defer until after first paint
    setTimeout(() => {
      prefetchCriticalData().catch(console.warn);
    }, 100);
  }, []);

  return (
    <ErrorBoundary>
      <QueryProvider>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <AppShell>
                <LazyRoutes />
              </AppShell>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;