import { z } from 'zod';
import { tool } from 'ai';
import { Aptos, AptosConfig, Network, AccountAddress } from '@aptos-labs/ts-sdk';
import { getWalletByUserId } from '@/src/database/queries';
import { auth } from '@/app/(auth)/auth';

// Network configuration mapping - only testnet supported
const NETWORK_CONFIG = {
  testnet: Network.TESTNET,
} as const;

// Create Aptos client for specific network
const getAptosClient = (network: keyof typeof NETWORK_CONFIG): Aptos => {
  const config = new AptosConfig({ network: NETWORK_CONFIG[network] });
  return new Aptos(config);
};

function isValidAptosAddress(address: string): boolean {
  try {
    AccountAddress.fromString(address);
    return true;
  } catch {
    return false;
  }
}

async function getAccountBalance(address: string, network: keyof typeof NETWORK_CONFIG): Promise<number> {
  try {
    const aptos = getAptosClient(network);
    
    // First check if account exists
    try {
      await aptos.getAccountInfo({ accountAddress: address });
    } catch (error) {
      console.warn(`Account ${address} might not exist on ${network}:`, error);
      return 0;
    }

    const resources = await aptos.getAccountResources({
      accountAddress: address
    });
    
    const coinResource = resources.find(
      (r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
    );
    
    if (coinResource && coinResource.data) {
      const balance = (coinResource.data as any).coin.value;
      const balanceInApt = parseInt(balance) / 100000000; // Convert from octas to APT
      console.log(`Balance for ${address} on ${network}: ${balanceInApt} APT`);
      return balanceInApt;
    }
    
    console.warn(`No APT coin store found for ${address} on ${network}`);
    return 0;
  } catch (error) {
    console.error(`Failed to get balance for ${address} on ${network}:`, error);
    throw new Error(`Unable to fetch balance from ${network}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Transfer tool that only works with testnet
export const transferAptos = tool({
  description: 'Create a transaction for sending APT on Aptos Testnet using the user\'s wallet. This prepares the transaction data that needs to be signed by the user\'s wallet.',
  parameters: z.object({
    recipient: z.string().describe('The recipient Aptos wallet address (0x format)'),
    amount: z.number().positive().describe('Amount in APT (must be positive)'),
  }),
  execute: async ({ recipient, amount }: { 
    recipient: string; 
    amount: number; 
  }) => {
    const network = 'testnet' as keyof typeof NETWORK_CONFIG;
    try {
      console.log(`Creating ${network} transaction: ${amount} APT to ${recipient}`);
      
      // Get user's wallet address
      const session = await auth();
      if (!session?.user?.id) {
        return { error: 'User not authenticated. Please log in to send tokens.' };
      }
      
      const wallet = await getWalletByUserId(session.user.id);
      if (!wallet) {
        return { error: 'No wallet found for user. Please create a wallet first.' };
      }
      
      const senderAddress = wallet.address;
      
      // Validate recipient address
      if (!isValidAptosAddress(recipient)) {
        return { 
          error: `Invalid recipient address: ${recipient}. Please ensure it's a valid Aptos address starting with 0x.` 
        };
      }
      if (amount <= 0) {
        return { error: 'Amount must be greater than 0 APT.' };
      }

      // Convert APT to octas (1 APT = 10^8 octas)
      const amountInOctas = Math.floor(amount * 100000000);
      
      // Check if amount is too small (less than 1 octa)
      if (amountInOctas === 0) {
        return { error: 'Amount is too small. Minimum transfer is 0.00000001 APT.' };
      }

      // Gas fee estimation for display purposes
      const estimatedGasFee = 0.0001; // Lower gas fees on testnet

      // Build transaction payload
      const transactionPayload = {
        function: "0x1::coin::transfer",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [recipient, amountInOctas.toString()],
      };

      // Prepare transaction data for the UI
      const networkDisplayName = `Aptos ${network.charAt(0).toUpperCase() + network.slice(1)}`;
      const transactionData = {
        sender: senderAddress,
        recipient: recipient,
        amount: amount,
        amountInOctas: amountInOctas,
        network: networkDisplayName,
        networkType: network,
        currency: 'APT',
        payload: transactionPayload,
        estimatedGasFee: estimatedGasFee,
        timestamp: new Date().toISOString(),
        isKeylessWallet: false, // This should be false to use regular wallet signing
      };

      console.log(`Transaction prepared successfully for ${network}:`, transactionData);

      return {
        transactionData,
        message: `Ready to send ${amount} APT from your wallet to ${recipient.slice(0, 6)}...${recipient.slice(-4)} on ${networkDisplayName}.`,
        amount,
        recipient,
        sender: senderAddress,
        network: networkDisplayName,
        currency: 'APT',
        isKeylessWallet: true,
        success: true,
      };
    } catch (error: any) {
      console.error(`Aptos ${network} transaction creation error:`, error);
      return { 
        error: `Failed to create Aptos ${network} transaction: ${error.message || 'Unknown error occurred'}`,
        details: error.toString(),
      };
    }
  },
});

