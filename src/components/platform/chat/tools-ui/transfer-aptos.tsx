'use client';
import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { toast } from 'sonner';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { AlertTriangle, CheckCircle, Copy, ExternalLink, Wallet } from 'lucide-react';

interface TransferAptosResult {
  transactionData: {
    recipient: string;
    amount: number;
    amountInOctas: number;
    network: string;
    currency: string;
    payload?: {
      function: string;
      type_arguments: string[];
      arguments: string[];
    };
    estimatedGasFee?: number;
    timestamp?: string;
  };
  message: string;
  amount: number;
  recipient: string;
  network: string;
  currency: string;
  success?: boolean;
  error?: string;
  details?: string;
}

export const TransferAptos = ({
  RecievedResult,
}: {
  RecievedResult?: TransferAptosResult;
}) => {
  const [showRaw, setShowRaw] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<'pending' | 'success' | 'failed' | null>(null);
  
  const { account, connected, signAndSubmitTransaction } = useWallet();

  if (!RecievedResult) return null;

  // Error state
  if (RecievedResult.error) {
    return (
      <div className="space-y-4 rounded-lg border border-red-700 bg-red-950/50 p-4 text-sm shadow-lg">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <h3 className="text-lg font-semibold text-red-400">Transaction Error</h3>
        </div>
        
        <p className="text-red-300">{RecievedResult.error}</p>
        
        {RecievedResult.details && (
          <details className="text-red-200">
            <summary className="cursor-pointer text-red-400 hover:text-red-300">
              Show Error Details
            </summary>
            <pre className="mt-2 overflow-x-auto rounded bg-red-900/30 p-2 text-xs">
              {RecievedResult.details}
            </pre>
          </details>
        )}
        
        <Button
          variant="outline"
          size="sm"
          className="border-red-600 text-red-300 hover:bg-red-900/30"
          onClick={() => navigator.clipboard.writeText(RecievedResult.error + (RecievedResult.details ? '\n\n' + RecievedResult.details : ''))}
        >
          <Copy className="mr-1 h-3 w-3" />
          Copy Error Details
        </Button>
      </div>
    );
  }

  const { transactionData, message, amount, recipient, network, currency } = RecievedResult;
  const isTestnet = true; // Only testnet is supported now

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const openExplorer = (hash: string) => {
    const baseUrl = 'https://explorer.aptoslabs.com/txn';
    const url = `${baseUrl}/${hash}?network=testnet`;
    window.open(url, '_blank');
  };

  const handleApprove = async () => {
    if (!connected || !account) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!transactionData.payload) {
      toast.error('Transaction payload is missing');
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

      toast.info('Please approve the transaction in your wallet...', {
        duration: 8000,
      });

      // Sign and submit the transaction
      const response = await signAndSubmitTransaction(transaction as any);
      
      if (response?.hash) {
        setTransactionHash(response.hash);
        setTransactionStatus('success');
        
        toast.success('Transaction submitted successfully!', {
          description: `Transaction Hash: ${response.hash.slice(0, 10)}...`,
          duration: 8000,
          action: {
            label: 'View on Explorer',
            onClick: () => openExplorer(response.hash),
          },
        });

        // Initialize Aptos client to check transaction status
        const aptosConfig = new AptosConfig({ 
          network: Network.TESTNET 
        });
        const aptos = new Aptos(aptosConfig);

        // Wait for transaction confirmation
        try {
          const txnResult = await aptos.waitForTransaction({ 
            transactionHash: response.hash,
            options: { timeoutSecs: 30 }
          });
          
          if (txnResult.success) {
            toast.success('Transaction confirmed on blockchain!', {
              description: `Successfully sent ${amount} ${currency} to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
              duration: 10000,
            });
          } else {
            setTransactionStatus('failed');
            toast.error('Transaction failed on blockchain', {
              description: 'The transaction was submitted but failed during execution.',
            });
          }
        } catch (waitError) {
          console.warn('Transaction confirmation timeout:', waitError);
          toast.warning('Transaction submitted but confirmation timed out', {
            description: 'Check the explorer to see if your transaction was successful.',
          });
        }
      } else {
        throw new Error('No transaction hash received');
      }
    } catch (error: any) {
      console.error('Transaction signing error:', error);
      setTransactionStatus('failed');
      
      let errorMessage = 'Transaction failed';
      let errorDescription = 'An unknown error occurred';

      if (error?.message) {
        if (error.message.includes('User rejected')) {
          errorMessage = 'Transaction cancelled';
          errorDescription = 'You cancelled the transaction in your wallet';
        } else if (error.message.includes('insufficient')) {
          errorMessage = 'Insufficient funds';
          errorDescription = 'Not enough APT to complete this transaction';
        } else {
          errorDescription = error.message;
        }
      }

      toast.error(errorMessage, {
        description: errorDescription,
        duration: 8000,
        action: error?.message && error.message.length > 50 ? {
          label: 'Copy Full Error',
          onClick: () => navigator.clipboard.writeText(error.message || error.toString()),
        } : undefined,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-zinc-700 bg-zinc-900/50 backdrop-blur p-4 text-sm text-zinc-200 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-fuchsia-400" />
            <h3 className="text-lg font-semibold text-fuchsia-400">
              Transfer {currency}
            </h3>
            {transactionStatus === 'success' && (
              <CheckCircle className="h-5 w-5 text-green-400" />
            )}
          </div>
          <p className="text-zinc-400">{message}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded text-xs bg-orange-900/30 text-orange-300">
              {network}
            </span>
            {transactionStatus && (
              <span className={`px-2 py-0.5 rounded text-xs ${
                transactionStatus === 'success' ? 'bg-green-900/30 text-green-300' :
                transactionStatus === 'failed' ? 'bg-red-900/30 text-red-300' :
                'bg-yellow-900/30 text-yellow-300'
              }`}>
                {transactionStatus}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Hash */}
      {transactionHash && (
        <div className="space-y-2">
          <h4 className="font-semibold text-zinc-300">Transaction Hash</h4>
          <div className="flex items-center gap-2 p-2 bg-zinc-800 rounded">
            <code className="flex-1 text-xs font-mono text-green-400 break-all">
              {transactionHash}
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => copyToClipboard(transactionHash, 'Transaction hash')}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => openExplorer(transactionHash)}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Transaction Summary */}
      <div className="space-y-3">
        <h4 className="font-semibold text-zinc-300">Transaction Summary</h4>
        <div className="space-y-2 text-zinc-400">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Amount:</span>
            <span className="font-medium text-white text-lg">
              {amount} {currency}
            </span>
          </div>
          
          <div className="flex justify-between items-start">
            <span className="text-zinc-500">From:</span>
            <div className="text-right">
              <code className="text-xs text-white break-all">
                {account?.address.toString().slice(0, 10)}...{account?.address.toString().slice(-8)}
              </code>
            </div>
          </div>
          
          <div className="flex justify-between items-start">
            <span className="text-zinc-500">To:</span>
            <code className="text-xs text-white break-all">
              {recipient.slice(0, 10)}...{recipient.slice(-8)}
            </code>
          </div>
          
          {transactionData.estimatedGasFee && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500">Est. Gas Fee:</span>
              <span className="text-yellow-300">
                ~{transactionData.estimatedGasFee} {currency}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Raw Transaction Data */}
      <div>
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-zinc-300">Transaction Data</h4>
          <Button
            variant="ghost"
            className="px-2 py-1 text-xs h-auto"
            onClick={() => setShowRaw(!showRaw)}
          >
            {showRaw ? 'Hide' : 'Show'} Raw Data
          </Button>
        </div>
        
        {showRaw && (
          <div className="mt-2 p-3 bg-zinc-800 rounded-md overflow-x-auto">
            <pre className="text-xs text-yellow-300 whitespace-pre-wrap break-words">
              {JSON.stringify(transactionData, null, 2)}
            </pre>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-6 text-xs"
              onClick={() => copyToClipboard(JSON.stringify(transactionData, null, 2), 'Raw transaction data')}
            >
              <Copy className="mr-1 h-3 w-3" />
              Copy Raw Data
            </Button>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="pt-2">
        {transactionHash && transactionStatus === 'success' ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => openExplorer(transactionHash)}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Explorer
            </Button>
          </div>
        ) : (
          <Button
            className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-500 hover:from-fuchsia-600 hover:to-purple-600 transition-all disabled:from-zinc-600 disabled:to-zinc-600 disabled:text-zinc-400"
            onClick={handleApprove}
            disabled={!connected || isProcessing || transactionStatus === 'success'}
          >
            {!connected ? (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet First
              </>
            ) : isProcessing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                {transactionStatus === 'pending' ? 'Confirming...' : 'Processing...'}
              </>
            ) : transactionStatus === 'success' ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Transaction Completed
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Approve & Sign Transaction
              </>
            )}
          </Button>
        )}
        
      </div>
    </div>
  );
};