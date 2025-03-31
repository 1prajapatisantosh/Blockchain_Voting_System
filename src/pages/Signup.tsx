import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { signup, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Prevent using admin email for regular signup
      if (email === '1prajapatisantosh@gmail.com') {
        throw new Error('This email is reserved for admin use only');
      }

      // Check password strength
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      if (!validateForm()) return;

      await signup(email, password);
      toast.success('Account created successfully');
      navigate('/');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account');
      toast.error('Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setIsLoading(true);
      await googleSignIn();
      toast.success('Signed in with Google successfully');
      navigate('/');
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setError(err.message || 'Failed to sign in with Google');
      toast.error('Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a new account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {error && (
              <div className="bg-red-50 p-4 rounded-md mb-4">
                <div className="text-sm text-red-700">
                  {error}
                </div>
              </div>
            )}

            <FormInput
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <FormInput
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              label="Password"
              helperText="Password must be at least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <FormInput
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                fullWidth
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                  </g>
                </svg>
                Sign up with Google
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
