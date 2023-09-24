const hre = require("hardhat");

async function main() {

  const Surety = await hre.ethers.getContractFactory("Surety");
  const surety = await Surety.deploy();
  await surety.deployed();

  console.log(
    `Surety deployed to ${surety.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
