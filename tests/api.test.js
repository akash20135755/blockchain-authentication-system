const request = require("supertest")
const app = require("../server")

describe("API Endpoints", () => {
  describe("GET /api/health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/api/health").expect(200)

      expect(response.body).toHaveProperty("status", "OK")
      expect(response.body).toHaveProperty("message")
      expect(response.body).toHaveProperty("timestamp")
    })
  })

  describe("POST /api/register", () => {
    it("should register a new product successfully", async () => {
      const productId = `TEST-${Date.now()}`

      const response = await request(app).post("/api/register").send({ productId }).expect(201)

      expect(response.body).toHaveProperty("success", true)
      expect(response.body).toHaveProperty("message", "Product registered successfully")
      expect(response.body.data).toHaveProperty("productId", productId)
      expect(response.body.data).toHaveProperty("transactionHash")
    })

    it("should reject empty product ID", async () => {
      const response = await request(app).post("/api/register").send({ productId: "" }).expect(400)

      expect(response.body).toHaveProperty("success", false)
      expect(response.body).toHaveProperty("error")
    })

    it("should reject missing product ID", async () => {
      const response = await request(app).post("/api/register").send({}).expect(400)

      expect(response.body).toHaveProperty("success", false)
      expect(response.body.error).toContain("Product ID is required")
    })

    it("should reject duplicate product registration", async () => {
      const productId = `DUPLICATE-${Date.now()}`

      // First registration should succeed
      await request(app).post("/api/register").send({ productId }).expect(201)

      // Second registration should fail
      const response = await request(app).post("/api/register").send({ productId }).expect(409)

      expect(response.body).toHaveProperty("success", false)
      expect(response.body.error).toContain("already registered")
    })
  })

  describe("GET /api/verify/:productId", () => {
    let registeredProductId

    beforeAll(async () => {
      // Register a product for testing verification
      registeredProductId = `VERIFY-TEST-${Date.now()}`
      await request(app).post("/api/register").send({ productId: registeredProductId }).expect(201)
    })

    it("should verify registered product successfully", async () => {
      const response = await request(app).get(`/api/verify/${registeredProductId}`).expect(200)

      expect(response.body).toHaveProperty("success", true)
      expect(response.body).toHaveProperty("message", "Product verification successful")
      expect(response.body.data).toHaveProperty("productId", registeredProductId)
      expect(response.body.data).toHaveProperty("manufacturer")
      expect(response.body.data).toHaveProperty("isRegistered", true)
      expect(response.body.data).toHaveProperty("isGenuine", true)
    })

    it("should return 404 for non-existent product", async () => {
      const response = await request(app).get("/api/verify/NON-EXISTENT-PRODUCT").expect(404)

      expect(response.body).toHaveProperty("success", false)
      expect(response.body.error).toContain("not found")
    })

    it("should reject empty product ID", async () => {
      const response = await request(app).get("/api/verify/").expect(404) // Express returns 404 for missing route parameter
    })
  })

  describe("POST /api/sell", () => {
    let productId
    const newOwnerAddress = "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"

    beforeEach(async () => {
      // Register a product for testing sales
      productId = `SELL-TEST-${Date.now()}`
      await request(app).post("/api/register").send({ productId }).expect(201)
    })

    it("should transfer product ownership successfully", async () => {
      const response = await request(app)
        .post("/api/sell")
        .send({
          productId,
          newOwnerAddress,
        })
        .expect(200)

      expect(response.body).toHaveProperty("success", true)
      expect(response.body).toHaveProperty("message", "Product ownership transferred successfully")
      expect(response.body.data).toHaveProperty("productId", productId)
      expect(response.body.data).toHaveProperty("newOwner", newOwnerAddress)
      expect(response.body.data).toHaveProperty("transactionHash")
    })

    it("should reject invalid Ethereum address", async () => {
      const response = await request(app)
        .post("/api/sell")
        .send({
          productId,
          newOwnerAddress: "invalid-address",
        })
        .expect(400)

      expect(response.body).toHaveProperty("success", false)
      expect(response.body.error).toContain("Invalid Ethereum address")
    })

    it("should reject missing parameters", async () => {
      const response = await request(app).post("/api/sell").send({ productId }).expect(400)

      expect(response.body).toHaveProperty("success", false)
      expect(response.body.error).toContain("required")
    })
  })

  describe("Error Handling", () => {
    it("should return 404 for non-existent endpoints", async () => {
      const response = await request(app).get("/api/non-existent").expect(404)

      expect(response.body).toHaveProperty("success", false)
      expect(response.body.error).toContain("not found")
    })

    it("should handle malformed JSON", async () => {
      const response = await request(app)
        .post("/api/register")
        .send("invalid-json")
        .set("Content-Type", "application/json")
        .expect(400)
    })
  })
})
