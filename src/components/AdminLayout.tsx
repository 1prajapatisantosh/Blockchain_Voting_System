import React, { ReactNode, useEffect, useRef } from 'react';
import AdminNavbar from './AdminNavbar';
import { useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

interface AdminLayoutProps {
  children: ReactNode;
}

// Create a map to store scroll positions by pathname
const scrollPositions = new Map<string, number>();

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // Save scroll position when leaving a page
  useEffect(() => {
    const saveScrollPosition = () => {
      if (mainRef.current) {
        scrollPositions.set(location.pathname, window.scrollY);
      }
    };

    // Add event listener
    window.addEventListener('beforeunload', saveScrollPosition);

    return () => {
      // Save position when component unmounts (navigation)
      saveScrollPosition();
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, [location]);

  // Restore scroll position when returning to a page or scroll to top for new pages
  useEffect(() => {
    if (mainRef.current) {
      // Get saved position or default to top of page
      const savedPosition = scrollPositions.get(location.pathname) || 0;

      // Use requestAnimationFrame to ensure scrolling happens after render
      requestAnimationFrame(() => {
        window.scrollTo(0, savedPosition);
      });
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main ref={mainRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <footer className="bg-white shadow-inner mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Blockchain Voting System Admin Panel • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
      <Toaster position="top-right" />
    </div>
  );
};

export default AdminLayout;
