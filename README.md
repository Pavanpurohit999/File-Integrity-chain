# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

File Integrity Chain - Presentation Script
Speaker: [Your Name] Duration: ~5-7 Minutes

1. Introduction (The Hook)
"Good morning/afternoon everyone. Today I am presenting File Integrity Chain, a decentralized application designed to solve a critical problem in the digital age: Trust.

In a world where documents/images can be easily forged or AI-generated, how do you prove that a file you possess is the original, unaltered version issued by a specific authority? My project uses Blockchain technology to create an immutable, tamper-proof record of any file's existence and integrity without the file ever leaving your device."

2. Tech Stack & Justifications
"Before I show you the demo, I want to explain the technology that powers this system."

Frontend: "I built the interface using React with Vite. I chose Vite because it's extremely fast and lightweight compared to older bundlers like Create-React-App. For styling, I used Tailwind CSS to create a modern, responsive 'Drizzle-like' aesthetic that looks professional and clean."
Blockchain Interaction: "I used Ethers.js. It's the industry-standard library for connecting a web frontend to the Ethereum blockchain. It handles the wallet connection (MetaMask) and effectively 'talks' to our smart contract."
Smart Contract Development: "For the backend, I used Hardhat.
Why Hardhat? It is currently the most robust development environment for Ethereum. It allows me to compile contracts, run a local blockchain node for testing (which we are using right now), and provides detailed debugging specifically for Solidity. It’s essentially the 'VS Code' of smart contract development."
3. Project Walkthrough (The Demo)
"The application has three distinct modes, designed for different users."

A. Register (The Issuer)
"First is the Register tab. Imagine I am a university issuing a degree or a company signing a contract."

"I select the file locally."
"I enter a Purpose (e.g., 'Semester 8 Marksheet')."
"The system generates a SHA-256 hash of the file combined with this purpose. This is my 'Digital Fingerprint'."
"I sign a transaction using my crypto wallet (MetaMask). This stores the hash, the purpose, and my identity (wallet address) permanently on the blockchain."
Note: "The actual file never leaves my computer. Only the digital fingerprint is stored, ensuring total privacy."
B. Verify (The Holder/Recipient)
"Next is the Verify tab. This is for someone who has the file and wants to check if it's the original."

"I upload the file I received."
"I enter the claimed purpose."
"The system re-calculates the fingerprint and queries the blockchain."
"If the file is modified by even one byte, the fingerprint changes completely, and the blockchain will say 'Invalid'. If it matches, it confirms: 'Yes, this file was issued by [Address] for [Purpose] at [Time]'."
C. Public (The Third Party)
"Finally, the Public tab. This is a unique feature. Unlike the other tabs, this does not require the user to have a crypto wallet. It allows anyone—like a potential employer or auditor—to verify a document simply by uploading it. It acts as a read-only interface to the blockchain, lowering the barrier to entry for general users."

4. Key Questions & Unique Selling Points (Q&A)
Q: "How is this different from Google Drive or a standard database?" "In a standard database, the admin (Google or the Company) can change records. If they get hacked, your data is compromised. In File Integrity Chain, the record is on the blockchain. Once registered, it is immutable. No one—not even I, the developer—can change the history of that file."

Q: "What makes your project unique?" "Two main things:

Purpose-Based Identity: Most systems just hash the file. My system includes the 'Context' or 'Purpose' in the cryptographic identity. This means I can issue the same PDF for two different reasons (e.g., 'Draft Review' vs 'Final Approval'), and they verify independently. It adds a layer of semantic meaning to the file verification.
Privacy-First Architecture: Many 'blockchain storage' apps upload the file to IPFS. We do not. We strictly store the proof, not the data. This makes it compliant with strict privacy laws like GDPR, as user data is never exposed publicly."
5. Conclusion
"In summary, File Integrity Chain brings the security of the blockchain to everyday file management, wrapped in a user-friendly, privacy-focused interface. Thank you."