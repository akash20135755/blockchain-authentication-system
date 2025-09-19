const { ethers } = require("hardhat")

async function main() {
  const hre = require("hardhat")
  const network = hre.network
  console.log("🚀 Deploying ProductAuth smart contract...")

  // Get the contract factory
  const ProductAuth = await ethers.getContractFactory("ProductAuth")

  // Deploy the contract
  console.log("📝 Deploying contract...")
  const productAuth = await ProductAuth.deploy()

  // Wait for deployment to complete
  await productAuth.deployed()

  console.log("✅ ProductAuth deployed to:", productAuth.address)
  console.log("🔗 Transaction hash:", productAuth.deployTransaction.hash)

  // Verify contract on Etherscan (if not on local network)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("⏳ Waiting for block confirmations...")
    await productAuth.deployTransaction.wait(6)

    console.log("🔍 Verifying contract on Etherscan...")
    try {
      await hre.run("verify:verify", {
        address: productAuth.address,
        constructorArguments: [],
      })
      console.log("✅ Contract verified on Etherscan")
    } catch (error) {
      console.log("❌ Error verifying contract:", error.message)
    }
  }

  // Save deployment info
  const deploymentInfo = {
    address: productAuth.address,
    transactionHash: productAuth.deployTransaction.hash,
    network: network.name,
    timestamp: new Date().toISOString(),
  }

  console.log("\n📋 Deployment Summary:")
  console.log(JSON.stringify(deploymentInfo, null, 2))

  return deploymentInfo
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error)
    process.exit(1)
  })
