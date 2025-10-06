import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar';
import { HomePage } from './pages/HomePage';
import { ListingsPage } from './pages/ListingsPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { DashboardPage } from './pages/DashboardPage';
import { WalletProvider, useWallet } from './contexts/WalletContext';
import { MetaMaskInstallModal } from './components/Modals/MetaMaskInstallModal';
import { WalletSelectionModal } from './components/Modals/WalletSelectionModal';

const AppContent: React.FC = () => {
  const { isConnected, address, connect, disconnect, isConnecting, error } = useWallet();
  const [favorites, setFavorites] = useState(['1', '4']);
  const [showMetaMaskModal, setShowMetaMaskModal] = useState(false);
  const [showWalletSelectionModal, setShowWalletSelectionModal] = useState(false);
  const navigate = useNavigate();

  const handleConnectWallet = async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
      setShowMetaMaskModal(true);
      return;
    }

    // Show wallet selection modal
    setShowWalletSelectionModal(true);
  };

  const handleSelectMetaMask = async () => {
    try {
      setShowWalletSelectionModal(false);
      await connect();
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnect();
    } catch (err) {
      console.error('Failed to disconnect wallet:', err);
    }
  };

  const handleToggleFavorite = (propertyId: string) => {
    setFavorites(prev => 
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <>
      <Navbar 
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
        walletConnected={isConnected}
        walletAddress={address}
        isConnecting={isConnecting}
        error={error}
      />
      
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          } 
        />
        <Route 
          path="/listings" 
          element={
            <ListingsPage 
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          } 
        />
        <Route 
          path="/property/:id" 
          element={<PropertyDetailPage onToggleFavorite={handleToggleFavorite} />} 
        />
        <Route 
          path="/favorites" 
          element={
            <FavoritesPage 
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <DashboardPage 
              walletConnected={isConnected}
              walletAddress={address}
              onConnectWallet={handleConnectWallet}
              onDisconnectWallet={handleDisconnectWallet}
              isConnecting={isConnecting}
              error={error}
            />
          } 
        />
      </Routes>

      <MetaMaskInstallModal 
        isOpen={showMetaMaskModal}
        onClose={() => setShowMetaMaskModal(false)}
      />

      <WalletSelectionModal 
        isOpen={showWalletSelectionModal}
        onClose={() => setShowWalletSelectionModal(false)}
        onSelectMetaMask={handleSelectMetaMask}
        isConnecting={isConnecting}
      />
    </>
  );
};

function App() {
  return (
    <WalletProvider>
      <Router>
        <AppContent />
      </Router>
    </WalletProvider>
  );
}

export default App;