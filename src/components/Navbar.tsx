import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const { currentUser, userRole, logout } = useAuth();
  const { connected, account, connectWallet, disconnect } = useWeb3();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      disconnect();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const adminNav = [
    { name: 'Dashboard', href: '/admin/dashboard', current: location.pathname === '/admin/dashboard' },
    { name: 'Create Election', href: '/admin/create-election', current: location.pathname === '/admin/create-election' },
    { name: 'Manage Elections', href: '/admin/manage-elections', current: location.pathname === '/admin/manage-elections' },
  ];

  const userNav = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'How It Works', href: '/#how-it-works', current: location.pathname === '/#how-it-works' },
    { name: 'Elections', href: '/elections', current: location.pathname === '/elections' || location.pathname.startsWith('/elections/') },
  ];

  const navigation = userRole === 'admin' ? adminNav : userNav;

  return (
    <Disclosure as="nav" className="bg-white shadow-sm sticky top-0 z-50">
      {({ open, close }) => (
        <>
          <div className="container mx-auto px-4 md:px-6">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
                  aria-label="Toggle menu"
                >
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
                {/* Logo section */}
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/" className="text-xl font-bold flex items-center space-x-2">
                    <span>BlockVote</span>
                  </Link>
                </div>
                <div className="hidden md:flex md:space-x-8 md:ml-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        item.current
                          ? 'text-primary'
                          : 'text-sm font-medium transition-colors hover:text-primary text-muted-foreground',
                        'text-sm font-medium transition-colors hover:text-primary'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {currentUser ? (
                  <div className="flex items-center">
                    {!connected ? (
                      <button
                        onClick={connectWallet}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                      >
                        Connect Wallet
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary mr-4 text-sm flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                        {account?.slice(0, 6)}...{account?.slice(-4)}
                      </span>
                    )}

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex rounded-full bg-white p-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                          <span className="sr-only">Open user menu</span>
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                            {currentUser.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/profile"
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2.5 text-sm text-gray-700 transition-colors duration-150'
                                )}
                              >
                                Your Profile
                              </Link>
                            )}
                          </Menu.Item>
                          {userRole === 'admin' ? (
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/admin/dashboard"
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2.5 text-sm text-gray-700 transition-colors duration-150'
                                  )}
                                >
                                  Admin Dashboard
                                </Link>
                              )}
                            </Menu.Item>
                          ) : null}
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block w-full text-left px-4 py-2.5 text-sm text-gray-700 transition-colors duration-150'
                                )}
                              >
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                      <Link to="/login">Login</Link>
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                      <Link to="/signup">Register</Link>
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-slate-900 text-white shadow hover:bg-slate-800 h-9 px-4 py-2">
                      <Link to="/admin-login">Admin</Link>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-accent text-primary'
                      : 'text-gray-700 hover:bg-accent hover:text-primary',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                  onClick={() => close()}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              {!currentUser && (
                <Disclosure.Button
                  as={Link}
                  to="/admin-login"
                  className="text-gray-700 hover:bg-accent hover:text-primary block rounded-md px-3 py-2 text-base font-medium"
                  onClick={() => close()}
                >
                  Admin Login
                </Disclosure.Button>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
