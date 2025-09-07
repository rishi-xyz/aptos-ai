'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { toast } from 'sonner';

interface GetBalanceAptosResult {
  address: string;
  balance: string;
  currency: string;
  network: string;
  accountInfo: {
    sequenceNumber: string;
    authenticationKey: string;
  };
  error?: string;
}

export const GetBalanceAptos = ({
  RecievedResult,
}: {
  RecievedResult?: GetBalanceAptosResult;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { account, connected } = useWallet();

  if (!RecievedResult) return null;

  if (RecievedResult.error) {
    return (
      <div className="space-y-4 rounded-lg border border-red-700 bg-red-900/20 p-4 text-sm text-red-200 shadow-lg">
        <h3 className="text-lg font-semibold text-red-400">
          Balance Error
        </h3>
        <p className="text-red-300">{RecievedResult.error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigator.clipboard.writeText(RecievedResult.error!)}
        >
          Copy Full Error
        </Button>
      </div>
    );
  }

  const { address, balance, currency, network, accountInfo } = RecievedResult;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address).then(() => {
      toast.success('Address copied to clipboard');
    });
  };

  const handleCopyBalance = () => {
    navigator.clipboard.writeText(balance).then(() => {
      toast.success('Balance copied to clipboard');
    });
  };

  return (
    <div className="space-y-4 rounded-lg border border-zinc-700 bg-zinc-900 p-4 text-sm text-zinc-200 shadow-lg">
      <div>
        <h3 className="text-lg font-semibold text-fuchsia-400">
          {currency} Balance
        </h3>
        <p className="text-zinc-400">Current balance for the connected wallet</p>
        <p className="text-xs text-zinc-500">
          {network}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-md bg-zinc-800 p-3">
          <div>
            <p className="text-zinc-500 text-xs">Address</p>
            <p className="font-mono text-sm text-white break-words">
              {address}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyAddress}
            className="ml-2"
          >
            Copy
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-md bg-zinc-800 p-3">
          <div>
            <p className="text-zinc-500 text-xs">Balance</p>
            <p className="text-2xl font-bold text-white">
              {parseFloat(balance).toFixed(6)} {currency}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyBalance}
            className="ml-2"
          >
            Copy
          </Button>
        </div>
      </div>

      <div>
        <h4 className="flex items-center justify-between font-semibold text-zinc-300">
          Account Details
          <Button
            variant="ghost"
            className="px-2 py-0 text-xs"
            onClick={() => setShowDetails((prev) => !prev)}
          >
            {showDetails ? 'Hide' : 'Show'}
          </Button>
        </h4>
        {showDetails && (
          <div className="mt-2 space-y-2 rounded-md bg-zinc-800 p-3">
            <div>
              <p className="text-zinc-500 text-xs">Sequence Number</p>
              <p className="font-mono text-sm text-white">
                {accountInfo.sequenceNumber}
              </p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Authentication Key</p>
              <p className="font-mono text-xs text-white break-words">
                {accountInfo.authenticationKey}
              </p>
            </div>
          </div>
        )}
      </div>

      {connected && account && (
        <div className="rounded-md bg-green-900/20 border border-green-700 p-3">
          <p className="text-green-400 text-sm">
            ✓ Wallet connected and ready for transactions
          </p>
        </div>
      )}
    </div>
  );
};
