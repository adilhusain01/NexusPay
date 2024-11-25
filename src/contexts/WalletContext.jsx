import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';

const WalletContext = createContext();

// Initialize provider outside component to avoid recreating it
const getProvider = () => {
  if (!window.ethereum) return null;
  return new ethers.providers.Web3Provider(window.ethereum);
};

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState('');
  const [signer, setSigner] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize wallet connection from localStorage
  useEffect(() => {
    const initializeWallet = async () => {
      const savedAccount = localStorage.getItem('walletAddress');
      if (savedAccount && !isInitialized) {
        try {
          const provider = getProvider();
          if (!provider) {
            console.error('MetaMask is not installed');
            return;
          }

          const accounts = await provider.listAccounts();
          if (accounts.length > 0 && accounts[0].toLowerCase() === savedAccount.toLowerCase()) {
            const signer = provider.getSigner();
            setSigner(signer);
            setAccount(savedAccount);
            setIsInitialized(true);
          } else {
            // Clear localStorage if saved account doesn't match current MetaMask account
            localStorage.removeItem('walletAddress');
            setAccount('');
            setSigner(null);
          }
        } catch (error) {
          console.error('Error initializing wallet:', error);
          localStorage.removeItem('walletAddress');
        }
      }
    };

    initializeWallet();
  }, [isInitialized]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      console.error('MetaMask is not installed');
      return null;
    }

    try {
      const provider = getProvider();
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const signer = provider.getSigner();
      const address = accounts[0];

      setSigner(signer);
      setAccount(address);
      localStorage.setItem('walletAddress', address);
      setIsInitialized(true);

      return signer;
    } catch (error) {
      console.error('Connection error:', error);
      // Clear state on error
      setAccount('');
      setSigner(null);
      localStorage.removeItem('walletAddress');
      return null;
    }
  };

  const handleAccountChange = async (accounts) => {
    try {
      if (accounts.length === 0) {
        console.log('No accounts found. Clearing wallet state.');
        setAccount('');
        setSigner(null);
        setIsOwner(false);
        localStorage.removeItem('walletAddress');
        setIsInitialized(false);
      } else {
        const newAccount = accounts[0];
        console.log('Account changed:', newAccount);
        
        const provider = getProvider();
        if (provider) {
          const signer = provider.getSigner();
          setSigner(signer);
          setAccount(newAccount);
          localStorage.setItem('walletAddress', newAccount);
          setIsInitialized(true);
        }
      }
    } catch (error) {
      console.error('Error handling account change:', error);
      // Reset state on error
      setAccount('');
      setSigner(null);
      setIsOwner(false);
      localStorage.removeItem('walletAddress');
      setIsInitialized(false);
    }
  };

  // Set up event listeners
  useEffect(() => {
    if (window.ethereum) {
      console.log('Setting up ethereum event listeners');
      
      window.ethereum.on('accountsChanged', handleAccountChange);
      window.ethereum.on('disconnect', () => {
        console.log('Wallet disconnected');
        setAccount('');
        setSigner(null);
        setIsOwner(false);
        localStorage.removeItem('walletAddress');
        setIsInitialized(false);
      });

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountChange);
        window.ethereum.removeListener('disconnect');
      };
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        account,
        signer,
        isOwner,
        isInitialized,
        setIsOwner,
        connectWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

WalletProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export default WalletContext;