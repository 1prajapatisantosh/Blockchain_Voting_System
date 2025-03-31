import React, { ReactNode, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

// Create a map to store scroll positions by pathname
const scrollPositions = new Map<string, number>();

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main ref={mainRef} className="flex-grow">
        {children}
      </main>
      <footer className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-12 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link className="flex items-center space-x-2" to="/">
                <span className="text-xl font-bold">BlockVote</span>
              </Link>
              <p className="mt-4 text-sm text-slate-400">
                A secure, transparent, and efficient blockchain-based voting system for elections of any scale.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-medium">Quick Links</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link className="hover:text-primary" to="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-primary" to="/#how-it-works">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-primary" to="/elections">
                    Elections
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-primary" to="/signup">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-medium">Resources</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link className="hover:text-primary" to="#">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-primary" to="#">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-primary" to="#">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-primary" to="#">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-medium">Contact</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="mailto:support@blockvote.com" className="hover:text-primary">
                    support@blockvote.com
                  </a>
                </li>
                <li>
                  <a href="tel:+1234567890" className="hover:text-primary">
                    +1 (234) 567-890
                  </a>
                </li>
                <li>
                  <p>123 Blockchain Way, Crypto City, BC 12345</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>© 2025 BlockVote. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <Toaster position="top-right" />
    </div>
  );
};

export default Layout;
