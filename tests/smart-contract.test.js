const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("ProductAuth Smart Contract", () => {
  let productAuth
  let owner
  let manufacturer
  let customer
  let addrs

  beforeEach(async () => {
    // Get signers
    ;[owner, manufacturer, customer, ...addrs] = await ethers.getSigners()

    // Deploy contract
    const ProductAuth = await ethers.getContractFactory("ProductAuth")
    productAuth = await ProductAuth.deploy()
    await productAuth.deployed()
  })

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await productAuth.owner()).to.equal(owner.address)
    })

    it("Should start with zero registered products", async () => {
      expect(await productAuth.getTotalProducts()).to.equal(0)
    })
  })

  describe("Product Registration", () => {
    it("Should register a new product successfully", async () => {
      const productId = "IMEI-123456789012345"

      await expect(productAuth.connect(manufacturer).registerProduct(productId))
        .to.emit(productAuth, "ProductRegistered")
        .withArgs(productId, manufacturer.address, anyValue)

      const product = await productAuth.verifyProduct(productId)
      expect(product.productId).to.equal(productId)
      expect(product.manufacturer).to.equal(manufacturer.address)
      expect(product.isRegistered).to.be.true
      expect(product.isSold).to.be.false
      expect(product.currentOwner).to.equal(manufacturer.address)
    })

    it("Should reject empty product ID", async () => {
      await expect(productAuth.connect(manufacturer).registerProduct("")).to.be.revertedWith(
        "Product ID cannot be empty",
      )
    })

    it("Should reject duplicate product registration", async () => {
      const productId = "IMEI-123456789012345"

      await productAuth.connect(manufacturer).registerProduct(productId)

      await expect(productAuth.connect(manufacturer).registerProduct(productId)).to.be.revertedWith(
        "Product already registered",
      )
    })

    it("Should increment total products count", async () => {
      const productId1 = "IMEI-111111111111111"
      const productId2 = "IMEI-222222222222222"

      await productAuth.connect(manufacturer).registerProduct(productId1)
      expect(await productAuth.getTotalProducts()).to.equal(1)

      await productAuth.connect(manufacturer).registerProduct(productId2)
      expect(await productAuth.getTotalProducts()).to.equal(2)
    })
  })

  describe("Product Verification", () => {
    beforeEach(async () => {
      await productAuth.connect(manufacturer).registerProduct("IMEI-123456789012345")
    })

    it("Should verify registered product", async () => {
      const product = await productAuth.verifyProduct("IMEI-123456789012345")

      expect(product.productId).to.equal("IMEI-123456789012345")
      expect(product.manufacturer).to.equal(manufacturer.address)
      expect(product.isRegistered).to.be.true
    })

    it("Should reject verification of non-existent product", async () => {
      await expect(productAuth.verifyProduct("NON-EXISTENT")).to.be.revertedWith("Product not found")
    })

    it("Should check registration status correctly", async () => {
      expect(await productAuth.isProductRegistered("IMEI-123456789012345")).to.be.true
      expect(await productAuth.isProductRegistered("NON-EXISTENT")).to.be.false
    })
  })

  describe("Product Sale/Transfer", () => {
    const productId = "IMEI-123456789012345"

    beforeEach(async () => {
      await productAuth.connect(manufacturer).registerProduct(productId)
    })

    it("Should transfer product ownership successfully", async () => {
      await expect(productAuth.connect(manufacturer).sellProduct(productId, customer.address))
        .to.emit(productAuth, "ProductSold")
        .withArgs(productId, manufacturer.address, customer.address, anyValue)

      const product = await productAuth.verifyProduct(productId)
      expect(product.currentOwner).to.equal(customer.address)
      expect(product.isSold).to.be.true
    })

    it("Should reject sale by non-owner", async () => {
      await expect(productAuth.connect(customer).sellProduct(productId, customer.address)).to.be.revertedWith(
        "Only current owner can sell the product",
      )
    })

    it("Should reject sale to zero address", async () => {
      await expect(
        productAuth.connect(manufacturer).sellProduct(productId, ethers.constants.AddressZero),
      ).to.be.revertedWith("Invalid new owner address")
    })

    it("Should reject sale of non-existent product", async () => {
      await expect(productAuth.connect(manufacturer).sellProduct("NON-EXISTENT", customer.address)).to.be.revertedWith(
        "Product does not exist",
      )
    })
  })

  describe("Product Indexing", () => {
    it("Should return correct product by index", async () => {
      const productId1 = "IMEI-111111111111111"
      const productId2 = "IMEI-222222222222222"

      await productAuth.connect(manufacturer).registerProduct(productId1)
      await productAuth.connect(manufacturer).registerProduct(productId2)

      expect(await productAuth.getProductByIndex(0)).to.equal(productId1)
      expect(await productAuth.getProductByIndex(1)).to.equal(productId2)
    })

    it("Should reject out of bounds index", async () => {
      await expect(productAuth.getProductByIndex(0)).to.be.revertedWith("Index out of bounds")
    })
  })
})

// Helper function for testing events with timestamps
const anyValue = require("@nomicfoundation/hardhat-chai-matchers/withArgs")
