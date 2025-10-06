import React from 'react';
import { X, ExternalLink, Download } from 'lucide-react';

interface MetaMaskInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MetaMaskInstallModal: React.FC<MetaMaskInstallModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;

  const handleInstallClick = () => {
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
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            MetaMask Required
          </h3>
          <p className="text-gray-600">
            To connect your wallet and access blockchain features, you need to install MetaMask.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">What is MetaMask?</h4>
            <p className="text-sm text-blue-800">
              MetaMask is a secure wallet that lets you interact with blockchain applications 
              and manage your digital assets.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleInstallClick}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Install MetaMask</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            
            <button
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg transition-colors"
            >
              Maybe Later
            </button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            After installing MetaMask, refresh this page and try connecting again.
          </div>
        </div>
      </div>
    </div>
  );
};
