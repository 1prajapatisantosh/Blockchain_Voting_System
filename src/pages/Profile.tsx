import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import FormInput from '../components/FormInput';
import toast from 'react-hot-toast';

interface UserProfile {
  email: string;
  role: string;
  createdAt: string;
  name?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
}

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const { connected, connectWallet, account } = useWeb3();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          setUserProfile(userData);

          // Initialize form fields
          setName(userData.name || '');
          setDateOfBirth(userData.dateOfBirth || '');
          setPhoneNumber(userData.phoneNumber || '');
        } else {
          setError('User profile not found');
        }
      } catch (err: any) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
        toast.error('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast.success('Wallet connected successfully');
    } catch (err) {
      toast.error('Failed to connect wallet');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    try {
      setSaving(true);

      const userRef = doc(db, 'users', currentUser.uid);

      await updateDoc(userRef, {
        name,
        dateOfBirth,
        phoneNumber,
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setUserProfile((prev) => {
        if (!prev) return null;
        return { ...prev, name, dateOfBirth, phoneNumber };
      });

      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-16">
          <LoadingSpinner fullScreen text="Loading user profile..." />
        </div>
      </Layout>
    );
  }

  if (!currentUser) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User Not Authenticated</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and wallet connection.</p>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : null}
            </div>

            {!isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md text-gray-900">
                    {currentUser.email}
                  </div>
                </div>

                {userProfile && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded-md text-gray-900">
                        {userProfile.name || 'Not provided'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded-md text-gray-900">
                        {userProfile.dateOfBirth || 'Not provided'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded-md text-gray-900">
                        {userProfile.phoneNumber || 'Not provided'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded-md text-gray-900 capitalize">
                        {userProfile.role}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Account Created</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded-md text-gray-900">
                        {new Date(userProfile.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <FormInput
                  id="email"
                  label="Email"
                  value={currentUser.email || ''}
                  disabled
                  type="email"
                />

                <FormInput
                  id="name"
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />

                <FormInput
                  id="dateOfBirth"
                  label="Date of Birth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  type="date"
                />

                <FormInput
                  id="phoneNumber"
                  label="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                />

                <div className="flex gap-3 justify-end pt-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            )}
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Wallet Connection</h2>
            {connected ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Wallet Address</label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md text-gray-900 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    <span className="font-mono text-sm break-all">
                      {account}
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <span className="text-sm text-green-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Wallet connected
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 mb-4">
                  Connect your Ethereum wallet to participate in blockchain voting.
                </p>
                <Button onClick={handleConnectWallet}>
                  Connect Wallet
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
