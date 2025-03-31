import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../../contexts/Web3Context';
import AdminLayout from '../../components/AdminLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

interface Election {
  id: string;
  name: string;
  description: string;
  startTime: number;
  endTime: number;
  candidates: string[];
  totalVotes: number;
}

const ManageElections: React.FC = () => {
  const { connected, connectWallet, getElections } = useWeb3();
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchElections = async () => {
      if (!connected) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getElections();
        setElections(data);
        setError('');
      } catch (err: any) {
        console.error('Error fetching elections:', err);
        setError('Failed to load elections. Please try again.');
        toast.error('Failed to load elections');
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, [connected, getElections]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (err) {
      toast.error('Failed to connect wallet');
    }
  };

  const getElectionStatus = (startTime: number, endTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    if (now < startTime) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
          Upcoming
        </span>
      );
    } else if (now >= startTime && now <= endTime) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
          Active
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
          Ended
        </span>
      );
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (!connected) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">You need to connect your Ethereum wallet to manage elections.</p>
          <Button onClick={handleConnectWallet}>Connect Wallet</Button>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-16">
          <LoadingSpinner fullScreen text="Loading elections..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Manage Elections</h1>
          <Link to="/admin/create-election">
            <Button>Create New Election</Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">All Elections</h3>
          </div>
          <div className="overflow-x-auto">
            {elections.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No elections created yet</p>
                <Link to="/admin/create-election" className="mt-2 inline-block text-indigo-600 hover:text-indigo-500">
                  Create your first election
                </Link>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Election
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidates
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Votes
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {elections.map((election) => (
                    <tr key={election.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{election.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{election.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(election.startTime)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(election.endTime)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getElectionStatus(election.startTime, election.endTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{election.candidates.length}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{election.totalVotes}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/elections/${election.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                          View
                        </Link>
                        <Link to={`/admin/edit-election/${election.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                          Edit
                        </Link>
                        <Link to={`/admin/election-results/${election.id}`} className="text-indigo-600 hover:text-indigo-900">
                          Results
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageElections;
