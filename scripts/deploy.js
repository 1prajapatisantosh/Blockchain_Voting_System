const hre = require("hardhat");

async function main() {
  console.log("Deploying VotingSystem contract...");

  // Get the contract factory
  const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");

  // Deploy the contract
  const votingSystem = await VotingSystem.deploy();

  // Wait for deployment to finish
  await votingSystem.deployed();

  console.log("VotingSystem deployed to:", votingSystem.address);

  // Save the contract address to a file for easy access
  const fs = require("fs");
  const contractInfo = {
    address: votingSystem.address,
    network: hre.network.name,
    timestamp: new Date().toISOString()
  };

  // Make sure the directory exists
  if (!fs.existsSync("./deployment")) {
    fs.mkdirSync("./deployment");
  }

  fs.writeFileSync(
    "./deployment/contract-address.json",
    JSON.stringify(contractInfo, null, 2)
  );

  console.log("Contract address saved to deployment/contract-address.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
