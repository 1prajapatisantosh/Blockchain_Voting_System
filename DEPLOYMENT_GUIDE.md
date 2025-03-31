# Blockchain Voting System - Deployment Guide

This guide will walk you through the process of deploying the Blockchain Voting System smart contract to different networks.

## Prerequisites

Before deploying, make sure you have the following:

- [Node.js](https://nodejs.org/) (v14 or later)
- [Truffle](https://trufflesuite.com/truffle/) (`npm install -g truffle`)
- A wallet with ETH for the network you're deploying to
- Infura API key (or other RPC provider)

## Setup Environment Variables

Create a `.env` file in the root of the project with the following variables:

```
MNEMONIC=your wallet mnemonic phrase here
INFURA_API_KEY=your infura api key here
ETHERSCAN_API_KEY=your etherscan api key here (for verification)
```

Install the required dependencies:

```bash
npm install @truffle/hdwallet-provider dotenv truffle-plugin-verify
```

## Configure the Network

The `truffle-config.js` file contains configurations for multiple networks. Before deploying, you'll need to:

1. Uncomment the HDWalletProvider code for your target network
2. Install the HDWalletProvider package if you haven't already:
   ```
   npm install @truffle/hdwallet-provider
   ```
3. Create and configure your `.env` file with your mnemonic and Infura API key

## Deploying to Local Development Network

For local development and testing:

1. Start Ganache (UI or CLI)
2. Run the migration:
   ```
   truffle migrate --network development
   ```

## Deploying to a Test Network (Sepolia or Goerli)

1. Make sure your wallet has test ETH (use a faucet if needed)
2. Deploy to the test network:
   ```
   truffle migrate --network sepolia
   # OR
   truffle migrate --network goerli
   ```

## Deploying to Mainnet

⚠️ **CAUTION**: Deploying to mainnet will cost real ETH. Make sure your contract is thoroughly tested before proceeding.

1. Deploy to mainnet:
   ```
   truffle migrate --network mainnet
   ```

## Verifying the Contract on Etherscan

After deployment, you can verify your contract on Etherscan for transparency:

1. Set your Etherscan API key in `truffle-config.js`
2. Run the verification command:
   ```
   truffle run verify VotingSystem --network sepolia
   # Replace "sepolia" with your deployment network
   ```

## Updating the Frontend

After deployment, you'll need to update the contract address in your frontend:

1. Open `src/contexts/Web3Context.tsx`
2. Update the `CONTRACT_ADDRESS` constant with your newly deployed contract address
3. Make sure the ABI in `src/contracts/VotingSystem.json` matches your deployed contract

## Security Considerations

- The admin of the contract has significant privileges. Consider implementing a multi-sig or DAO approach for production.
- Consider adding additional security measures like Pausable or Emergency Stop patterns for critical issues.
- Test thoroughly on testnets before deploying to mainnet.
- Consider having the contract audited by security professionals before mainnet deployment.

## Troubleshooting

If you encounter issues during deployment:

- Check that your wallet has sufficient ETH for gas
- Verify network connections and RPC endpoints
- Ensure your mnemonic is correct and the first account has funds
- Check gas settings in the truffle config if transactions are failing
