'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { toast } from 'sonner';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

interface TransferAptosResult {
  transactionData: {
    sender: string;
    recipient: string;
    amount: number;
    amountInOctas: number;
    network: string;
    currency: string;
  };
  message: string;
  amount: number;
  recipient: string;
  sender: string;
  network: string;
  currency: string;
  error?: string;
}

export const TransferAptos = ({
  RecievedResult,
}: {
  RecievedResult?: TransferAptosResult;
}) => {
  const [showRaw, setShowRaw] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { account, connected } = useWallet();

  if (!RecievedResult) return null;

  if (RecievedResult.error) {
    return (
      <div className="space-y-4 rounded-lg border border-red-700 bg-red-900/20 p-4 text-sm text-red-200 shadow-lg">
        <h3 className="text-lg font-semibold text-red-400">
          Transaction Error
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

  const { transactionData, message, amount, recipient, network, currency } = RecievedResult;

  const handleApprove = async () => {
    if (!connected || !account) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);

    try {
      // Initialize Aptos client
      const aptosConfig = new AptosConfig({ 
        network: network === 'Aptos Testnet' ? Network.TESTNET : Network.MAINNET 
      });
      const aptos = new Aptos(aptosConfig);

      // Create transaction
      const transaction = await aptos.transferCoinTransaction({
        sender: account.address.toString(),
        recipient: recipient,
        amount: transactionData.amountInOctas,
      });

      toast.info('Transaction prepared!', {
        description: 'Please use your wallet to sign and submit this transaction',
        duration: 5000,
      });

      // For now, just show the transaction data
      // In a real implementation, you would use the wallet's signAndSubmitTransaction method
      console.log('Transaction data:', transaction);
      
      toast.success('Transaction Data Generated!', {
        description: `Ready to send ${amount} ${currency} to ${recipient}`,
      });
    } catch (err: any) {
      console.error('Transaction error:', err);
      const shortMessage = err?.message || 'Transaction failed';
      const fullError = typeof err === 'object' ? JSON.stringify(err, null, 2) : String(err);

      toast.error(shortMessage, {
        action: {
          label: 'Copy Full Error',
          onClick: () => navigator.clipboard.writeText(fullError),
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-zinc-700 bg-zinc-900 p-4 text-sm text-zinc-200 shadow-lg">
      <div>
        <h3 className="text-lg font-semibold text-fuchsia-400">
          Transfer {currency} Transaction
        </h3>
        <p className="text-zinc-400">{message}</p>
        <p className="text-xs text-zinc-500">
          {network}
        </p>
      </div>

      <div>
        <h4 className="flex items-center justify-between font-semibold text-zinc-300">
          Transaction Data (Raw)
          <Button
            variant="ghost"
            className="px-2 py-0 text-xs"
            onClick={() => setShowRaw((prev) => !prev)}
          >
            {showRaw ? 'Hide' : 'Show'}
          </Button>
        </h4>
        {showRaw && (
          <pre className="overflow-x-auto rounded-md bg-zinc-800 p-2 text-xs break-words whitespace-pre-wrap text-yellow-300">
            {JSON.stringify(transactionData, null, 2)}
          </pre>
        )}
      </div>

      <div>
        <h4 className="font-semibold text-zinc-300">Summary</h4>
        <div className="space-y-1 text-zinc-400">
          <p>
            <span className="text-zinc-500">Amount:</span>{' '}
            <span className="font-medium text-white">
              {amount} {currency}
            </span>
          </p>
          <p>
            <span className="text-zinc-500">To:</span>{' '}
            <span className="font-mono text-xs break-words text-white">
              {recipient}
            </span>
          </p>
          <p>
            <span className="text-zinc-500">Network:</span>{' '}
            <span className="text-white">{network}</span>
          </p>
        </div>
      </div>

      <Button
        className="w-full bg-fuchsia-500 transition hover:bg-fuchsia-600 disabled:bg-zinc-600 disabled:text-zinc-400"
        onClick={handleApprove}
        disabled={!connected || isProcessing}
      >
        {!connected
          ? 'Connect Wallet'
          : isProcessing
            ? 'Processing...'
            : 'Approve Transaction'}
      </Button>
    </div>
  );
};
