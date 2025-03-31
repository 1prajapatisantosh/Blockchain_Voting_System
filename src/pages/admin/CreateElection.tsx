import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../../contexts/Web3Context';
import AdminLayout from '../../components/AdminLayout';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import Card from '../../components/Card';
import toast from 'react-hot-toast';

const CreateElection: React.FC = () => {
  const navigate = useNavigate();
  const { connected, connectWallet, createElection } = useWeb3();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [candidates, setCandidates] = useState<string[]>(['', '']);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
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

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (err) {
      toast.error('Failed to connect wallet');
    }
  };

  const handleAddCandidate = () => {
    setCandidates([...candidates, '']);
  };

  const handleRemoveCandidate = (index: number) => {
    if (candidates.length <= 2) {
      toast.error('At least two candidates are required');
      return;
    }
    const newCandidates = [...candidates];
    newCandidates.splice(index, 1);
    setCandidates(newCandidates);
  };

  const handleCandidateChange = (index: number, value: string) => {
    const newCandidates = [...candidates];
    newCandidates[index] = value;
    setCandidates(newCandidates);
  };

  const validateForm = () => {
    if (!name || !description || !startTime || !endTime) {
      setError('All fields are required');
      return false;
    }

    // Validate candidates
    if (candidates.length < 2) {
      setError('At least two candidates are required');
      return false;
    }

    if (candidates.some(candidate => !candidate.trim())) {
      setError('All candidate names must be filled');
      return false;
    }

    // Validate dates
    const startDate = new Date(startTime).getTime() / 1000;
    const endDate = new Date(endTime).getTime() / 1000;
    const now = Math.floor(Date.now() / 1000);

    if (startDate <= now) {
      setError('Start time must be in the future');
      return false;
    }

    if (endDate <= startDate) {
      setError('End time must be after start time');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setError('');

      const startTimeUnix = Math.floor(new Date(startTime).getTime() / 1000);
      const endTimeUnix = Math.floor(new Date(endTime).getTime() / 1000);

      await createElection(
        name,
        description,
        candidates,
        startTimeUnix,
        endTimeUnix
      );

      toast.success('Election created successfully');
      navigate('/admin/manage-elections');
    } catch (err: any) {
      console.error('Error creating election:', err);
      setError(err.message || 'Failed to create election');
      toast.error('Failed to create election');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!connected) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">You need to connect your Ethereum wallet to create an election.</p>
          <Button onClick={handleConnectWallet}>Connect Wallet</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Election</h1>
            <p className="text-gray-600 mt-1">Set up a new blockchain-based election</p>
          </div>
          <Button variant="outline" onClick={handleGoBack}>
            Back to Elections
          </Button>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Candidates
                </label>
                <div className="space-y-3">
                  {candidates.map((candidate, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder={`Candidate ${index + 1}`}
                        value={candidate}
                        onChange={(e) => handleCandidateChange(index, e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none"
                        onClick={() => handleRemoveCandidate(index)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={handleAddCandidate}>
                    Add Candidate
                  </Button>
                </div>
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

              <div className="flex justify-between space-x-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoBack}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Create Election
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CreateElection;
