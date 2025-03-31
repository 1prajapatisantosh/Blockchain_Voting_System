const VotingSystem = artifacts.require("VotingSystem");
const { time } = require("@openzeppelin/test-helpers");

contract("VotingSystem", (accounts) => {
  const admin = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];
  const newAdmin = accounts[3];

  let votingSystem;

  const electionName = "Test Election";
  const electionDescription = "This is a test election";
  const candidates = ["Candidate 1", "Candidate 2", "Candidate 3"];

  beforeEach(async () => {
    votingSystem = await VotingSystem.new({ from: admin });
  });

  describe("Deployment", () => {
    it("should set the deployer as admin", async () => {
      const contractAdmin = await votingSystem.admin();
      assert.equal(contractAdmin, admin, "Admin was not set correctly");
    });

    it("should start with no elections", async () => {
      const electionCount = await votingSystem.getElectionCount();
      assert.equal(electionCount, 0, "Should start with 0 elections");
    });
  });

  describe("Election management", () => {
    it("should allow admin to create an election", async () => {
      const now = Math.floor(Date.now() / 1000);
      const startTime = now + 100;
      const endTime = now + 1000;

      await votingSystem.createElection(
        electionName,
        electionDescription,
        candidates,
        startTime,
        endTime,
        { from: admin }
      );

      const electionCount = await votingSystem.getElectionCount();
      assert.equal(electionCount, 1, "Election count should be 1");

      const election = await votingSystem.getElection(0);
      assert.equal(election.name, electionName, "Election name doesn't match");
      assert.equal(election.description, electionDescription, "Election description doesn't match");
      assert.equal(election.startTime, startTime, "Start time doesn't match");
      assert.equal(election.endTime, endTime, "End time doesn't match");
      assert.equal(election.candidates.length, candidates.length, "Candidates length doesn't match");
      assert.equal(election.totalVotes, 0, "Initial total votes should be 0");
    });

    it("should not allow non-admin to create an election", async () => {
      const now = Math.floor(Date.now() / 1000);
      const startTime = now + 100;
      const endTime = now + 1000;

      try {
        await votingSystem.createElection(
          electionName,
          electionDescription,
          candidates,
          startTime,
          endTime,
          { from: voter1 }
        );
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error.message.includes("Only admin"), "Should fail with admin error");
      }
    });

    it("should not allow elections with endTime before startTime", async () => {
      const now = Math.floor(Date.now() / 1000);
      const startTime = now + 1000;
      const endTime = now + 100; // Before startTime

      try {
        await votingSystem.createElection(
          electionName,
          electionDescription,
          candidates,
          startTime,
          endTime,
          { from: admin }
        );
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error.message.includes("End time must be after start time"), "Should fail with time validation error");
      }
    });
  });

  describe("Voting", () => {
    beforeEach(async () => {
      // Create an election that's active now
      const now = Math.floor(Date.now() / 1000);
      const startTime = now;
      const endTime = now + 10000;

      await votingSystem.createElection(
        electionName,
        electionDescription,
        candidates,
        startTime,
        endTime,
        { from: admin }
      );
    });

    it("should allow a voter to cast a vote", async () => {
      await votingSystem.vote(0, 1, { from: voter1 });

      const hasVoted = await votingSystem.hasVoted(0, voter1);
      assert.equal(hasVoted, true, "Voter should be marked as having voted");

      const voteCount = await votingSystem.getVoteCount(0, 1);
      assert.equal(voteCount, 1, "Vote count should be 1");

      const election = await votingSystem.getElection(0);
      assert.equal(election.totalVotes, 1, "Total votes should be 1");
    });

    it("should not allow a voter to vote twice", async () => {
      await votingSystem.vote(0, 1, { from: voter1 });

      try {
        await votingSystem.vote(0, 2, { from: voter1 });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error.message.includes("already voted"), "Should fail with already voted error");
      }
    });

    it("should not allow voting for invalid candidate", async () => {
      try {
        await votingSystem.vote(0, 99, { from: voter1 });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error.message.includes("Invalid candidate"), "Should fail with invalid candidate error");
      }
    });

    it("should count votes correctly for multiple voters", async () => {
      await votingSystem.vote(0, 0, { from: voter1 });
      await votingSystem.vote(0, 1, { from: voter2 });

      const voteCount0 = await votingSystem.getVoteCount(0, 0);
      const voteCount1 = await votingSystem.getVoteCount(0, 1);

      assert.equal(voteCount0, 1, "Vote count for candidate 0 should be 1");
      assert.equal(voteCount1, 1, "Vote count for candidate 1 should be 1");

      const election = await votingSystem.getElection(0);
      assert.equal(election.totalVotes, 2, "Total votes should be 2");
    });

    it("should correctly return candidate results", async () => {
      await votingSystem.vote(0, 0, { from: voter1 });
      await votingSystem.vote(0, 1, { from: voter2 });

      const results = await votingSystem.getCandidateResults(0);

      assert.equal(results.names.length, 3, "Should have 3 candidate names");
      assert.equal(results.voteCounts.length, 3, "Should have 3 vote counts");
      assert.equal(results.voteCounts[0], 1, "Candidate 0 should have 1 vote");
      assert.equal(results.voteCounts[1], 1, "Candidate 1 should have 1 vote");
      assert.equal(results.voteCounts[2], 0, "Candidate 2 should have 0 votes");
    });
  });

  describe("Admin transfer", () => {
    it("should allow admin to transfer admin role", async () => {
      await votingSystem.transferAdmin(newAdmin, { from: admin });
      const contractAdmin = await votingSystem.admin();
      assert.equal(contractAdmin, newAdmin, "Admin should be updated");
    });

    it("should not allow non-admin to transfer admin role", async () => {
      try {
        await votingSystem.transferAdmin(newAdmin, { from: voter1 });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error.message.includes("Only admin"), "Should fail with admin error");
      }
    });
  });
});
