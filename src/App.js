import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import LoadingSpinner from './components/common/LoadingSpinner';

// Styles
import './index.css';

// Conditionally import error boundary and devtools
import { ErrorBoundary } from 'react-error-boundary';

// Lazy load Devtools only in development
const ReactQueryDevtools = React.lazy(() =>
  process.env.NODE_ENV === 'development'
    ? import('@tanstack/react-query-devtools').then(mod => ({ default: mod.ReactQueryDevtools }))
    : Promise.resolve({ default: () => null })
);




// Conditionally import ErrorFallback
let ErrorFallback;
try {
  ErrorFallback = require('./components/common/ErrorFallback').default;
} catch (error) {
  // Fallback component if ErrorFallback doesn't exist
  ErrorFallback = ({ error, resetErrorBoundary }) => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-red-600 mb-4">Something went wrong</h1>
        <button 
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Demo = React.lazy(() => import('./pages/Demo'));
const Search = React.lazy(() => import('./pages/Search'));
const Mapping = React.lazy(() => import('./pages/Mapping'));
const FhirPlayground = React.lazy(() => import('./pages/FhirPlayground'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const NotFound = React.lazy(() => import('./pages/NotFound'));



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Desktop: sidebar is always "open" but can be collapsed
        setIsSidebarOpen(true);
      } else {
        // Mobile: sidebar is closed by default
        setIsSidebarOpen(false);
        setIsSidebarCollapsed(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      // Desktop: toggle collapsed state
      setIsSidebarCollapsed(!isSidebarCollapsed);
    } else {
      // Mobile: toggle open/close
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const toggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log error to your error reporting service
        console.error('Application Error:', error, errorInfo);
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-200">
                <Navbar 
                  onToggleSidebar={toggleSidebar}
                  isSidebarOpen={isSidebarOpen}
                />
                <div className="flex">
                  <Sidebar 
                    isOpen={isSidebarOpen}
                    onClose={closeSidebar}
                    isCollapsed={isSidebarCollapsed}
                    onToggleCollapse={toggleCollapse}
                  />
                  <main 
                    className={`flex-1 pt-16 p-6 transition-all duration-300 ${
                      isSidebarOpen && window.innerWidth >= 1024
                        ? isSidebarCollapsed 
                          ? 'lg:ml-16' 
                          : 'lg:ml-64'
                        : ''
                    }`}
                  >
                    <div className="max-w-7xl mx-auto">
                      <Suspense 
                        fallback={
                          <div className="flex items-center justify-center min-h-[400px]">
                            <LoadingSpinner />
                          </div>
                        }
                      >
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/demo" element={<Demo />} />
                          <Route path="/search" element={<Search />} />
                          <Route path="/mapping" element={<Mapping />} />
                          <Route path="/fhir" element={<FhirPlayground />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                    </div>
                  </main>
                </div>
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'var(--toast-bg)',
                      color: 'var(--toast-color)',
                    },
                    success: {
                      iconTheme: {
                        primary: '#10b981',
                        secondary: '#ffffff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#ffffff',
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </AuthProvider>
        </ThemeProvider>
        {/* React Query DevTools - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;