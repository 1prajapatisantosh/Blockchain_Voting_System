import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

// This will be our smart contract ABI
import VotingSystemABI from '../contracts/VotingSystem.json';

// Define an interface for the election result that includes candidateResults
interface ElectionResult {
  id: string;
  name: any;
  description: any;
  startTime: any;
  endTime: any;
  candidates: any;
  totalVotes: any;
  candidateResults?: Array<{
    id: number;
    name: string;
    votes: number;
  }>;
}

interface Web3ContextType {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  connected: boolean;
  account: string | null;
  chainId: number | null;
  votingContract: ethers.Contract | null;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  getElections: () => Promise<any[]>;
  getElectionById: (id: string) => Promise<ElectionResult | null>;
  createElection: (name: string, description: string, candidates: string[], startTime: number, endTime: number) => Promise<boolean>;
  castVote: (electionId: string, candidateId: number) => Promise<void>;
  hasVoted: (electionId: string) => Promise<boolean>;
  startElection: (electionId: string) => Promise<void>;
  endElection: (electionId: string) => Promise<void>;
  updateElection: (electionId: string, name: string, description: string, startTime: number, endTime: number) => Promise<void>;
}

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x9A7d323C5D96C7CD4f18905eA05483dC38524Ccf";

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [votingContract, setVotingContract] = useState<ethers.Contract | null>(null);

  // Check for existing connection on mount and reconnect if possible
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        try {
          await connectWallet();
        } catch (error) {
          console.error("Failed to reconnect wallet:", error);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect();
        } else if (accounts[0] !== account) {
          // Account changed, update state
          setAccount(accounts[0]);
          // Reinitialize with new account
          connectWallet().catch(console.error);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => {
        // When chain changes, refresh the page to ensure all state is updated correctly
        window.location.reload();
      });

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', () => {});
      };
    }
  }, [account]);

  // Connect to Metamask wallet
  async function connectWallet(): Promise<void> {
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);

        const web3Signer = web3Provider.getSigner();
        setSigner(web3Signer);

        const address = await web3Signer.getAddress();
        setAccount(address);

        const network = await web3Provider.getNetwork();
        setChainId(network.chainId);

        // Initialize contract
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          VotingSystemABI.abi,
          web3Signer
        );
        setVotingContract(contract);

        setConnected(true);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        throw error;
      }
    } else {
      console.error("MetaMask is not installed");
      throw new Error("MetaMask is not installed");
    }
  }

  function disconnect() {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setVotingContract(null);
    setConnected(false);
  }

  // Contract interaction methods
  async function getElections() {
    if (!votingContract) return [];

    try {
      const count = await votingContract.getElectionCount();
      const elections = [];

      for (let i = 0; i < count; i++) {
        const election = await votingContract.getElection(i);
        elections.push({
          id: i.toString(),
          name: election.name,
          description: election.description,
          startTime: election.startTime.toNumber(),
          endTime: election.endTime.toNumber(),
          candidates: election.candidates,
          totalVotes: election.totalVotes.toNumber()
        });
      }

      return elections;
    } catch (error) {
      console.error("Error getting elections:", error);
      return [];
    }
  }

  async function getElectionById(id: string): Promise<ElectionResult | null> {
    if (!votingContract) return null;

    try {
      const election = await votingContract.getElection(id);

      const result: ElectionResult = {
        id: id,
        name: election.name,
        description: election.description,
        startTime: election.startTime.toNumber() * 1000, // Convert to milliseconds
        endTime: election.endTime.toNumber() * 1000, // Convert to milliseconds
        candidates: election.candidates,
        totalVotes: election.totalVotes.toNumber()
      };

      // Get votes for each candidate
      const candidateResults = [];
      for (let i = 0; i < election.candidates.length; i++) {
        const votes = await votingContract.getVoteCount(id, i);
        candidateResults.push({
          id: i,
          name: election.candidates[i],
          votes: votes.toNumber()
        });
      }

      result.candidateResults = candidateResults;

      return result;
    } catch (error) {
      console.error("Error getting election:", error);
      return null;
    }
  }

  async function createElection(name: string, description: string, candidates: string[], startTime: number, endTime: number): Promise<boolean> {
    if (!votingContract) throw new Error("Contract not initialized");

    try {
      const tx = await votingContract.createElection(
        name,
        description,
        candidates,
        startTime,
        endTime
      );

      await tx.wait();
      return true;
    } catch (error) {
      console.error("Error creating election:", error);
      throw error;
    }
  }

  async function castVote(electionId: string, candidateId: number): Promise<void> {
    if (!votingContract) throw new Error("Contract not initialized");

    try {
      const tx = await votingContract.vote(electionId, candidateId);
      await tx.wait();
    } catch (error) {
      console.error("Error casting vote:", error);
      throw error;
    }
  }

  async function hasVoted(electionId: string) {
    if (!votingContract || !account) return false;

    try {
      return await votingContract.hasVoted(electionId, account);
    } catch (error) {
      console.error("Error checking if user has voted:", error);
      return false;
    }
  }

  const value = {
    provider,
    signer,
    connected,
    account,
    chainId,
    votingContract,
    connectWallet,
    disconnect,
    getElections,
    getElectionById,
    createElection,
    castVote,
    hasVoted,
    startElection: async (electionId: string) => {
      if (!votingContract) throw new Error("Contract not initialized");

      try {
        const election = await votingContract.getElection(electionId);
        const now = Math.floor(Date.now() / 1000);

        // Update the election to start now
        const tx = await votingContract.updateElection(
          electionId,
          election.name,
          election.description,
          now, // Start now
          election.endTime.toNumber()
        );

        await tx.wait();
      } catch (error) {
        console.error("Error starting election:", error);
        throw error;
      }
    },
    endElection: async (electionId: string) => {
      if (!votingContract) throw new Error("Contract not initialized");

      try {
        const election = await votingContract.getElection(electionId);
        const now = Math.floor(Date.now() / 1000);

        // Update the election to end now
        const tx = await votingContract.updateElection(
          electionId,
          election.name,
          election.description,
          election.startTime.toNumber(),
          now // End now
        );

        await tx.wait();
      } catch (error) {
        console.error("Error ending election:", error);
        throw error;
      }
    },
    updateElection: async (electionId: string, name: string, description: string, startTime: number, endTime: number) => {
      if (!votingContract) throw new Error("Contract not initialized");

      try {
        const tx = await votingContract.updateElection(
          electionId,
          name,
          description,
          startTime,
          endTime
        );

        await tx.wait();
      } catch (error) {
        console.error("Error updating election:", error);
        throw error;
      }
    }
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

// Add TypeScript interface for window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}
