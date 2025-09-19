// Global test setup
const { expect } = require("chai")
const { beforeAll, afterAll } = require("@jest/globals") // Declare beforeAll and afterAll

// Extend Jest matchers with Chai
global.expect = expect

// Global test configuration
beforeAll(async () => {
  console.log("🧪 Starting test suite...")

  // Set test environment variables
  process.env.NODE_ENV = "test"
  process.env.PORT = "3002" // Different port for testing

  // Mock blockchain connection for tests that don't need real blockchain
  if (process.env.MOCK_BLOCKCHAIN === "true") {
    console.log("📝 Using mocked blockchain for tests")
  }
})

afterAll(async () => {
  console.log("✅ Test suite completed")
})

// Global error handler for unhandled promises
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason)
})
