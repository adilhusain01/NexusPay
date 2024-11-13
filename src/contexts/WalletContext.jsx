import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState('');
  const [signer, setSigner] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const savedAccount = localStorage.getItem('walletAddress');
    if (savedAccount) {
      setAccount(savedAccount);
      connectWallet();
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      console.error('MetaMask is not installed');
      return null;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []); // Request account access if needed
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      setSigner(signer);
      setAccount(address);
      localStorage.setItem('walletAddress', address);

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountChange);

      return signer;
    } catch (error) {
      console.error('Connection error:', error);
      return null;
    }
  };

  const handleAccountChange = async (accounts) => {
    try {
      if (accounts.length === 0) {
        console.log('No accounts found. Clearing account and signer.');
        setAccount('');
        setSigner(null);
        localStorage.removeItem('walletAddress');
      } else {
        console.log('Account changed:', accounts[0]);
        setAccount(accounts[0]);
        localStorage.setItem('walletAddress', accounts[0]);
        await connectWallet();
      }
    } catch (error) {
      console.error('Error handling account change:', error);
    }
  };

  // Ensure the event listener is set up correctly
  useEffect(() => {
    if (window.ethereum) {
      console.log('Setting up accountsChanged listener');
      window.ethereum.on('accountsChanged', handleAccountChange);
    }

    return () => {
      if (window.ethereum) {
        console.log('Removing accountsChanged listener');
        window.ethereum.removeListener('accountsChanged', handleAccountChange);
      }
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{ account, signer, isOwner, setIsOwner, connectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
