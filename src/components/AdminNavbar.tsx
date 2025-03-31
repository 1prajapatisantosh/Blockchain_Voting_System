import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import Button from './Button';

const AdminNavbar: React.FC = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { connected, connectWallet, disconnect, account } = useWeb3();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      disconnect();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600';
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-600">Admin Dashboard</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/admin/dashboard"
                className={`${isActive('/admin/dashboard')} inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/admin/dashboard' ? 'border-indigo-500' : 'border-transparent'
                } text-sm font-medium`}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/create-election"
                className={`${isActive('/admin/create-election')} inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/admin/create-election' ? 'border-indigo-500' : 'border-transparent'
                } text-sm font-medium`}
              >
                Create Election
              </Link>
              <Link
                to="/admin/manage-elections"
                className={`${isActive('/admin/manage-elections')} inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/admin/manage-elections' ? 'border-indigo-500' : 'border-transparent'
                } text-sm font-medium`}
              >
                Manage Elections
              </Link>
              <Link
                to="/admin/verify-voters"
                className={`${isActive('/admin/verify-voters')} inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/admin/verify-voters' ? 'border-indigo-500' : 'border-transparent'
                } text-sm font-medium`}
              >
                Verify Voters
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {connected ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Connected: <span className="font-medium text-gray-900">{account && truncateAddress(account)}</span>
                </div>
                <Button size="sm" variant="outline" onClick={disconnect}>
                  Disconnect
                </Button>
                {currentUser && (
                  <Button size="sm" variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                )}
              </div>
            ) : (
              <Button size="sm" onClick={connectWallet}>
                Connect Wallet
              </Button>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/admin/dashboard"
            className={`${
              location.pathname === '/admin/dashboard'
                ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/create-election"
            className={`${
              location.pathname === '/admin/create-election'
                ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
          >
            Create Election
          </Link>
          <Link
            to="/admin/manage-elections"
            className={`${
              location.pathname === '/admin/manage-elections'
                ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
          >
            Manage Elections
          </Link>
          <Link
            to="/admin/verify-voters"
            className={`${
              location.pathname === '/admin/verify-voters'
                ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
          >
            Verify Voters
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4">
            {connected ? (
              <div className="flex flex-col space-y-3 w-full">
                <div className="text-sm text-gray-500">
                  Connected: <span className="font-medium text-gray-900">{account && truncateAddress(account)}</span>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={disconnect} fullWidth>
                    Disconnect
                  </Button>
                  {currentUser && (
                    <Button size="sm" variant="outline" onClick={handleLogout} fullWidth>
                      Logout
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <Button size="sm" onClick={connectWallet} fullWidth>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
