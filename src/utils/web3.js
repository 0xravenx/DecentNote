import { ethers } from 'ethers';

let provider = null;
let signer = null;
let contract = null;

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '';
const CONTRACT_ABI = [
  "function createNote(string memory _ipfsHash, bool _isPrivate) public returns (uint256)",
  "function updateNote(uint256 _noteId, string memory _newIpfsHash) public",
  "function getNote(uint256 _noteId) public view returns (string memory, address, uint256, bool)",
  "function getUserNotes(address _user) public view returns (uint256[] memory)",
  "function noteCount() public view returns (uint256)",
  "event NoteCreated(uint256 indexed noteId, address indexed owner, string ipfsHash)",
  "event NoteUpdated(uint256 indexed noteId, string newIpfsHash)"
];

export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed!');
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    const address = await signer.getAddress();
    const network = await provider.getNetwork();

    if (CONTRACT_ADDRESS) {
      contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    }

    return { address, network: network.name };
  } catch (error) {
    console.error('Wallet connection failed:', error);
    throw error;
  }
};

export const disconnectWallet = () => {
  provider = null;
  signer = null;
  contract = null;
};

export const isWalletConnected = async () => {
  if (!window.ethereum) return false;

  const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  return accounts.length > 0;
};

export const getCurrentAccount = async () => {
  if (!signer) return null;
  return await signer.getAddress();
};

export const createNote = async (ipfsHash, isPrivate) => {
  if (!contract) {
    throw new Error('Contract not initialized. Please connect wallet first.');
  }

  try {
    const tx = await contract.createNote(ipfsHash, isPrivate);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Note creation failed:', error);
    throw error;
  }
};

export const getUserNotes = async (userAddress) => {
  if (!contract) {
    throw new Error('Contract not initialized. Please connect wallet first.');
  }

  try {
    const noteIds = await contract.getUserNotes(userAddress);
    const notes = [];

    for (const id of noteIds) {
      const noteData = await contract.getNote(id);
      notes.push({
        id: id.toNumber(),
        ipfsHash: noteData[0],
        owner: noteData[1],
        timestamp: noteData[2].toNumber(),
        isPrivate: noteData[3]
      });
    }

    return notes;
  } catch (error) {
    console.error('Failed to fetch user notes:', error);
    throw error;
  }
};