// Testnet-specific transfer tool for backward compatibility
export const transferAptosTestnet = tool({
  description: 'Create a transaction for sending APT on Aptos Testnet using the user\'s wallet. This prepares the transaction data that needs to be signed by the user\'s wallet.',
  parameters: z.object({
    recipient: z.string().describe('The recipient Aptos wallet address (0x format)'),
    amount: z.number().positive().describe('Amount in APT (must be positive)'),
  }),
  execute: async ({ recipient, amount }: { recipient: string; amount: number }) => {
    const network = 'testnet' as keyof typeof NETWORK_CONFIG;
    try {
      console.log(`Creating ${network} transaction: ${amount} APT to ${recipient}`);
      
      // Get user's wallet address
      const session = await auth();
      if (!session?.user?.id) {
        return { error: 'User not authenticated. Please log in to send tokens.' };
      }
      
      const wallet = await getWalletByUserId(session.user.id);
      if (!wallet) {
        return { error: 'No wallet found for user. Please create a wallet first.' };
      }
      
      const senderAddress = wallet.address;
      
      // Validate recipient address
      if (!isValidAptosAddress(recipient)) {
        return { 
          error: `Invalid recipient address: ${recipient}. Please ensure it's a valid Aptos address starting with 0x.` 
        };
      }
      if (amount <= 0) {
        return { error: 'Amount must be greater than 0 APT.' };
      }

      // Convert APT to octas (1 APT = 10^8 octas)
      const amountInOctas = Math.floor(amount * 100000000);
      
      // Check if amount is too small (less than 1 octa)
      if (amountInOctas === 0) {
        return { error: 'Amount is too small. Minimum transfer is 0.00000001 APT.' };
      }

      // Gas fee estimation for display purposes
      const estimatedGasFee = 0.0001; // Lower gas fees on testnet

      // Build transaction payload
      const transactionPayload = {
        function: "0x1::coin::transfer",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [recipient, amountInOctas.toString()],
      };

      // Prepare transaction data for the UI
      const networkDisplayName = `Aptos ${network.charAt(0).toUpperCase() + network.slice(1)}`;
      const transactionData = {
        sender: senderAddress,
        recipient: recipient,
        amount: amount,
        amountInOctas: amountInOctas,
        network: networkDisplayName,
        networkType: network,
        currency: 'APT',
        payload: transactionPayload,
        estimatedGasFee: estimatedGasFee,
        timestamp: new Date().toISOString(),
        isKeylessWallet: false, // This should be false to use regular wallet signing
      };

      console.log(`Transaction prepared successfully for ${network}:`, transactionData);

      return {
        transactionData,
        message: `Ready to send ${amount} APT from your wallet to ${recipient.slice(0, 6)}...${recipient.slice(-4)} on ${networkDisplayName}.`,
        amount,
        recipient,
        sender: senderAddress,
        network: networkDisplayName,
        currency: 'APT',
        isKeylessWallet: true,
        success: true,
      };
    } catch (error: any) {
      console.error(`Aptos ${network} transaction creation error:`, error);
      return { 
        error: `Failed to create Aptos ${network} transaction: ${error.message || 'Unknown error occurred'}`,
        details: error.toString(),
      };
    }
  },
});

// Enhanced balance checking tool - only testnet supported
export const checkAptosBalance = tool({
  description: 'Check APT balance for the user\'s wallet on testnet. If no address is provided, it will use the user\'s connected wallet address.',
  parameters: z.object({
    address: z.string().optional().describe('Optional: The Aptos wallet address to check balance for. If not provided, uses the user\'s wallet.'),
  }),
  execute: async ({ address }: { address?: string }) => {
    const network = 'testnet' as keyof typeof NETWORK_CONFIG;
    try {
      let targetAddress = address;
      
      // If no address provided, get the user's wallet address
      if (!targetAddress) {
        const session = await auth();
        if (!session?.user?.id) {
          return { error: 'User not authenticated. Please log in to check your wallet balance.' };
        }
        
        const wallet = await getWalletByUserId(session.user.id);
        if (!wallet) {
          return { error: 'No wallet found for user. Please create a wallet first.' };
        }
        
        targetAddress = wallet.address;
      }

      if (!isValidAptosAddress(targetAddress)) {
        return { 
          error: `Invalid address: ${targetAddress}. Please ensure it's a valid Aptos address starting with 0x.` 
        };
      }

      const balance = await getAccountBalance(targetAddress, network);
      const networkDisplayName = `Aptos ${network.charAt(0).toUpperCase() + network.slice(1)}`;
      
      return {
        address: targetAddress,
        balance: balance,
        network: networkDisplayName,
        networkType: network,
        currency: 'APT',
        isUserWallet: !address, // Indicates if this is the user's own wallet
        message: `Balance: ${balance.toFixed(8)} APT on ${networkDisplayName}`,
        success: true,
      };
    } catch (error: any) {
      console.error('Balance check error:', error);
      return { 
        error: `Failed to check balance on ${network}: ${error.message || 'Unknown error occurred'}`,
        details: error.toString(),
      };
    }
  },
});
