'use client';
import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { toast } from 'sonner';
import { Copy, Wallet, CheckCircle, ExternalLink, AlertTriangle } from 'lucide-react';

interface CreateTokenResult {
  transactionData?: {
    sender?: string;
    network: string;
    networkType: string;
    payload: {
      function: string;
      type_arguments: string[];
      arguments: string[];
    };
    tokenName: string;
    symbol: string;
    decimals: number;
    initialSupply: number;
    timestamp?: string;
    isKeylessWallet?: boolean;
  };
  tokenMetadata?: {
    name: string;
    symbol: string;
    decimals: number;
    initialSupply: number;
    totalSupply: string;
    network: string;
    standard: string;
    transferable: boolean;
  };
  message?: string;
  success?: boolean;
  error?: string;
  details?: string;
}

export const CreateAptosToken = ({ RecievedResult }: { RecievedResult?: CreateTokenResult }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<'pending' | 'success' | 'failed' | null>(null);
  const { account, connected, signAndSubmitTransaction } = useWallet();

  if (!RecievedResult) return null;

  if (RecievedResult.error) {
    return (
      <div className="p-4 rounded-lg border border-red-700 bg-red-950/50">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <h3 className="text-lg font-semibold text-red-400">Token Creation Error</h3>
        </div>
        <p className="text-red-300">{RecievedResult.error}</p>
        {RecievedResult.details && (
          <pre className="mt-2 bg-red-900/30 p-2 rounded text-xs">{RecievedResult.details}</pre>
        )}
      </div>
    );
  }

  const { transactionData, tokenMetadata, message } = RecievedResult;

  const handleApprove = async () => {
    if (!transactionData) {
      toast.error('Missing transaction data');
      return;
    }

    if (!transactionData.payload) {
      toast.error('Transaction payload is missing');
      console.log('Transaction data:', transactionData);
      return;
    }

    if (!connected || !account) {
      toast.error('Please connect your wallet first');
      console.log('Wallet not connected:', { connected, account });
      return;
    }

    setIsProcessing(true);
    setTransactionStatus('pending');

    try {
      // Prepare the transaction for signing
      const transaction = {
        data: {
          function: transactionData.payload.function,
          typeArguments: transactionData.payload.type_arguments,
          functionArguments: transactionData.payload.arguments,
        },
      };

      console.log('Creating token transaction:', transaction);
      console.log('Wallet connected:', connected);
      console.log('Account:', account);

      toast.info('Please approve the token creation transaction in your wallet...', {
        duration: 8000,
      });

      // Sign and submit the transaction
      const response = await signAndSubmitTransaction(transaction as any);

      if (response?.hash) {
        setTransactionHash(response.hash);
        setTransactionStatus('success');
        toast.success('Token creation submitted!', {
          description: `Txn Hash: ${response.hash.slice(0, 8)}...`,
          action: {
            label: 'View on Explorer',
            onClick: () => window.open(`https://explorer.aptoslabs.com/txn/${response.hash}?network=testnet`, '_blank'),
          },
        });
      } else {
        throw new Error('No transaction hash returned');
      }
    } catch (err: any) {
      console.error(err);
      setTransactionStatus('failed');
      toast.error('Transaction failed', { description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-zinc-700 bg-zinc-900/50 p-4 text-sm text-zinc-200 shadow-xl">
      <h3 className="text-lg font-semibold text-fuchsia-400 flex items-center gap-2">
        <Wallet className="h-5 w-5" /> Token Creation Demo
        {transactionStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-400" />}
      </h3>
      
      <p className="text-zinc-300">{message}</p>

      {/* Token Metadata Card */}
      {tokenMetadata && (
        <div className="rounded-lg border border-zinc-600 bg-zinc-800/50 p-3 space-y-2">
          <h4 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
            <Copy className="h-4 w-4" /> Token Details
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-zinc-500">Name:</span>
              <p className="font-medium text-zinc-200">{tokenMetadata.name}</p>
            </div>
            <div>
              <span className="text-zinc-500">Symbol:</span>
              <p className="font-medium text-zinc-200">{tokenMetadata.symbol}</p>
            </div>
            <div>
              <span className="text-zinc-500">Decimals:</span>
              <p className="font-medium text-zinc-200">{tokenMetadata.decimals}</p>
            </div>
            <div>
              <span className="text-zinc-500">Initial Supply:</span>
              <p className="font-medium text-zinc-200">{tokenMetadata.initialSupply.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-zinc-500">Network:</span>
              <p className="font-medium text-zinc-200">{tokenMetadata.network}</p>
            </div>
            <div>
              <span className="text-zinc-500">Standard:</span>
              <p className="font-medium text-zinc-200">{tokenMetadata.standard}</p>
            </div>
          </div>
          <div className="pt-2 border-t border-zinc-600">
            <span className="text-zinc-500 text-xs">Total Supply:</span>
            <p className="font-semibold text-green-400">{tokenMetadata.totalSupply}</p>
          </div>
        </div>
      )}

      <Button
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
        onClick={handleApprove}
        disabled={isProcessing || transactionStatus === 'success'}
      >
        {isProcessing ? 'Processing...' : transactionStatus === 'success' ? 'Demo Completed!' : 'Sign Demo Transaction'}
      </Button>

      {transactionHash && (
        <div className="mt-2 text-xs bg-zinc-800/50 p-2 rounded border border-zinc-600">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Transaction Hash:</span>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-blue-400 hover:text-blue-300"
              onClick={() => window.open(`https://explorer.aptoslabs.com/txn/${transactionHash}?network=testnet`, '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" /> View on Explorer
            </Button>
          </div>
          <code className="text-zinc-300 break-all">{transactionHash}</code>
        </div>
      )}
    </div>
  );
};

