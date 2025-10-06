import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet } from 'lucide-react';
import { formatAddress } from '../../utils/wallet';

interface NavbarProps {
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  walletConnected: boolean;
  walletAddress?: string | null;
  isConnecting?: boolean;
  error?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onConnectWallet, 
  onDisconnectWallet,
  walletConnected, 
  walletAddress,
  isConnecting,
  error 
}) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                PropChain
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/listings"
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive('/listings') 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Listings
            </Link>
            <Link
              to="/favorites"
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive('/favorites') 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Favorites
            </Link>
            <Link
              to="/dashboard"
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive('/dashboard') 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Dashboard
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {walletConnected ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium">
                    {walletAddress ? formatAddress(walletAddress) : 'Connected'}
                  </span>
                </div>
                <button
                  onClick={onDisconnectWallet}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={onConnectWallet}
                disabled={isConnecting}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isConnecting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white hover:from-blue-700 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:block">
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </span>
              </button>
            )}
            {error && (
              <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};