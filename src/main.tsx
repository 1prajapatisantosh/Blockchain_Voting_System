import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import VerificationScreen from './components/VerificationScreen';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}

const Main = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show verification screen immediately instead of waiting
    setIsLoading(false);
  }, []);

  const handleVerificationComplete = () => {
    setIsVerified(true);
  };

  if (isLoading) {
    return null; // Initial blank state while checking
  }

  return isVerified ? <App /> : <VerificationScreen onComplete={handleVerificationComplete} />;
};

ReactDOM.createRoot(rootElement!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
