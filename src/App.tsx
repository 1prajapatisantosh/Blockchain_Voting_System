import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Web3Provider } from './contexts/Web3Context';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Elections from './pages/Elections';
import ElectionDetail from './pages/ElectionDetail';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import Results from './pages/Results';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import CreateElection from './pages/admin/CreateElection';
import ManageElections from './pages/admin/ManageElections';
import EditElection from './pages/admin/EditElection';
import ElectionResults from './pages/admin/ElectionResults';
import VerifyVoters from './pages/admin/VerifyVoters';

// Not Found Page
const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="/"
          className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90"
        >
          Go Home
        </a>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center px-5 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

// Create the router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/admin-login',
    element: <AdminLogin />,
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/elections',
    element: (
      <ProtectedRoute>
        <Elections />
      </ProtectedRoute>
    ),
  },
  {
    path: '/results',
    element: (
      <ProtectedRoute>
        <Results />
      </ProtectedRoute>
    ),
  },
  {
    path: '/elections/:id',
    element: (
      <ProtectedRoute>
        <ElectionDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute requireAdmin>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/create-election',
    element: (
      <ProtectedRoute requireAdmin>
        <CreateElection />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/manage-elections',
    element: (
      <ProtectedRoute requireAdmin>
        <ManageElections />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/edit-election/:id',
    element: (
      <ProtectedRoute requireAdmin>
        <EditElection />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/election-results/:id',
    element: (
      <ProtectedRoute requireAdmin>
        <ElectionResults />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/verify-voters',
    element: (
      <ProtectedRoute requireAdmin>
        <VerifyVoters />
      </ProtectedRoute>
    ),
  },
  // 404 page - must be last
  {
    path: '*',
    element: <NotFound />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <Web3Provider>
        <RouterProvider router={router} />
      </Web3Provider>
    </AuthProvider>
  );
}

export default App;
