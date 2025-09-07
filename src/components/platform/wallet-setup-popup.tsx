'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Loader2, Wallet, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WalletSetupPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletCreated: (wallet: { address: string; publicKey: string }) => void;
  isCreatingWallet?: boolean;
}

export function WalletSetupPopup({
  isOpen,
  onClose,
  onWalletCreated,
  isCreatingWallet = false,
}: WalletSetupPopupProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [createdWallet, setCreatedWallet] = useState<{
    address: string;
    publicKey: string;
  } | null>(null);

  const handleCreateWallet = async () => {
    // Prevent multiple creation attempts
    if (isCreating || isCreatingWallet) {
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/wallet/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create wallet');
      }

      setCreatedWallet({
        address: data.wallet.address,
        publicKey: data.wallet.publicKey,
      });
      
      onWalletCreated({
        address: data.wallet.address,
        publicKey: data.wallet.publicKey,
      });

      toast.success('Wallet created successfully!');
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast.error('Failed to create wallet. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setCreatedWallet(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            {createdWallet ? 'Wallet Created!' : 'Setup Your Wallet'}
          </DialogTitle>
          <DialogDescription>
            {createdWallet
              ? 'Your Aptos wallet has been successfully created and is ready to use.'
              : 'Create a secure Aptos wallet to interact with the blockchain. This will be your keyless account.'}
          </DialogDescription>
        </DialogHeader>

        {createdWallet ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Wallet Created Successfully</span>
            </div>
            
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Wallet Address:
                </label>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded break-all">
                  {createdWallet.address}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Public Key:
                </label>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded break-all">
                  {createdWallet.publicKey}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-4">
              <Wallet className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Your wallet will be created using Aptos keyless accounts for enhanced security.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          {createdWallet ? (
            <Button onClick={handleClose} className="w-full">
              Continue to Dashboard
            </Button>
          ) : (
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isCreating || isCreatingWallet}
              >
                No
              </Button>
              <Button
                onClick={handleCreateWallet}
                disabled={isCreating || isCreatingWallet}
                className="flex-1"
              >
                {(isCreating || isCreatingWallet) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Wallet'
                )}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
