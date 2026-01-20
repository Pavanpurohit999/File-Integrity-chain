# File Integrity Chain 🛡️

A decentralized application (DApp) for verifying the integrity and authenticity of digital documents using the Ethereum blockchain. This project ensures that files have not been tampered with by storing their cryptographic proofs on an immutable ledger.

![Project Status](https://img.shields.io/badge/Status-Active-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Key Features

-   **Immutable Records:** Once a file is registered, its record entails a permanent proof of existence and integrity.
-   **Privacy-First:** Your actual files **never** leave your device. Only a unique cryptographic hash ("digital fingerprint") is stored on the blockchain.
-   **Purpose-Based Identity:** Files are hashed with a specific "Purpose" (e.g., "Draft" vs "Final"). This allows the same file to be registered for multiple contexts independently.
-   **Public Verification:** A dedicated portal for third-party verifiers (auditors, employers) to check documents without needing a crypto wallet.
-   **Modern UI:** Built with a "Drizzle-inspired" dark mode aesthetic, featuring glassmorphism and smooth animations.

## 🛠️ Tech Stack

### Frontend
-   **Framework:** React 19.2.0 with Vite 7.2.4
-   **Language:** TypeScript 5.9.3
-   **Styling:** Tailwind CSS 4.1.18 with @tailwindcss/vite plugin
-   **Icons:** Lucide React 0.562.0
-   **Blockchain Interaction:** Ethers.js 6.16.0
-   **PDF Generation:** jsPDF 4.0.0
-   **QR Code:** qrcode.react 4.2.0

### Backend (Smart Contracts)
-   **Development Environment:** Hardhat 2.22.2
-   **Smart Contract Language:** Solidity (^0.8.20)
-   **Blockchain Library:** Ethers.js 6.14.0
-   **Testing:** Chai 4.2.0, Mocha
-   **Type Generation:** TypeChain 8.3.0

### Development Tools
-   **Build Tool:** Vite 7.2.4
-   **Linting:** ESLint 9.39.1 with TypeScript support
-   **Type Checking:** TypeScript ~5.9.3
-   **Process Management:** Concurrently 9.2.1
-   **Node Runtime:** ts-node 10.9.2

### Hardhat Plugins & Tools
-   **@nomicfoundation/hardhat-toolbox** 6.1.0 - Complete Hardhat setup
-   **@nomicfoundation/hardhat-ethers** 3.1.0 - Ethers.js integration
-   **@nomicfoundation/hardhat-chai-matchers** 2.1.0 - Testing matchers
-   **@nomicfoundation/hardhat-verify** 2.1.0 - Contract verification
-   **@nomicfoundation/hardhat-ignition** 0.15.13 - Deployment system
-   **hardhat-gas-reporter** 2.3.0 - Gas usage reporting
-   **solidity-coverage** 0.8.1 - Code coverage

## 📦 Complete Package List

### Root Project Dependencies
```json
{
  "dependencies": {
    "qrcode.react": "^4.2.0"
  },
  "devDependencies": {
    "@nomicfoundation/hardhat-chai-matchers": "2.1.0",
    "@nomicfoundation/hardhat-ethers": "3.1.0",
    "@nomicfoundation/hardhat-ignition": "0.15.13",
    "@nomicfoundation/hardhat-ignition-ethers": "0.15.14",
    "@nomicfoundation/hardhat-network-helpers": "1.1.0",
    "@nomicfoundation/hardhat-toolbox": "^6.1.0",
    "@nomicfoundation/hardhat-verify": "2.1.0",
    "@nomicfoundation/ignition-core": "0.15.13",
    "@typechain/ethers-v6": "0.5.0",
    "@typechain/hardhat": "9.0.0",
    "@types/chai": "4.2.0",
    "@types/minimatch": "^6.0.0",
    "@types/mocha": "^10.0.10",
    "chai": "4.2.0",
    "concurrently": "^9.2.1",
    "ethers": "6.14.0",
    "hardhat": "2.22.2",
    "hardhat-gas-reporter": "2.3.0",
    "minimatch": "^10.1.1",
    "solidity-coverage": "0.8.1",
    "ts-node": "^10.9.2",
    "typechain": "8.3.0",
    "typescript": "^5.9.3"
  }
}
```

### Frontend Dependencies
```json
{
  "dependencies": {
    "@tailwindcss/vite": "^4.1.18",
    "ethers": "^6.16.0",
    "jspdf": "^4.0.0",
    "lucide-react": "^0.562.0",
    "qrcode.react": "^4.2.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "tailwindcss": "^4.1.18"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.46.4",
    "vite": "^7.2.4"
  }
}
```

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or higher)
-   [MetaMask](https://metamask.io/) browser extension

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/file-integrity-chain.git
cd file-integrity-chain
```

### 2. Backend Setup (Blockchain)

Start a local Ethereum node and deploy the smart contract.

```bash
# Install dependencies
npm install

# Start local Hardhat node (Keep this terminal open!)
npx hardhat node
```

Open a **new terminal** to deploy the contract:

```bash
# Deploy contract to the local network (localhost)
npx hardhat ignition deploy ./ignition/modules/Lock.ts --network localhost
```

> **Note:** Copy the `Deployed to` address from the output. You may need to update it in `frontend/src/contract.ts` if it changes (usually it's deterministic and stays the same).

### 3. Frontend Setup

Connect the web interface to your local blockchain.

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will run at `http://localhost:5173`.

### 4. Configure MetaMask

1.  Open MetaMask and add a custom network:
    -   **Network Name:** Localhost 8545
    -   **RPC URL:** `http://127.0.0.1:8545`
    -   **Chain ID:** `31337`
    -   **Currency Symbol:** ETH
2.  Import a test account:
    -   Copy a "Private Key" from the `npx hardhat node` terminal output (Account #0 or #1).
    -   In MetaMask, go to **Accounts -> Import Account** and paste the private key.

## 📖 Usage Guide

### Registering a File (Issuer)
1.  Go to the **Register** tab.
2.  Connect your MetaMask wallet.
3.  Select a file and enter a **Purpose** (e.g., "Semester Project Final").
4.  Click **Register**. Confirm the transaction in MetaMask.
5.  *Result:* The file's hash + purpose is permanently stored on-chain.

### Verifying a File (Holder)
1.  Go to the **Verify** tab.
2.  Select the file you possess.
3.  Enter the **Purpose** it was registered with.
4.  Click **Verify Integrity**.
5.  *Result:* The app checks if the file matches the blockchain record.
    -   ✅ **Valid:** File is authentic and unaltered.
    -   ❌ **Invalid:** File has been modified or purpose is incorrect.
    -   ⏱ **Expired:** The verification period (if set) has passed.

### Public Verification (Third Party)
1.  Go to the **Public** tab.
2.  Upload the document and enter the purpose.
3.  Click **Verify**.
4.  *Result:* Instant verification without needing a wallet connection.

## 📂 Project Structure

```
file-integrity-chain/
├── contracts/          # Solidity smart contracts
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # UI Components
│   │   ├── contract.ts # Contract address & ABI
│   │   ├── hashFile.ts # Hashing logic (SHA-256)
│   │   └── App.tsx     # Main application logic
├── ignition/           # Hardhat deployment modules
└── test/               # Smart contract tests
```

## 📄 License

This project is licensed under the MIT License.