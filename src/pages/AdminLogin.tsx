import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import Layout from '../components/Layout';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Card from '../components/Card';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

// Admin default credential (should be moved to environment variables in production)
const ADMIN_EMAIL = '1prajapatisantosh@gmail.com';
const ADMIN_PASSWORD = 'P@$$w0rd';

// Admin verification code (simulated 2FA)
const ADMIN_VERIFICATION_CODE = '123456';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userRole } = useAuth();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if already logged in as admin
  useEffect(() => {
    if (currentUser && userRole === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [currentUser, userRole, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check for admin credentials
      if (email !== ADMIN_EMAIL) {
        throw new Error('Invalid admin credentials');
      }

      if (password !== ADMIN_PASSWORD) {
        throw new Error('Invalid password');
        setLoading(false);
        return;
      }

      // Show verification step
      setShowVerification(true);
      setLoading(false);
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError(err.message || 'Failed to log in as admin');
      toast.error('Admin login failed');
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Verify code
      if (verificationCode !== ADMIN_VERIFICATION_CODE) {
        throw new Error('Invalid verification code');
      }

      // Try to sign in first
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (signInError) {
        // If the user doesn't exist, create the admin account
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }

      if (!userCredential || !userCredential.user) {
        throw new Error('Authentication failed');
      }

      // Check if user has admin role in firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

      if (!userDoc.exists()) {
        // Create admin user if it doesn't exist
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: email,
          role: 'admin',
          createdAt: new Date().toISOString()
        });
      } else {
        const userData = userDoc.data();
        if (userData.role !== 'admin') {
          // Update user role to admin
          await updateDoc(doc(db, 'users', userCredential.user.uid), {
            role: 'admin'
          });
        }
      }

      toast.success('Admin login successful');
      // Use replace to ensure proper back navigation
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Admin verification error:', err);
      setError(err.message || 'Verification failed');
      toast.error('Admin verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access the admin dashboard
            </p>
          </div>

          <Card>
            {!showVerification ? (
              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <div className="bg-red-50 p-4 rounded-md">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <FormInput
                  id="email"
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled
                />

                <FormInput
                  id="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div>
                  <Button
                    type="submit"
                    fullWidth
                    isLoading={loading}
                  >
                    Continue
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerification} className="space-y-6">
                {error && (
                  <div className="bg-red-50 p-4 rounded-md">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1 md:flex md:justify-between">
                      <p className="text-sm text-blue-700">
                        A verification code has been sent to your email. For demo purposes, use code: {ADMIN_VERIFICATION_CODE}
                      </p>
                    </div>
                  </div>
                </div>

                <FormInput
                  id="verification-code"
                  label="Verification Code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  autoFocus
                />

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    onClick={() => setShowVerification(false)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    fullWidth
                    isLoading={loading}
                  >
                    Verify & Sign in
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
