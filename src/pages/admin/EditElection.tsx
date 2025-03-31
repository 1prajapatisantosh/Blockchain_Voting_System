import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../../contexts/Web3Context';
import AdminLayout from '../../components/AdminLayout';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import Card from '../../components/Card';
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

const EditElection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { connected, connectWallet, getElectionById, updateElection, startElection, endElection } = useWeb3();

  const [election, setElection] = useState<Election | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        setName(data.name);
        setDescription(data.description);

        // Convert timestamp to local datetime string format for input fields
        const startDate = new Date(data.startTime); // data.startTime is already in milliseconds
        const endDate = new Date(data.endTime); // data.endTime is already in milliseconds

        setStartTime(startDate.toISOString().slice(0, 16));
        setEndTime(endDate.toISOString().slice(0, 16));

        setError('');
      } catch (err: any) {
        console.error('Error fetching election:', err);
        setError(err.message || 'Failed to load election details');
        toast.error('Failed to load election details');
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

  const validateForm = () => {
    if (!name || !description || !startTime || !endTime) {
      setError('All fields are required');
      return false;
    }

    // Validate dates
    const startDate = new Date(startTime).getTime() / 1000;
    const endDate = new Date(endTime).getTime() / 1000;

    if (endDate <= startDate) {
      setError('End time must be after start time');
      return false;
    }

    return true;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !validateForm()) return;

    try {
      setIsSubmitting(true);
      setError('');

      const startTimeUnix = Math.floor(new Date(startTime).getTime() / 1000);
      const endTimeUnix = Math.floor(new Date(endTime).getTime() / 1000);

      await updateElection(
        id,
        name,
        description,
        startTimeUnix,
        endTimeUnix
      );

      toast.success('Election updated successfully');
      navigate('/admin/manage-elections');
    } catch (err: any) {
      console.error('Error updating election:', err);
      setError(err.message || 'Failed to update election');
      toast.error('Failed to update election');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartElection = async () => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      await startElection(id);
      toast.success('Election started successfully');
      navigate('/admin/manage-elections');
    } catch (err: any) {
      console.error('Error starting election:', err);
      toast.error('Failed to start election');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndElection = async () => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      await endElection(id);
      toast.success('Election ended successfully');
      navigate('/admin/manage-elections');
    } catch (err: any) {
      console.error('Error ending election:', err);
      toast.error('Failed to end election');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!connected) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">You need to connect your Ethereum wallet to edit an election.</p>
          <Button onClick={handleConnectWallet}>Connect Wallet</Button>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-16">
          <LoadingSpinner fullScreen text="Loading election details..." />
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
          <Button onClick={() => navigate('/admin/manage-elections')}>Back to Elections</Button>
        </div>
      </AdminLayout>
    );
  }

  const getElectionStatus = () => {
    const now = Math.floor(Date.now() / 1000);
    const electionStartTime = Math.floor(election.startTime / 1000);
    const electionEndTime = Math.floor(election.endTime / 1000);

    if (now < electionStartTime) {
      return 'Upcoming';
    } else if (now >= electionStartTime && now <= electionEndTime) {
      return 'Active';
    } else {
      return 'Ended';
    }
  };

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Election</h1>
          <Button variant="outline" onClick={handleGoBack}>
            Back to Elections
          </Button>
        </div>

        <div className="mb-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Election Status</h2>
                <p className="text-gray-600">Current status: {getElectionStatus()}</p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleStartElection}
                  isLoading={isSubmitting}
                  disabled={getElectionStatus() === 'Active' || getElectionStatus() === 'Ended'}
                  variant={getElectionStatus() === 'Upcoming' ? 'primary' : 'outline'}
                >
                  Start Election
                </Button>
                <Button
                  onClick={handleEndElection}
                  isLoading={isSubmitting}
                  disabled={getElectionStatus() === 'Upcoming' || getElectionStatus() === 'Ended'}
                  variant={getElectionStatus() === 'Active' ? 'primary' : 'outline'}
                >
                  End Election
                </Button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Votes</p>
                  <p className="mt-1 text-lg font-semibold">{election.totalVotes}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Candidates</p>
                  <p className="mt-1 text-lg font-semibold">{election.candidates.length}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <form onSubmit={handleUpdate}>
            {error && (
              <div className="bg-red-50 p-4 rounded-md mb-6">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <FormInput
                id="election-name"
                label="Election Name"
                type="text"
                placeholder="Enter election name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Describe the purpose of this election"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormInput
                  id="start-time"
                  label="Start Time"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  helperText="When voting will begin"
                />

                <FormInput
                  id="end-time"
                  label="End Time"
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  helperText="When voting will end"
                />
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handleGoBack}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Update Election
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default EditElection;
