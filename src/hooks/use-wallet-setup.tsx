'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useWalletStore } from '@/src/store/wallet-store';

interface WalletData {
  address: string;
  publicKey: string;
}

export function useWalletSetup() {
  const { data: session, status } = useSession();
  const setWalletData = useWalletStore((state) => state.setWalletData);
  const [showWalletPopup, setShowWalletPopup] = useState(false);
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  // Check if user has a wallet when session is available
  useEffect(() => {
    const checkWalletStatus = async () => {
      if (status === 'loading' || !session?.user?.id) {
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('/api/wallet/create');
        const data = await response.json();

        if (response.ok) {
          const userHasWallet = !!data.wallet;
          setHasWallet(userHasWallet);
          
          // Update wallet store if user has a wallet
          if (data.wallet) {
            setWalletData({
              address: data.wallet.address,
              chainId: 1, // Aptos mainnet
              chainName: 'Aptos',
              publicKey: data.wallet.publicKey,
            });
          }
          
          // Show popup if user doesn't have a wallet and hasn't dismissed it before
          // Use a more reliable key that includes user ID to prevent cross-user issues
          const dismissKey = `wallet-setup-dismissed-${session.user.id}`;
          if (!userHasWallet && !localStorage.getItem(dismissKey)) {
            setShowWalletPopup(true);
          }
        }
      } catch (error) {
        console.error('Error checking wallet status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkWalletStatus();
  }, [session, status, setWalletData]);

  const handleWalletCreated = (wallet: WalletData) => {
    setHasWallet(true);
    setShowWalletPopup(false);
    setIsCreatingWallet(false);
    
    // Update wallet store with new wallet data
    setWalletData({
      address: wallet.address,
      chainId: 1, // Aptos mainnet
      chainName: 'Aptos',
      publicKey: wallet.publicKey,
    });
    
    // Mark as dismissed so popup doesn't show again for this user
    if (session?.user?.id) {
      const dismissKey = `wallet-setup-dismissed-${session.user.id}`;
      localStorage.setItem(dismissKey, 'true');
    }
  };

  const handleClosePopup = () => {
    setShowWalletPopup(false);
    // Mark as dismissed so popup doesn't show again for this user
    if (session?.user?.id) {
      const dismissKey = `wallet-setup-dismissed-${session.user.id}`;
      localStorage.setItem(dismissKey, 'true');
    }
  };

  const resetWalletSetup = () => {
    if (session?.user?.id) {
      const dismissKey = `wallet-setup-dismissed-${session.user.id}`;
      localStorage.removeItem(dismissKey);
    }
    setHasWallet(null);
    setShowWalletPopup(false);
    setIsCreatingWallet(false);
  };

  return {
    showWalletPopup,
    hasWallet,
    isLoading,
    isCreatingWallet,
    handleWalletCreated,
    handleClosePopup,
    resetWalletSetup,
  };
}
