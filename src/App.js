import React, { useState, useCallback } from 'react';
import './App.css';
import WalletConnect from './components/WalletConnect';
import NoteEditor from './components/NoteEditor';
import { createNote } from './utils/web3';

function App() {
  const [account, setAccount] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleWalletChange = useCallback((newAccount) => {
    setAccount(newAccount);
  }, []);

  const handleNoteSave = useCallback(async (ipfsHash, isPrivate) => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    setIsSaving(true);
    try {
      const tx = await createNote(ipfsHash, isPrivate);
      console.log('Note saved to blockchain:', tx.hash);
      alert('Note saved successfully to the blockchain!');
    } catch (error) {
      console.error('Failed to save note:', error);
      alert('Failed to save note to blockchain. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [account]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>DecentNote</h1>
        <p>Decentralized Note Taking on IPFS & Blockchain</p>
        <WalletConnect onWalletChange={handleWalletChange} />
      </header>

      <main className="App-main">
        {account ? (
          <>
            <div className="connection-status">
              <span className="status-indicator connected"></span>
              Wallet connected - Ready to create decentralized notes
            </div>
            <NoteEditor onSave={handleNoteSave} disabled={isSaving} />
          </>
        ) : (
          <div className="connection-prompt">
            <h3>Connect Your Wallet to Start</h3>
            <p>Connect your MetaMask wallet to create and store notes on the blockchain</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;