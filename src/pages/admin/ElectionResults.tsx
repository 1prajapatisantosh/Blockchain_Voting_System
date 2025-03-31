import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../../contexts/Web3Context';
import AdminLayout from '../../components/AdminLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

interface Candidate {
  id: number;
  name: string;
  votes: number;
}

interface Election {
  id: string;
  name: string;
  description: string;
  startTime: number;
  endTime: number;
  candidates: string[];
  totalVotes: number;
  candidateResults?: Candidate[];
}

const ElectionResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { connected, connectWallet, getElectionById } = useWeb3();

  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to handle back navigation
  const handleGoBack = () => {
    // Check if we can go back in history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to manage elections page if can't go back
      navigate('/admin/manage-elections');
    }
  };

  useEffect(() => {
    const fetchElection = async () => {
      if (!connected || !id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getElectionById(id);

        if (!data) {
          throw new Error('Election not found');
        }

        setElection(data);
        setError('');
      } catch (err: any) {
        console.error('Error fetching election results:', err);
        setError(err.message || 'Failed to load election results');
        toast.error('Failed to load election results');
      } finally {
        setLoading(false);
      }
    };

    fetchElection();
  }, [connected, getElectionById, id]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (err) {
      toast.error('Failed to connect wallet');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getElectionStatus = () => {
    if (!election) return '';

    const now = Date.now();

    if (now < election.startTime) {
      return 'Upcoming';
    } else if (now >= election.startTime && now <= election.endTime) {
      return 'Active';
    } else {
      return 'Ended';
    }
  };

  // Calculate percentage for the progress bars
  const calculatePercentage = (votes: number) => {
    if (!election || election.totalVotes === 0) return 0;
    return Math.round((votes / election.totalVotes) * 100);
  };

  // Get winner(s) - there could be ties
  const getWinners = () => {
    if (!election || !election.candidateResults) return [];

    const maxVotes = Math.max(...election.candidateResults.map(c => c.votes));
    return election.candidateResults.filter(c => c.votes === maxVotes);
  };

  if (!connected) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">You need to connect your Ethereum wallet to view election results.</p>
          <Button onClick={handleConnectWallet}>Connect Wallet</Button>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-16">
          <LoadingSpinner fullScreen text="Loading election results..." />
        </div>
      </AdminLayout>
    );
  }

  if (!election) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Election Not Found</h2>
          <p className="text-gray-600 mb-6">The election you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={handleGoBack}>Back to Elections</Button>
        </div>
      </AdminLayout>
    );
  }

  const winners = getWinners();
  const isActive = getElectionStatus() === 'Active';
  const hasEnded = getElectionStatus() === 'Ended';

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{election.name}</h1>
            <p className="text-gray-600 mt-1">{election.description}</p>
          </div>
          <Button variant="outline" onClick={handleGoBack}>
            Back to Elections
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Status</h3>
            <div className={`text-lg font-bold ${
              isActive ? 'text-green-600' : hasEnded ? 'text-gray-600' : 'text-blue-600'
            }`}>
              {getElectionStatus()}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Duration</h3>
            <div className="text-sm text-gray-600">
              <div>Start: {formatDate(election.startTime)}</div>
              <div>End: {formatDate(election.endTime)}</div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Participation</h3>
            <div className="text-2xl font-bold text-indigo-600">{election.totalVotes}</div>
            <div className="text-sm text-gray-600">Total votes cast</div>
          </Card>
        </div>

        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">Election Results</h2>
            {isActive && (
              <p className="text-sm text-yellow-600 mt-1">
                This election is still active. Results may change as more votes are cast.
              </p>
            )}
            {hasEnded && winners.length > 0 && (
              <div className="mt-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {winners.length === 1 ? 'Winner' : 'Winners (Tie)'}:
                </h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {winners.map(winner => (
                    <span
                      key={winner.id}
                      className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {winner.name} ({winner.votes} votes)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {election.candidateResults && election.candidateResults.map((candidate) => {
              const percentage = calculatePercentage(candidate.votes);
              const isWinner = hasEnded && winners.some(w => w.id === candidate.id);

              return (
                <div key={candidate.id} className="group">
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700">
                        {candidate.name}
                        {isWinner && (
                          <span className="ml-2 text-green-600">
                            (Winner)
                          </span>
                        )}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {candidate.votes} votes ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isWinner ? 'bg-green-500' : 'bg-indigo-500'}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}

            {(!election.candidateResults || election.candidateResults.length === 0) && (
              <p className="text-gray-500 italic">No votes have been cast yet.</p>
            )}
          </div>
        </Card>

        <div className="mt-6">
          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-3">Export Options</h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm">
                Export as CSV
              </Button>
              <Button variant="outline" size="sm">
                Print Results
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ElectionResults;
