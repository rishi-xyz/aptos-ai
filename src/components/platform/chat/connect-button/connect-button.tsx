'use client';
import { useEffect, useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useWalletStore } from '@/src/store/wallet-store';
import { Button } from '@/src/components/ui/button';
import { toast } from 'sonner';

export const ConnectButton = () => {
  const { account, connected, connect, disconnect } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const setWalletData = useWalletStore((state) => state.setWalletData);
  const disconnectWallet = useWalletStore((state) => state.disconnect);

  // Sync Aptos wallet state with Zustand store
  useEffect(() => {
    if (connected && account) {
      setWalletData({
        address: account.address.toString(),
        chainId: 1, // Aptos mainnet
        chainName: 'Aptos',
      });
      console.log('Wallet state updated:', { 
        address: account.address.toString(), 
        chainId: 1, 
        chainName: 'Aptos' 
      });
    } else {
      disconnectWallet();
      console.log('Wallet disconnected');
    }
  }, [connected, account, setWalletData, disconnectWallet]);

  const handleConnect = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    try {
      // Connect to the first available wallet
      await connect('Petra');
      toast.success('Wallet connected successfully!', {
        description: 'You can now interact with the Aptos blockchain',
      });
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet', {
        description: error?.message || 'Please try again or check if you have an Aptos wallet installed',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success('Wallet disconnected', {
        description: 'You have been disconnected from your wallet',
      });
    } catch (error: any) {
      console.error('Failed to disconnect wallet:', error);
      toast.error('Failed to disconnect wallet', {
        description: error?.message || 'Please try again',
      });
    }
  };

  if (connected && account) {
    const addressString = account.address.toString();
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-sm font-mono text-zinc-300">
            {addressString.slice(0, 6)}...{addressString.slice(-4)}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDisconnect}
          className="border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleConnect} 
      disabled={isConnecting}
      className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isConnecting ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          Connecting...
        </div>
      ) : (
        'Connect Wallet'
      )}
    </Button>
  );
};
