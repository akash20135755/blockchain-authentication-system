# UML Sequence Diagram - Product Registration Flow

\`\`\`mermaid
sequenceDiagram
    participant M as Manufacturer
    participant UI as Manufacturer UI
    participant API as Backend API
    participant BC as Blockchain
    participant SC as Smart Contract

    M->>UI: Enter Product ID
    UI->>UI: Validate Input
    
    alt Invalid Input
        UI->>M: Show Error Message
    else Valid Input
        UI->>API: POST /api/register
        Note over UI,API: { productId: "IMEI-123456789" }
        
        API->>API: Validate Request
        API->>BC: Check if product exists
        BC->>SC: Call isProductRegistered()
        SC->>BC: Return boolean
        BC->>API: Registration status
        
        alt Product Already Exists
            API->>UI: 409 Conflict Error
            UI->>M: Show "Already Registered"
        else Product Not Registered
            API->>BC: Create Transaction
            BC->>SC: Call registerProduct()
            
            SC->>SC: Validate Product ID
            SC->>SC: Create Product Struct
            SC->>SC: Store in Mapping
            SC->>SC: Add to Array
            SC->>BC: Emit ProductRegistered Event
            
            BC->>API: Transaction Receipt
            Note over BC,API: { hash, blockNumber, gasUsed }
            
            API->>UI: 201 Success Response
            Note over API,UI: { success: true, data: {...} }
            
            UI->>M: Show Success Message
            UI->>M: Display Transaction Details
        end
    end
\`\`\`

## Alternative Flow - Registration Failure

\`\`\`mermaid
sequenceDiagram
    participant M as Manufacturer
    participant UI as Manufacturer UI
    participant API as Backend API
    participant BC as Blockchain

    M->>UI: Enter Product ID
    UI->>API: POST /api/register
    API->>BC: Create Transaction
    
    alt Network Error
        BC-->>API: Connection Timeout
        API->>UI: 500 Network Error
        UI->>M: Show "Network Error"
    else Insufficient Gas
        BC-->>API: Gas Limit Exceeded
        API->>UI: 400 Transaction Failed
        UI->>M: Show "Transaction Failed"
    else Invalid Contract
        BC-->>API: Contract Not Found
        API->>UI: 500 Contract Error
        UI->>M: Show "System Error"
    end
