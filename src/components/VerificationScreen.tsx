import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface VerificationScreenProps {
  onComplete: () => void;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing...');

  useEffect(() => {
    const verificationSteps = [
      { progress: 20, text: 'Connecting to blockchain...' },
      { progress: 40, text: 'Verifying security...' },
      { progress: 60, text: 'Loading election data...' },
      { progress: 80, text: 'Preparing interface...' },
      { progress: 100, text: 'Ready!' },
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < verificationSteps.length) {
        setProgress(verificationSteps[currentStep].progress);
        setStatusText(verificationSteps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 500); // Show "Ready!" message briefly before completing
      }
    }, 400); // Speed of verification steps

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-indigo-900 to-indigo-600 flex items-center justify-center z-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 mx-4">
        <div className="flex items-center mb-6">
          <div className="bg-indigo-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-gray-800">BlockVote</h2>
            <p className="text-gray-600">Secure Blockchain Voting System</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Verification Progress</span>
            <span className="text-sm font-medium text-indigo-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <LoadingSpinner size="sm" variant="primary" />
          <span className="ml-3 text-gray-700">{statusText}</span>
        </div>
      </div>
    </div>
  );
};

export default VerificationScreen;
