import React from 'react';
import { X, Wallet, ExternalLink } from 'lucide-react';

interface WalletSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMetaMask: () => void;
  isConnecting?: boolean;
}

export const WalletSelectionModal: React.FC<WalletSelectionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectMetaMask,
  isConnecting = false
}) => {
  if (!isOpen) return null;

  const handleMetaMaskClick = () => {
    onSelectMetaMask();
  };

  const handleInstallMetaMask = () => {
    window.open('https://metamask.io/download/', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Connect Your Wallet
          </h3>
          <p className="text-gray-600">
            Choose a wallet to connect to PropChain and access blockchain features.
          </p>
        </div>

        <div className="space-y-3">
          {/* MetaMask Option */}
          <button
            onClick={handleMetaMaskClick}
            disabled={isConnecting}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
              isConnecting
                ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">MetaMask</div>
                <div className="text-sm text-gray-600">
                  {isConnecting ? 'Connecting...' : 'Connect using MetaMask wallet'}
                </div>
              </div>
              {isConnecting ? (
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ExternalLink className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </button>

          {/* Install MetaMask Option */}
          <button
            onClick={handleInstallMetaMask}
            className="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">Install MetaMask</div>
                <div className="text-sm text-gray-600">
                  Don't have MetaMask? Install it first
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500 text-center">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
};
