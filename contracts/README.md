# Blockchain Voting System Smart Contracts

This directory contains the smart contracts for the Blockchain Voting System application.

## Overview

The main contract is `VotingSystem.sol`, which handles the creation of elections, tracking of votes, and management of election data.

## Smart Contract Structure

### VotingSystem.sol

The core contract that implements all voting functionality:

- **Admin Management**
  - `admin`: The contract admin who can create elections
  - `transferAdmin()`: Transfers admin rights to another address

- **Election Management**
  - `createElection()`: Creates a new election with candidates
  - `getElection()`: Gets information about an election
  - `getElectionCount()`: Returns the total number of elections

- **Voting Functions**
  - `vote()`: Casts a vote for a candidate in an election
  - `hasVoted()`: Checks if an address has already voted
  - `getVoteCount()`: Gets the vote count for a specific candidate
  - `getCandidateResults()`: Gets all candidate names and vote counts for an election

## Data Structures

- **Election**
  - `name`: Name of the election
  - `description`: Description of the election
  - `startTime`: Unix timestamp when voting begins
  - `endTime`: Unix timestamp when voting ends
  - `candidates`: Array of candidate information
  - `totalVotes`: Total number of votes cast
  - `hasVoted`: Mapping to track which addresses have voted

- **Candidate**
  - `name`: Name of the candidate
  - `voteCount`: Number of votes received

## Events

- `ElectionCreated`: Emitted when a new election is created
- `VoteCast`: Emitted when a vote is cast

## Security Considerations

- Only the admin can create elections
- Users can only vote once per election
- Votes can only be cast during the election period
- The contract implements appropriate access controls
- Input validation is performed throughout the contract

## Development

1. Install dependencies: `npm install`
2. Compile contracts: `npm run compile`
3. Run tests: `npm run test`
4. Deploy contracts: See the deployment instructions in `DEPLOYMENT_GUIDE.md`

## Testing

The contracts include comprehensive tests to verify functionality. Run the tests using:

```bash
npm run test
```

## Deployment

For detailed deployment instructions, see the `DEPLOYMENT_GUIDE.md` file in the project root.

## License

This code is licensed under the MIT License.
