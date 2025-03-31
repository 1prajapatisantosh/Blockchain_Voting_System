import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Candidate {
  id: number;
  name: string;
  votes: number;
}

interface ElectionResult {
  id: string;
  name: string;
  description: string;
  startTime: number;
  endTime: number;
  totalVotes: number;
  candidates: string[];
  candidateResults?: Candidate[];
}

// This is our local interface that ensures candidateResults is present
interface ElectionWithResults {
  id: string;
  name: string;
  description: string;
  startTime: number;
  endTime: number;
  totalVotes: number;
  candidateResults: Candidate[];
}

const ElectionResultCard: React.FC<{ election: ElectionWithResults }> = ({ election }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Find the winner (candidate with most votes)
  const getWinner = () => {
    if (election.candidateResults.length === 0) return null;

    return election.candidateResults.reduce((prev, current) =>
      (prev.votes > current.votes) ? prev : current
    );
  };

  const winner = getWinner();
  const isActive = Date.now() < election.endTime;

  // Calculate percentage for progress bars
  const getVotePercentage = (votes: number) => {
    if (election.totalVotes === 0) return 0;
    return (votes / election.totalVotes) * 100;
  };

  return (
    <Card className="h-full">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">{election.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{election.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
        <div>
          <span className="font-medium">Started:</span> {formatDate(election.startTime)}
        </div>
        <div>
          <span className="font-medium">Ended:</span> {isActive ? 'Still Active' : formatDate(election.endTime)}
        </div>
      </div>

      <div className="mb-2">
        <h4 className="text-sm font-medium text-gray-900">Results:</h4>
        {isActive ? (
          <p className="text-sm text-yellow-600 mt-1">
            This election is still active. Final results will be available when it ends.
          </p>
        ) : election.totalVotes === 0 ? (
          <p className="text-sm text-gray-600 mt-1">
            No votes have been cast in this election.
          </p>
        ) : (
          winner && (
            <div className="bg-green-50 p-2 rounded-md my-2">
              <p className="text-sm text-green-700">
                Winner: <span className="font-semibold">{winner.name}</span> with {winner.votes} votes
                ({Math.round(getVotePercentage(winner.votes))}%)
              </p>
            </div>
          )
        )}
      </div>

      <div className="space-y-3 mt-4">
        {election.candidateResults.map((candidate) => (
          <div key={candidate.id}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">{candidate.name}</span>
              <span className="text-sm text-gray-500">
                {candidate.votes} votes ({Math.round(getVotePercentage(candidate.votes))}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${winner && candidate.id === winner.id ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${getVotePercentage(candidate.votes)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <Link to={`/elections/${election.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};

const Results: React.FC = () => {
  const { connected, connectWallet, getElections, getElectionById } = useWeb3();
  const [elections, setElections] = useState<ElectionWithResults[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchElectionResults = async () => {
      if (!connected) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Get all elections first
        const allElections = await getElections();

        // Then fetch detailed results for each election
        const results = await Promise.all(
          allElections.map(async (election: any) => {
            try {
              return await getElectionById(election.id);
            } catch (err) {
              console.error(`Error fetching details for election ${election.id}:`, err);
              return null;
            }
          })
        );

        // Filter out any null results and convert to our local interface
        const validResults: ElectionWithResults[] = results
          .filter((result): result is ElectionResult => result !== null)
          .filter(result => result.candidateResults !== undefined)
          .map(result => ({
            id: result.id,
            name: result.name,
            description: result.description,
            startTime: result.startTime,
            endTime: result.endTime,
            totalVotes: result.totalVotes,
            candidateResults: result.candidateResults!
          }))
          .sort((a, b) => b.endTime - a.endTime);

        setElections(validResults);
        setError('');
      } catch (err: any) {
        console.error('Error fetching election results:', err);
        setError('Failed to load election results. Please try again.');
        toast.error('Failed to load election results');
      } finally {
        setLoading(false);
      }
    };

    fetchElectionResults();
  }, [connected, getElections, getElectionById]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (err) {
      toast.error('Failed to connect wallet');
    }
  };

  if (!connected) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">You need to connect your Ethereum wallet to view election results.</p>
          <Button onClick={handleConnectWallet}>Connect Wallet</Button>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="py-16">
          <LoadingSpinner fullScreen text="Loading election results..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Election Results</h1>
          <p className="text-gray-600 mt-2">View the results of all elections</p>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {elections.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Election Results Available</h3>
            <p className="text-gray-600">There are no elections with results at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {elections.map((election) => (
              <ElectionResultCard key={election.id} election={election} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Results;
