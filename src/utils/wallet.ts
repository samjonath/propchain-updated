/**
 * Utility functions for wallet operations
 */

/**
 * Formats a wallet address to show first 6 and last 4 characters
 * @param address - The wallet address to format
 * @param startChars - Number of characters to show at the start (default: 6)
 * @param endChars - Number of characters to show at the end (default: 4)
 * @returns Formatted address string
 */
export const formatAddress = (
  address: string, 
  startChars: number = 6, 
  endChars: number = 4
): string => {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Checks if MetaMask is installed and available
 * @returns boolean indicating if MetaMask is available
 */
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

/**
 * Gets the current chain ID from MetaMask
 * @returns Promise that resolves to the chain ID
 */
export const getCurrentChainId = async (): Promise<number | null> => {
  if (!isMetaMaskInstalled()) return null;
  
  try {
    const chainId = await window.ethereum!.request({
      method: 'eth_chainId',
    }) as string;
    return parseInt(chainId, 16);
  } catch (error) {
    console.error('Failed to get chain ID:', error);
    return null;
  }
};

/**
 * Gets the current account from MetaMask
 * @returns Promise that resolves to the account address or null
 */
export const getCurrentAccount = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) return null;
  
  try {
    const accounts = await window.ethereum!.request({
      method: 'eth_accounts',
    }) as string[];
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Failed to get current account:', error);
    return null;
  }
};

/**
 * Validates if a string is a valid Ethereum address
 * @param address - The address to validate
 * @returns boolean indicating if the address is valid
 */
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Forces a complete disconnect from MetaMask
 * This function tries multiple methods to ensure a clean disconnect
 * @returns Promise that resolves when disconnect is complete
 */
export const forceDisconnectFromMetaMask = async (): Promise<boolean> => {
  if (!isMetaMaskInstalled()) {
    return true; // Already disconnected
  }

  try {
    try {
      await window.ethereum!.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }]
      });
      console.log('Successfully revoked MetaMask permissions');
      return true;
    } catch {
      console.log('wallet_revokePermissions not supported, trying alternative methods');
    }

    try {
      await window.ethereum!.request({
        method: 'wallet_requestPermissions',
        params: []
      });
      console.log('Successfully cleared MetaMask permissions');
      return true;
    } catch {
      console.log('wallet_requestPermissions with empty params not supported');
    }

    try {
      await window.ethereum!.request({
        method: 'eth_requestAccounts'
      });
      console.log('Forced fresh connection state');
      return true;
    } catch {
      console.log('eth_requestAccounts failed during disconnect');
    }

    if (window.ethereum && 'removeAllListeners' in window.ethereum) {
      (window.ethereum as any).removeAllListeners();
      console.log('Cleared MetaMask event listeners');
      return true;
    }

    console.log('All disconnect methods failed, but local state will be cleared');
    return false;
  } catch (error) {
    console.error('Error during MetaMask disconnect:', error);
    return false;
  }
};
