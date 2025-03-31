import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

interface Candidate {
  id: number;
  name: string;
  votes: number;
}

interface ElectionDetail {
  id: string;
  name: string;
  description: string;
  startTime: number;
  endTime: number;
  candidates: string[];
  totalVotes: number;
  candidateResults: Candidate[];
}

// Real elections data for demonstration
const realElections: ElectionDetail[] = [
  {
    id: '1',
    name: 'Student Council President',
    description: 'Vote for the next Student Council President for the 2025-2026 school year.',
    startTime: Math.floor(Date.now() / 1000) - 86400, // Started 1 day ago
    endTime: Math.floor(Date.now() / 1000) + 86400 * 7, // Ends in 7 days
    candidates: ['John Smith', 'Maria Rodriguez', 'Aisha Johnson', 'Wei Chen'],
    totalVotes: 258,
    candidateResults: [
      { id: 0, name: 'John Smith', votes: 67 },
      { id: 1, name: 'Maria Rodriguez', votes: 82 },
      { id: 2, name: 'Aisha Johnson', votes: 56 },
      { id: 3, name: 'Wei Chen', votes: 53 }
    ]
  },
  {
    id: '2',
    name: 'Community Garden Project',
    description: 'Select the preferred layout for the new community garden in our neighborhood.',
    startTime: Math.floor(Date.now() / 1000) - 86400 * 2, // Started 2 days ago
    endTime: Math.floor(Date.now() / 1000) + 86400 * 5, // Ends in 5 days
    candidates: ['Plan A: Urban Farm', 'Plan B: Relaxation Garden', 'Plan C: Mixed Usage'],
    totalVotes: 145,
    candidateResults: [
      { id: 0, name: 'Plan A: Urban Farm', votes: 42 },
      { id: 1, name: 'Plan B: Relaxation Garden', votes: 58 },
      { id: 2, name: 'Plan C: Mixed Usage', votes: 45 }
    ]
  }
];

// Add a type guard to convert ElectionResult to ElectionDetail
function convertToElectionDetail(result: any): ElectionDetail | null {
  if (!result) return null;

  return {
    id: result.id,
    name: result.name,
    description: result.description,
    startTime: result.startTime,
    endTime: result.endTime,
    candidates: result.candidates,
    totalVotes: result.totalVotes,
    candidateResults: result.candidateResults || []
  };
}

const ElectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { connected, connectWallet, getElectionById, castVote, hasVoted } = useWeb3();

  const [election, setElection] = useState<ElectionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [error, setError] = useState('');
  const [usingDemoData, setUsingDemoData] = useState(false);

  // Function to handle back navigation
  const handleGoBack = () => {
    // Check if we can go back in history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to elections page if can't go back
      navigate('/elections');
    }
  };

  useEffect(() => {
    const fetchElection = async () => {
      if (!id || !connected) {
        if (!connected) setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // First try to get from blockchain
        const data = await getElectionById(id);
        if (data) {
          setElection(convertToElectionDetail(data));
          setUsingDemoData(false);

          // Check if user has voted
          const hasUserVoted = await hasVoted(id);
          setUserHasVoted(hasUserVoted);
        } else {
          // If not found or error, get from our demo data
          const demoElection = realElections.find(e => e.id === id);
          if (demoElection) {
            setElection(demoElection);
            setUsingDemoData(true);

            // For demo, randomly decide if user has voted
            const randomHasVoted = Math.random() > 0.5;
            setUserHasVoted(randomHasVoted);

            toast.success('Using demonstration data for this election');
          } else {
            setError('Election not found');
          }
        }
      } catch (err: any) {
        console.error('Error fetching election:', err);

        // Try to get from our demo data instead
        const demoElection = realElections.find(e => e.id === id);
        if (demoElection) {
          setElection(demoElection);
          setUsingDemoData(true);

          // For demo, randomly decide if user has voted
          const randomHasVoted = Math.random() > 0.5;
          setUserHasVoted(randomHasVoted);

          toast.success('Using demonstration data for this election');
        } else {
          setError('Failed to load election details');
          toast.error('Election not found');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchElection();
  }, [id, connected, getElectionById, hasVoted]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (err) {
      toast.error('Failed to connect wallet');
    }
  };

  const handleVote = async () => {
    if (selectedCandidate === null) {
      toast.error('Please select a candidate');
      return;
    }

    try {
      setVoting(true);

      if (usingDemoData) {
        // If using demo data, simulate vote by updating our local state
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate blockchain delay

        if (election) {
          // Update the candidateResults
          const updatedElection = { ...election };
          updatedElection.candidateResults[selectedCandidate].votes += 1;
          updatedElection.totalVotes += 1;
          setElection(updatedElection);

          // Update the corresponding election in our demo data
          const electionIndex = realElections.findIndex(e => e.id === election.id);
          if (electionIndex !== -1) {
            realElections[electionIndex] = updatedElection;
          }

          toast.success('Your vote has been recorded!');
        }
      } else {
        // Use real blockchain voting
        await castVote(id!, selectedCandidate);

        // Refresh election data
        const updatedElection = await getElectionById(id!);
        setElection(convertToElectionDetail(updatedElection));

        toast.success('Your vote has been recorded on the blockchain');
      }

      setUserHasVoted(true);
    } catch (err: any) {
      console.error('Error casting vote:', err);
      toast.error('Failed to cast vote');
    } finally {
      setVoting(false);
    }
  };

  const isActive = () => {
    if (!election) return false;
    const now = Math.floor(Date.now() / 1000);
    return now >= election.startTime && now <= election.endTime;
  };

  const isUpcoming = () => {
    if (!election) return false;
    const now = Math.floor(Date.now() / 1000);
    return now < election.startTime;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getStatusBadge = () => {
    if (isActive()) {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>;
    } else if (isUpcoming()) {
      return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Upcoming</span>;
    } else {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Ended</span>;
    }
  };

  if (!connected) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">You need to connect your Ethereum wallet to view election details and vote.</p>
          <Button onClick={handleConnectWallet}>Connect Wallet</Button>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="py-16">
          <LoadingSpinner fullScreen text="Loading election details..." />
        </div>
      </Layout>
    );
  }

  if (!election) {
    return (
      <Layout>
        <div className="py-6">
          <div className="bg-red-50 p-4 rounded-md mb-6">
            <p className="text-sm text-red-700">{error || 'Election not found'}</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/elections')}>
            Back to Elections
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-6">
        <Button variant="outline" onClick={handleGoBack} className="mb-6">
          Back to Elections
        </Button>

        {usingDemoData && (
          <div className="bg-yellow-50 p-4 rounded-md mb-6">
            <p className="text-sm text-yellow-700">
              Using demonstration data for this election. Your votes will be recorded but not stored on the blockchain.
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{election.name}</h1>
              <div className="mb-4">
                {getStatusBadge()}
                <span className="ml-2 text-sm text-gray-500">{election.totalVotes} total votes</span>
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-6">{election.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Election Details</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="mb-2">
                  <span className="font-medium">Start Time:</span> {formatDate(election.startTime)}
                </div>
                <div>
                  <span className="font-medium">End Time:</span> {formatDate(election.endTime)}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Voting Status</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                {userHasVoted ? (
                  <p className="text-green-600 font-medium">You have already voted in this election.</p>
                ) : isActive() ? (
                  <p className="text-blue-600 font-medium">This election is active. Cast your vote now!</p>
                ) : isUpcoming() ? (
                  <p className="text-gray-600">This election has not started yet.</p>
                ) : (
                  <p className="text-gray-600">This election has ended.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Candidates</h3>

            {isActive() && !userHasVoted ? (
              <div className="space-y-4">
                {election.candidates.map((candidate, index) => (
                  <div
                    key={index}
                    className={`
                      border rounded-md p-4
                      ${selectedCandidate === index
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-200'
                      }
                      cursor-pointer transition-colors
                    `}
                    onClick={() => setSelectedCandidate(index)}
                  >
                    <div className="flex items-center">
                      <div className={`
                        w-5 h-5 rounded-full border mr-3
                        ${selectedCandidate === index
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-gray-400'
                        }
                        flex items-center justify-center
                      `}>
                        {selectedCandidate === index && (
                          <span className="block w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="font-medium">{candidate}</span>
                    </div>
                  </div>
                ))}

                <div className="mt-6">
                  <Button
                    onClick={handleVote}
                    disabled={selectedCandidate === null}
                    isLoading={voting}
                    fullWidth
                  >
                    Cast Your Vote
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Current Results</h3>

                {election.candidateResults.map((candidate) => {
                  const percentage = election.totalVotes > 0
                    ? Math.round((candidate.votes / election.totalVotes) * 100)
                    : 0;

                  return (
                    <div key={candidate.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{candidate.name}</span>
                        <span className="text-gray-600">{candidate.votes} votes ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ElectionDetail;
