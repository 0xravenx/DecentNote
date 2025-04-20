# DecentNote

A decentralized note-taking application built on blockchain and IPFS.

## Features

- 🔗 Connect MetaMask wallet
- 📝 Create encrypted notes stored on IPFS
- 🔒 Private/public note visibility control
- ⛓️ Immutable storage on blockchain
- 🎨 Modern dark theme interface

## Tech Stack

- **Frontend**: React 18
- **Blockchain**: Ethereum + Solidity
- **Storage**: IPFS (InterPlanetary File System)
- **Wallet**: MetaMask integration
- **Development**: Hardhat framework

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/0xravenx/DecentNote.git
cd DecentNote
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your IPFS and contract details
```

4. Start the development server
```bash
npm start
```

## Environment Variables

Create a `.env` file with:

```
REACT_APP_IPFS_PROJECT_ID=your_infura_ipfs_project_id
REACT_APP_IPFS_SECRET=your_infura_ipfs_secret
REACT_APP_CONTRACT_ADDRESS=your_deployed_contract_address
```

## Smart Contract

The DecentNote smart contract handles:
- Note creation and storage references
- Access control (private/public notes)
- User note management
- Event emission for frontend updates

## How It Works

1. Connect your MetaMask wallet
2. Write your note in the editor
3. Choose private or public visibility
4. Note content is encrypted and uploaded to IPFS
5. IPFS hash is stored on blockchain with metadata
6. Your notes are permanently decentralized!

## License

MIT License