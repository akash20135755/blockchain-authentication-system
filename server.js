const express = require("express")
const { ethers } = require("ethers")
const cors = require("cors")
const helmet = require("helmet")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Smart contract configuration
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS
const PRIVATE_KEY = process.env.PRIVATE_KEY
const RPC_URL = process.env.RPC_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"

// Smart contract ABI (Application Binary Interface)
const CONTRACT_ABI = [
  "function registerProduct(string memory _productId) public",
  "function verifyProduct(string memory _productId) public view returns (tuple(string productId, address manufacturer, uint256 timestamp, bool isRegistered, bool isSold, address currentOwner))",
  "function sellProduct(string memory _productId, address _newOwner) public",
  "function isProductRegistered(string memory _productId) public view returns (bool)",
  "event ProductRegistered(string indexed productId, address indexed manufacturer, uint256 timestamp)",
  "event ProductSold(string indexed productId, address indexed previousOwner, address indexed newOwner, uint256 timestamp)",
]

// Initialize blockchain connection
let provider, wallet, contract

try {
  provider = new ethers.JsonRpcProvider(RPC_URL)
  wallet = new ethers.Wallet(PRIVATE_KEY, provider)
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet)
  console.log("✅ Blockchain connection established")
} catch (error) {
  console.error("❌ Failed to connect to blockchain:", error.message)
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Product Authentication API is running",
    timestamp: new Date().toISOString(),
  })
})

/**
 * Register a new product on the blockchain
 * POST /api/register
 * Body: { productId: string }
 */
app.post("/api/register", async (req, res) => {
  try {
    const { productId } = req.body

    // Validation
    if (!productId || typeof productId !== "string" || productId.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Product ID is required and must be a non-empty string",
      })
    }

    // Check if product already exists
    const isRegistered = await contract.isProductRegistered(productId)
    if (isRegistered) {
      return res.status(409).json({
        success: false,
        error: "Product is already registered",
      })
    }

    // Register product on blockchain
    console.log(`📝 Registering product: ${productId}`)
    const tx = await contract.registerProduct(productId)

    // Wait for transaction confirmation
    const receipt = await tx.wait()

    console.log(`✅ Product registered successfully. Transaction hash: ${receipt.hash}`)

    res.status(201).json({
      success: true,
      message: "Product registered successfully",
      data: {
        productId,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("❌ Registration error:", error)

    // Handle specific blockchain errors
    if (error.code === "CALL_EXCEPTION") {
      return res.status(400).json({
        success: false,
        error: "Smart contract call failed. Please check your input.",
      })
    }

    res.status(500).json({
      success: false,
      error: "Internal server error during product registration",
    })
  }
})

/**
 * Verify product authenticity
 * GET /api/verify/:productId
 */
app.get("/api/verify/:productId", async (req, res) => {
  try {
    const { productId } = req.params

    // Validation
    if (!productId || productId.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Product ID is required",
      })
    }

    console.log(`🔍 Verifying product: ${productId}`)

    // Check if product exists
    const isRegistered = await contract.isProductRegistered(productId)

    if (!isRegistered) {
      return res.status(404).json({
        success: false,
        error: "Product not found or is not registered",
      })
    }

    // Get product details from blockchain
    const productData = await contract.verifyProduct(productId)

    // Format response data
    const formattedProduct = {
      productId: productData.productId,
      manufacturer: productData.manufacturer,
      registrationTimestamp: new Date(Number(productData.timestamp) * 1000).toISOString(),
      isRegistered: productData.isRegistered,
      isSold: productData.isSold,
      currentOwner: productData.currentOwner,
      isGenuine: true,
    }

    console.log(`✅ Product verified successfully: ${productId}`)

    res.json({
      success: true,
      message: "Product verification successful",
      data: formattedProduct,
    })
  } catch (error) {
    console.error("❌ Verification error:", error)

    // Handle product not found error
    if (error.reason && error.reason.includes("Product not found")) {
      return res.status(404).json({
        success: false,
        error: "Product not found or is fake",
      })
    }

    res.status(500).json({
      success: false,
      error: "Internal server error during product verification",
    })
  }
})

/**
 * Transfer product ownership (simulate sale)
 * POST /api/sell
 * Body: { productId: string, newOwnerAddress: string }
 */
app.post("/api/sell", async (req, res) => {
  try {
    const { productId, newOwnerAddress } = req.body

    // Validation
    if (!productId || !newOwnerAddress) {
      return res.status(400).json({
        success: false,
        error: "Product ID and new owner address are required",
      })
    }

    if (!ethers.isAddress(newOwnerAddress)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Ethereum address",
      })
    }

    console.log(`🔄 Transferring product: ${productId} to ${newOwnerAddress}`)

    // Execute sale transaction
    const tx = await contract.sellProduct(productId, newOwnerAddress)
    const receipt = await tx.wait()

    console.log(`✅ Product transferred successfully. Transaction hash: ${receipt.hash}`)

    res.json({
      success: true,
      message: "Product ownership transferred successfully",
      data: {
        productId,
        newOwner: newOwnerAddress,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("❌ Sale error:", error)

    res.status(500).json({
      success: false,
      error: "Internal server error during product sale",
    })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err)
  res.status(500).json({
    success: false,
    error: "Internal server error",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`)
})

module.exports = app
