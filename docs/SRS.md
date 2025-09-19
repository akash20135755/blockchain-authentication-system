# System Requirements Specification (SRS)
## Blockchain-Based Product Authentication System

### 1. Introduction

#### 1.1 Purpose
This document specifies the requirements for a blockchain-based product authentication system designed to prevent counterfeit products, specifically focusing on mobile phones. The system enables manufacturers to register genuine products on a blockchain and allows customers to verify product authenticity.

#### 1.2 Scope
The system consists of three main components:
- Smart contract deployed on Ethereum blockchain for immutable product registration
- Backend API service for blockchain interaction
- Frontend web application for user interfaces

#### 1.3 Definitions and Acronyms
- **IMEI**: International Mobile Equipment Identity
- **DApp**: Decentralized Application
- **API**: Application Programming Interface
- **SRS**: System Requirements Specification

### 2. Overall Description

#### 2.1 Product Perspective
The system operates as a decentralized solution where:
- Manufacturers register products during production
- Product data is stored immutably on blockchain
- Customers verify authenticity through web interface
- No central authority controls the verification process

#### 2.2 Product Functions
- Product registration by manufacturers
- Product authenticity verification by customers
- Ownership transfer tracking
- Blockchain transaction logging

#### 2.3 User Classes
- **Manufacturers**: Register new products, manage product inventory
- **Customers**: Verify product authenticity
- **System Administrators**: Monitor system health and performance

### 3. Functional Requirements

#### 3.1 Product Registration (FR-001)
**Description**: Manufacturers must be able to register new products on the blockchain.

**Input**: Product ID (IMEI/Serial Number)
**Processing**: 
- Validate product ID format
- Check for duplicate registrations
- Create blockchain transaction
- Store product data immutably

**Output**: Transaction confirmation with hash and block number

#### 3.2 Product Verification (FR-002)
**Description**: Customers must be able to verify product authenticity.

**Input**: Product ID
**Processing**:
- Query blockchain for product data
- Validate registration status
- Format response data

**Output**: Product authenticity status with registration details

#### 3.3 Ownership Transfer (FR-003)
**Description**: Product ownership must be transferable between parties.

**Input**: Product ID, new owner address
**Processing**:
- Verify current ownership
- Update ownership records
- Log transfer transaction

**Output**: Transfer confirmation

#### 3.4 Data Integrity (FR-004)
**Description**: All product data must be tamper-proof and immutable.

**Processing**:
- Store data on blockchain
- Use cryptographic hashing
- Implement access controls

### 4. Non-Functional Requirements

#### 4.1 Performance Requirements (NFR-001)
- API response time: < 3 seconds for verification requests
- Blockchain transaction confirmation: < 30 seconds
- System availability: 99.9% uptime

#### 4.2 Security Requirements (NFR-002)
- All blockchain transactions must be cryptographically signed
- API endpoints must implement rate limiting
- Private keys must be securely stored
- Input validation on all user inputs

#### 4.3 Scalability Requirements (NFR-003)
- Support for 10,000+ product registrations per day
- Handle 1,000+ concurrent verification requests
- Horizontal scaling capability for backend services

#### 4.4 Usability Requirements (NFR-004)
- Intuitive web interface for non-technical users
- Mobile-responsive design
- Clear error messages and feedback
- Multi-language support capability

#### 4.5 Reliability Requirements (NFR-005)
- Automatic retry mechanisms for failed transactions
- Graceful error handling
- Data backup and recovery procedures
- Monitoring and alerting systems

### 5. System Architecture

#### 5.1 Blockchain Layer
- Ethereum-compatible smart contract
- Solidity programming language
- Gas-optimized operations
- Event logging for transparency

#### 5.2 Backend Layer
- Node.js with Express framework
- ethers.js for blockchain interaction
- RESTful API design
- Environment-based configuration

#### 5.3 Frontend Layer
- React-based web application
- Responsive design with Tailwind CSS
- Real-time status updates
- Progressive web app capabilities

### 6. Data Requirements

#### 6.1 Product Data Structure
\`\`\`
Product {
  productId: string (unique identifier)
  manufacturer: address (Ethereum address)
  timestamp: uint256 (registration time)
  isRegistered: boolean (registration status)
  isSold: boolean (sale status)
  currentOwner: address (current owner)
}
\`\`\`

#### 6.2 Data Validation Rules
- Product ID must be non-empty string
- Ethereum addresses must be valid format
- Timestamps must be valid Unix timestamps
- Boolean flags must be explicitly set

### 7. Interface Requirements

#### 7.1 User Interfaces
- Customer verification portal
- Manufacturer registration dashboard
- System administration panel

#### 7.2 API Interfaces
- POST /api/register - Product registration
- GET /api/verify/:productId - Product verification
- POST /api/sell - Ownership transfer
- GET /api/health - System health check

#### 7.3 Blockchain Interfaces
- registerProduct() function
- verifyProduct() function
- sellProduct() function
- Event emissions for transparency

### 8. Constraints

#### 8.1 Technical Constraints
- Ethereum blockchain dependency
- Gas costs for transactions
- Network latency considerations
- Browser compatibility requirements

#### 8.2 Business Constraints
- Manufacturer onboarding process
- Legal compliance requirements
- Cost considerations for blockchain operations
- Integration with existing systems

### 9. Assumptions and Dependencies

#### 9.1 Assumptions
- Manufacturers will adopt the system voluntarily
- Customers have basic internet access
- Ethereum network remains stable and accessible
- Product IDs are unique across manufacturers

#### 9.2 Dependencies
- Ethereum blockchain network
- Web3 infrastructure providers
- Third-party libraries and frameworks
- Cloud hosting services
