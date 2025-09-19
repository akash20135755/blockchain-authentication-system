const request = require("supertest")
const app = require("../server")

describe("Integration Tests", () => {
  describe("End-to-End Product Lifecycle", () => {
    let productId

    beforeAll(() => {
      productId = `E2E-TEST-${Date.now()}`
    })

    it("should complete full product lifecycle", async () => {
      // Step 1: Register product
      const registerResponse = await request(app).post("/api/register").send({ productId }).expect(201)

      expect(registerResponse.body.success).toBe(true)
      expect(registerResponse.body.data.productId).toBe(productId)

      // Step 2: Verify product immediately after registration
      const verifyResponse = await request(app).get(`/api/verify/${productId}`).expect(200)

      expect(verifyResponse.body.success).toBe(true)
      expect(verifyResponse.body.data.productId).toBe(productId)
      expect(verifyResponse.body.data.isRegistered).toBe(true)
      expect(verifyResponse.body.data.isSold).toBe(false)

      // Step 3: Transfer ownership
      const newOwner = "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"
      const sellResponse = await request(app)
        .post("/api/sell")
        .send({
          productId,
          newOwnerAddress: newOwner,
        })
        .expect(200)

      expect(sellResponse.body.success).toBe(true)
      expect(sellResponse.body.data.newOwner).toBe(newOwner)

      // Step 4: Verify product after sale
      const verifyAfterSaleResponse = await request(app).get(`/api/verify/${productId}`).expect(200)

      expect(verifyAfterSaleResponse.body.data.isSold).toBe(true)
      expect(verifyAfterSaleResponse.body.data.currentOwner).toBe(newOwner)
    })
  })

  describe("Concurrent Operations", () => {
    it("should handle multiple simultaneous registrations", async () => {
      const promises = []
      const productIds = []

      // Create 5 concurrent registration requests
      for (let i = 0; i < 5; i++) {
        const productId = `CONCURRENT-${Date.now()}-${i}`
        productIds.push(productId)

        promises.push(request(app).post("/api/register").send({ productId }))
      }

      const responses = await Promise.all(promises)

      // All should succeed
      responses.forEach((response, index) => {
        expect(response.status).toBe(201)
        expect(response.body.success).toBe(true)
        expect(response.body.data.productId).toBe(productIds[index])
      })
    })

    it("should handle multiple simultaneous verifications", async () => {
      // First register a product
      const productId = `VERIFY-CONCURRENT-${Date.now()}`
      await request(app).post("/api/register").send({ productId }).expect(201)

      // Create 10 concurrent verification requests
      const promises = []
      for (let i = 0; i < 10; i++) {
        promises.push(request(app).get(`/api/verify/${productId}`))
      }

      const responses = await Promise.all(promises)

      // All should succeed with same data
      responses.forEach((response) => {
        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.data.productId).toBe(productId)
      })
    })
  })

  describe("Data Consistency", () => {
    it("should maintain data consistency across operations", async () => {
      const productId = `CONSISTENCY-${Date.now()}`

      // Register product
      const registerResponse = await request(app).post("/api/register").send({ productId }).expect(201)

      const registrationTimestamp = registerResponse.body.data.timestamp

      // Verify multiple times and ensure consistent data
      for (let i = 0; i < 3; i++) {
        const verifyResponse = await request(app).get(`/api/verify/${productId}`).expect(200)

        expect(verifyResponse.body.data.productId).toBe(productId)
        expect(verifyResponse.body.data.isRegistered).toBe(true)
        // Timestamp should remain consistent
        expect(new Date(verifyResponse.body.data.registrationTimestamp).getTime()).toBeCloseTo(
          new Date(registrationTimestamp).getTime(),
          -3,
        ) // Within 1 second
      }
    })
  })

  describe("Error Recovery", () => {
    it("should handle blockchain network simulation", async () => {
      // This test would require mocking blockchain failures
      // For now, we'll test the error handling structure

      const productId = `ERROR-TEST-${Date.now()}`

      // Attempt registration with potentially failing network
      const response = await request(app).post("/api/register").send({ productId })

      // Should either succeed (201) or fail gracefully (500)
      expect([201, 500]).toContain(response.status)

      if (response.status === 500) {
        expect(response.body.success).toBe(false)
        expect(response.body.error).toBeDefined()
      }
    })
  })
})
