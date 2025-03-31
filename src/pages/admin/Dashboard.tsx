import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../../contexts/Web3Context';
import AdminLayout from '../../components/AdminLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

interface ElectionSummary {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  totalVotes: number;
  candidateCount: number;
}

interface DashboardStats {
  totalElections: number;
  activeElections: number;
  upcomingElections: number;
  endedElections: number;
  totalVotes: number;
}

const AdminDashboard: React.FC = () => {
  const { connected, connectWallet, getElections } = useWeb3();
  const [elections, setElections] = useState<ElectionSummary[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalElections: 0,
    activeElections: 0,
    upcomingElections: 0,
    endedElections: 0,
    totalVotes: 0,
  });
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

        const electionSummaries = data.map((election: any) => ({
          id: election.id,
          name: election.name,
          startTime: election.startTime,
          endTime: election.endTime,
          totalVotes: election.totalVotes,
          candidateCount: election.candidates.length,
        }));

        setElections(electionSummaries);

        // Calculate dashboard statistics
        const now = Math.floor(Date.now() / 1000);
        const dashboardStats = {
          totalElections: electionSummaries.length,
          activeElections: electionSummaries.filter(e => now >= e.startTime && now <= e.endTime).length,
          upcomingElections: electionSummaries.filter(e => now < e.startTime).length,
          endedElections: electionSummaries.filter(e => now > e.endTime).length,
          totalVotes: electionSummaries.reduce((sum, e) => sum + e.totalVotes, 0),
        };

        setStats(dashboardStats);
        setError('');
      } catch (err: any) {
        console.error('Error fetching elections:', err);
        setError('Failed to load elections data');
        toast.error('Failed to load elections data');
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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
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

  if (!connected) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">You need to connect your Ethereum wallet to access the admin dashboard.</p>
          <Button onClick={handleConnectWallet}>Connect Wallet</Button>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-16">
          <LoadingSpinner fullScreen text="Loading dashboard data..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <Link to="/admin/create-election">
            <Button>Create New Election</Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 mb-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <div className="flex flex-col items-start">
              <h3 className="text-lg font-medium text-gray-900">Total Elections</h3>
              <p className="mt-1 text-3xl font-semibold text-indigo-600">{stats.totalElections}</p>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col items-start">
              <h3 className="text-lg font-medium text-gray-900">Active Elections</h3>
              <p className="mt-1 text-3xl font-semibold text-green-600">{stats.activeElections}</p>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col items-start">
              <h3 className="text-lg font-medium text-gray-900">Upcoming Elections</h3>
              <p className="mt-1 text-3xl font-semibold text-blue-600">{stats.upcomingElections}</p>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col items-start">
              <h3 className="text-lg font-medium text-gray-900">Total Votes</h3>
              <p className="mt-1 text-3xl font-semibold text-gray-700">{stats.totalVotes}</p>
            </div>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Elections</h3>
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
                        <div className="text-sm text-gray-500">{election.candidateCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{election.totalVotes}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/elections/${election.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                          View
                        </Link>
                        <Link to={`/admin/manage-elections/${election.id}`} className="text-indigo-600 hover:text-indigo-900">
                          Manage
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

export default AdminDashboard;
