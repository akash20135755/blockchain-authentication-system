// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ProductAuth
 * @dev Smart contract for blockchain-based product authentication system
 * @notice This contract allows manufacturers to register products and customers to verify authenticity
 */
contract ProductAuth {
    // Product structure to store product information
    struct Product {
        string productId;        // Unique identifier (IMEI/Serial Number)
        address manufacturer;    // Address of the manufacturer who registered the product
        uint256 timestamp;       // Registration timestamp
        bool isRegistered;       // Registration status
        bool isSold;            // Sale status
        address currentOwner;    // Current owner of the product
    }

    // Contract owner (deployer)
    address public owner;
    
    // Mapping from product ID to Product struct
    mapping(string => Product) public products;
    
    // Array to store all registered product IDs
    string[] public registeredProducts;

    // Events
    event ProductRegistered(
        string indexed productId,
        address indexed manufacturer,
        uint256 timestamp
    );
    
    event ProductSold(
        string indexed productId,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 timestamp
    );

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can perform this action");
        _;
    }

    modifier onlyManufacturer(string memory _productId) {
        require(
            products[_productId].manufacturer == msg.sender,
            "Only the manufacturer can perform this action"
        );
        _;
    }

    modifier productExists(string memory _productId) {
        require(
            products[_productId].isRegistered,
            "Product does not exist"
        );
        _;
    }

    /**
     * @dev Constructor sets the contract deployer as owner
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Register a new product on the blockchain
     * @param _productId Unique identifier for the product (IMEI/Serial Number)
     * @notice Only manufacturers can register products
     */
    function registerProduct(string memory _productId) public {
        require(bytes(_productId).length > 0, "Product ID cannot be empty");
        require(!products[_productId].isRegistered, "Product already registered");

        // Create new product entry
        products[_productId] = Product({
            productId: _productId,
            manufacturer: msg.sender,
            timestamp: block.timestamp,
            isRegistered: true,
            isSold: false,
            currentOwner: msg.sender
        });

        // Add to registered products array
        registeredProducts.push(_productId);

        // Emit registration event
        emit ProductRegistered(_productId, msg.sender, block.timestamp);
    }

    /**
     * @dev Transfer product ownership (simulate sale)
     * @param _productId Product identifier
     * @param _newOwner Address of the new owner
     */
    function sellProduct(string memory _productId, address _newOwner) 
        public 
        productExists(_productId) 
    {
        require(_newOwner != address(0), "Invalid new owner address");
        require(
            products[_productId].currentOwner == msg.sender,
            "Only current owner can sell the product"
        );

        address previousOwner = products[_productId].currentOwner;
        products[_productId].currentOwner = _newOwner;
        products[_productId].isSold = true;

        // Emit sale event
        emit ProductSold(_productId, previousOwner, _newOwner, block.timestamp);
    }

    /**
     * @dev Verify product authenticity
     * @param _productId Product identifier to verify
     * @return Product struct containing all product information
     */
    function verifyProduct(string memory _productId) 
        public 
        view 
        returns (Product memory) 
    {
        require(products[_productId].isRegistered, "Product not found");
        return products[_productId];
    }

    /**
     * @dev Get total number of registered products
     * @return Total count of registered products
     */
    function getTotalProducts() public view returns (uint256) {
        return registeredProducts.length;
    }

    /**
     * @dev Get product ID by index
     * @param _index Index in the registered products array
     * @return Product ID at the specified index
     */
    function getProductByIndex(uint256 _index) public view returns (string memory) {
        require(_index < registeredProducts.length, "Index out of bounds");
        return registeredProducts[_index];
    }

    /**
     * @dev Check if a product is registered
     * @param _productId Product identifier to check
     * @return Boolean indicating registration status
     */
    function isProductRegistered(string memory _productId) public view returns (bool) {
        return products[_productId].isRegistered;
    }
}
