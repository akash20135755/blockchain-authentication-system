# Blockchain-Based Product Authentication System

A comprehensive solution for preventing counterfeit products using blockchain technology. This system enables manufacturers to register genuine products on the Ethereum blockchain and allows customers to verify product authenticity.

## 🚀 Features

- **Immutable Product Registration**: Manufacturers can register products on the blockchain
- **Instant Verification**: Customers can verify product authenticity in seconds
- **Ownership Tracking**: Track product ownership transfers
- **Tamper-Proof Records**: All data stored immutably on blockchain
- **User-Friendly Interface**: Intuitive web interfaces for all user types

## 🏗️ Architecture

### Smart Contract Layer
- **Technology**: Solidity ^0.8.20
- **Network**: Ethereum (Sepolia Testnet)
- **Features**: Product registration, verification, ownership transfer

### Backend API
- **Technology**: Node.js + Express
- **Blockchain Integration**: ethers.js
- **Features**: RESTful API, blockchain interaction, data validation

### Frontend Application
- **Technology**: React + Next.js
- **Styling**: Tailwind CSS + shadcn/ui
- **Features**: Customer verification portal, manufacturer dashboard

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Ethereum wallet (MetaMask recommended)
- Infura or Alchemy account for blockchain access

## 🛠️ Installation

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd blockchain-product-auth
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Setup
Create a `.env` file in the root directory:
\`\`\`env
CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
PRIVATE_KEY=your_private_key_here
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PORT=3001
\`\`\`

### 4. Deploy Smart Contract
\`\`\`bash
# Using Hardhat (recommended)
npx hardhat compile
npx hardhat deploy --network sepolia

# Or using Remix IDE
# Copy contracts/ProductAuth.sol to Remix
# Compile and deploy to Sepolia testnet
\`\`\`

### 5. Start the Application

#### Backend Server
\`\`\`bash
npm start
# or for development
npm run dev
\`\`\`

#### Frontend Application
\`\`\`bash
npm run build
npm run start
# or for development
npm run dev
\`\`\`

## 🔧 Usage

### For Manufacturers

1. **Access Manufacturer Dashboard**
   - Navigate to `/manufacturer`
   - Use the registration form to add new products

2. **Register Products**
   - Enter unique product ID (IMEI/Serial Number)
   - Click "Register Product"
   - Wait for blockchain confirmation

3. **Manage Products**
   - View registered products
   - Transfer ownership when products are sold

### For Customers

1. **Verify Product Authenticity**
   - Navigate to the main verification page
   - Enter product ID from your device
   - Click "Verify Product"

2. **Interpret Results**
   - ✅ **Genuine**: Product is registered and authentic
   - ❌ **Not Found**: Product may be counterfeit or unregistered

## 🔌 API Endpoints

### Product Registration
\`\`\`http
POST /api/register
Content-Type: application/json

{
  "productId": "IMEI-123456789012345"
}
\`\`\`

### Product Verification
\`\`\`http
GET /api/verify/:productId
\`\`\`

### Ownership Transfer
\`\`\`http
POST /api/sell
Content-Type: application/json

{
  "productId": "IMEI-123456789012345",
  "newOwnerAddress": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"
}
\`\`\`

### Health Check
\`\`\`http
GET /api/health
\`\`\`

## 🧪 Testing

### Run Unit Tests
\`\`\`bash
npm test
\`\`\`

### Run Smart Contract Tests
\`\`\`bash
npx hardhat test
\`\`\`

### API Testing with Postman
Import the provided Postman collection for comprehensive API testing.

## 📊 Smart Contract Functions

### Core Functions
- `registerProduct(string _productId)`: Register a new product
- `verifyProduct(string _productId)`: Verify product authenticity
- `sellProduct(string _productId, address _newOwner)`: Transfer ownership
- `isProductRegistered(string _productId)`: Check registration status

### Events
- `ProductRegistered`: Emitted when a product is registered
- `ProductSold`: Emitted when ownership is transferred

## 🔒 Security Considerations

- **Private Key Management**: Store private keys securely using environment variables
- **Input Validation**: All inputs are validated on both client and server side
- **Rate Limiting**: API endpoints implement rate limiting to prevent abuse
- **Access Control**: Smart contract includes proper access controls

## 🚀 Deployment

### Backend Deployment (Vercel/Heroku)
1. Set environment variables in your hosting platform
2. Deploy the backend service
3. Update frontend API endpoints

### Frontend Deployment (Vercel/Netlify)
1. Build the React application
2. Deploy static files
3. Configure environment variables

### Smart Contract Deployment
1. Deploy to Ethereum mainnet or preferred network
2. Update CONTRACT_ADDRESS in environment variables
3. Verify contract on Etherscan

## 📈 Future Enhancements

- **Mobile Application**: Native iOS/Android apps
- **QR Code Integration**: QR code scanning for easier verification
- **Multi-Chain Support**: Support for other blockchain networks
- **Analytics Dashboard**: Comprehensive analytics for manufacturers
- **Batch Registration**: Register multiple products simultaneously
- **API Rate Limiting**: Enhanced rate limiting and authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🙏 Acknowledgments

- Ethereum Foundation for blockchain infrastructure
- OpenZeppelin for smart contract security patterns
- React and Next.js communities for frontend frameworks
- All contributors and testers

---

**Note**: This system is designed for educational and demonstration purposes. For production use, ensure proper security audits and compliance with relevant regulations.
