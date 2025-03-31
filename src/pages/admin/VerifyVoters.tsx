import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import AdminLayout from '../../components/AdminLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

interface Voter {
  id: string;
  email: string;
  name?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
}

const VerifyVoters: React.FC = () => {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVoters();
  }, [statusFilter]);

  const fetchVoters = async () => {
    try {
      setLoading(true);

      let votersQuery = collection(db, 'users');

      // Users with role 'user' are considered voters
      const q = query(votersQuery, where('role', '==', 'user'));
      const querySnapshot = await getDocs(q);

      const votersList: Voter[] = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        votersList.push({
          id: doc.id,
          email: userData.email || '',
          name: userData.displayName || userData.name || '',
          status: userData.verificationStatus || 'pending',
          createdAt: userData.createdAt || new Date().toISOString()
        });
      });

      // Sort by creation date, newest first
      votersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setVoters(votersList);
    } catch (error) {
      console.error('Error fetching voters:', error);
      toast.error('Failed to load voters');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (voterId: string) => {
    try {
      const voterRef = doc(db, 'users', voterId);
      await updateDoc(voterRef, {
        verificationStatus: 'approved',
        updatedAt: new Date().toISOString()
      });

      // Update local state
      setVoters(voters.map(voter =>
        voter.id === voterId
          ? { ...voter, status: 'approved', updatedAt: new Date().toISOString() }
          : voter
      ));

      toast.success('Voter approved successfully');
    } catch (error) {
      console.error('Error approving voter:', error);
      toast.error('Failed to approve voter');
    }
  };

  const handleReject = async (voterId: string) => {
    try {
      const voterRef = doc(db, 'users', voterId);
      await updateDoc(voterRef, {
        verificationStatus: 'rejected',
        updatedAt: new Date().toISOString()
      });

      // Update local state
      setVoters(voters.map(voter =>
        voter.id === voterId
          ? { ...voter, status: 'rejected', updatedAt: new Date().toISOString() }
          : voter
      ));

      toast.success('Voter rejected');
    } catch (error) {
      console.error('Error rejecting voter:', error);
      toast.error('Failed to reject voter');
    }
  };

  const handleReset = async (voterId: string) => {
    try {
      const voterRef = doc(db, 'users', voterId);
      await updateDoc(voterRef, {
        verificationStatus: 'pending',
        updatedAt: new Date().toISOString()
      });

      // Update local state
      setVoters(voters.map(voter =>
        voter.id === voterId
          ? { ...voter, status: 'pending', updatedAt: new Date().toISOString() }
          : voter
      ));

      toast.success('Voter reset to pending');
    } catch (error) {
      console.error('Error resetting voter status:', error);
      toast.error('Failed to reset voter status');
    }
  };

  const filteredVoters = voters.filter(voter => {
    // Filter by status
    if (statusFilter !== 'all' && voter.status !== statusFilter) {
      return false;
    }

    // Filter by search term
    if (searchTerm && !voter.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !voter.name?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-16">
          <LoadingSpinner fullScreen text="Loading voters..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Verify Voters</h1>
          <p className="text-gray-600 mt-2">Approve or reject voter registrations for KYC verification.</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative rounded-md shadow-sm flex-1">
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Search by email or name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'all'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'pending'
                  ? 'bg-yellow-100 text-yellow-900'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Pending
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('approved')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'approved'
                  ? 'bg-green-100 text-green-900'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Approved
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('rejected')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'rejected'
                  ? 'bg-red-100 text-red-900'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        <Card>
          <div className="overflow-x-auto">
            {filteredVoters.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">No {statusFilter !== 'all' ? statusFilter : ''} voters found</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registered On
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVoters.map((voter) => (
                    <tr key={voter.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {voter.name || 'No Name'}
                            </div>
                            <div className="text-sm text-gray-500">{voter.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(voter.createdAt)}</div>
                        {voter.updatedAt && (
                          <div className="text-xs text-gray-500">
                            Updated: {formatDate(voter.updatedAt)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            voter.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : voter.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {voter.status.charAt(0).toUpperCase() + voter.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {voter.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="mr-2"
                              onClick={() => handleApprove(voter.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => handleReject(voter.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {voter.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handleReject(voter.id)}
                          >
                            Reject
                          </Button>
                        )}
                        {voter.status === 'rejected' && (
                          <Button
                            size="sm"
                            onClick={() => handleApprove(voter.id)}
                          >
                            Approve
                          </Button>
                        )}
                        {voter.status !== 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="ml-2"
                            onClick={() => handleReset(voter.id)}
                          >
                            Reset
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default VerifyVoters;
