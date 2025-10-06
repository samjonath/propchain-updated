import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { forceDisconnectFromMetaMask } from '../utils/wallet';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnecting: boolean;
  error: string | null;
  isDisconnected: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDisconnected, setIsDisconnected] = useState(false);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Connect wallet
  const connect = async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setError(null);
    setIsDisconnected(false); // Reset disconnect state

    try {
      // Always request accounts (this will show the popup)
      const accounts = await window.ethereum!.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (accounts.length > 0) {
        const account = accounts[0];
        setAddress(account);
        setIsConnected(true);

        // Get chain ID
        const chainId = await window.ethereum!.request({
          method: 'eth_chainId',
        }) as string;
        setChainId(parseInt(chainId, 16));

        // Store connection state in localStorage
        localStorage.setItem('walletConnected', 'true');
        localStorage.setItem('walletAddress', account);
        localStorage.setItem('chainId', chainId);
        localStorage.removeItem('walletDisconnected'); // Clear disconnect flag
      }
    } catch (err: unknown) {
      console.error('Failed to connect wallet:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnect = async () => {
    try {
      // Clear local state first
      setAddress(null);
      setIsConnected(false);
      setChainId(null);
      setError(null);
      setIsDisconnected(true); // Set disconnect state

      // Clear localStorage
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('chainId');
      localStorage.setItem('walletDisconnected', 'true'); // Set disconnect flag

      // Force disconnect from MetaMask using utility function
      const metaMaskDisconnected = await forceDisconnectFromMetaMask();
      
      if (metaMaskDisconnected) {
        console.log('Successfully disconnected from MetaMask');
      } else {
        console.log('MetaMask disconnect partially successful - local state cleared');
      }
    } catch (err: unknown) {
      console.error('Failed to disconnect wallet:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect wallet';
      setError(errorMessage);
    }
  };

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      // Check if user manually disconnected
      const wasDisconnected = localStorage.getItem('walletDisconnected') === 'true';
      if (wasDisconnected) {
        setIsDisconnected(true);
        return; // Don't auto-connect if user manually disconnected
      }

      if (isMetaMaskInstalled()) {
        try {
          const accounts = await window.ethereum!.request({
            method: 'eth_accounts',
          }) as string[];

          if (accounts.length > 0) {
            const account = accounts[0];
            setAddress(account);
            setIsConnected(true);

            const chainId = await window.ethereum!.request({
              method: 'eth_chainId',
            }) as string;
            setChainId(parseInt(chainId, 16));
          }
        } catch (err) {
          console.error('Failed to check wallet connection:', err);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      const handleAccountsChanged = (...args: unknown[]) => {
        const accounts = args[0] as string[];
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAddress(accounts[0]);
        }
      };

      const handleChainChanged = (...args: unknown[]) => {
        const chainId = args[0] as string;
        setChainId(parseInt(chainId, 16));
      };

      window.ethereum!.on('accountsChanged', handleAccountsChanged);
      window.ethereum!.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  const value: WalletContextType = {
    isConnected,
    address,
    chainId,
    connect,
    disconnect,
    isConnecting,
    error,
    isDisconnected,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}
