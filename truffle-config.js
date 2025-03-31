/**
 * Truffle configuration file for the Blockchain Voting System
 */

module.exports = {
  // Configure networks for deployment
  networks: {
    // Development network (local)
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
    },

    // Configuration for Goerli testnet
    goerli: {
      provider: () => {
        // You would normally use an .env file with a MNEMONIC and INFURA_API_KEY
        // const HDWalletProvider = require('@truffle/hdwallet-provider');
        // return new HDWalletProvider(process.env.MNEMONIC, `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`);
        return null; // Replace with actual provider when deploying
      },
      network_id: 5,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },

    // Configuration for Sepolia testnet
    sepolia: {
      provider: () => {
        // You would normally use an .env file with a MNEMONIC and INFURA_API_KEY
        // const HDWalletProvider = require('@truffle/hdwallet-provider');
        // return new HDWalletProvider(process.env.MNEMONIC, `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`);
        return null; // Replace with actual provider when deploying
      },
      network_id: 11155111,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },

    // Configuration for mainnet (use with caution)
    mainnet: {
      provider: () => {
        // You would normally use an .env file with a MNEMONIC and INFURA_API_KEY
        // const HDWalletProvider = require('@truffle/hdwallet-provider');
        // return new HDWalletProvider(process.env.MNEMONIC, `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);
        return null; // Replace with actual provider when deploying
      },
      network_id: 1,
      gas: 5500000,
      gasPrice: 20000000000, // 20 gwei
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },

  // Configure compiler settings
  compilers: {
    solc: {
      version: "0.8.17", // Fetch exact version from solc-bin
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },

  // Plugin settings
  plugins: [
    'truffle-plugin-verify'
  ],

  // API keys for verification (etherscan, etc.)
  api_keys: {
    // etherscan: 'YOUR_ETHERSCAN_API_KEY'
  }
};
