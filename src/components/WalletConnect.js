import React, { useState, useEffect } from 'react';
import { connectWallet, disconnectWallet, isWalletConnected, getCurrentAccount } from '../utils/web3';
import './WalletConnect.css';

const WalletConnect = ({ onWalletChange }) => {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      const connected = await isWalletConnected();
      if (connected) {
        const address = await getCurrentAccount();
        setAccount(address);
        onWalletChange?.(address);
      }
    } catch (error) {
      console.error('Failed to check connection:', error);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
      setNetwork(null);
      onWalletChange?.(null);
    } else {
      setAccount(accounts[0]);
      onWalletChange?.(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const { address, network: connectedNetwork } = await connectWallet();
      setAccount(address);
      setNetwork(connectedNetwork);
      onWalletChange?.(address);
    } catch (error) {
      console.error('Connection failed:', error);
      alert(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setAccount(null);
    setNetwork(null);
    onWalletChange?.(null);
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!window.ethereum) {
    return (
      <div className="wallet-connect">
        <div className="metamask-missing">
          <p>MetaMask not detected</p>
          <a
            href="https://metamask.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="install-link"
          >
            Install MetaMask
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      {!account ? (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="connect-btn"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="wallet-info">
          <div className="account-info">
            <span className="address">{formatAddress(account)}</span>
            {network && <span className="network">{network}</span>}
          </div>
          <button onClick={handleDisconnect} className="disconnect-btn">
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;