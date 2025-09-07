import { z } from 'zod';
import { tool } from 'ai';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { getWalletByUserId } from '@/src/database/queries';
import { auth } from '@/app/(auth)/auth';

export const getAptosBalance = tool({
  description: 'Get the APT balance for the user\'s keyless wallet on mainnet. If no address is provided, it will use the user\'s connected keyless wallet address.',
  parameters: z.object({
    address: z.string().optional().describe('Optional: The Aptos wallet address to fetch balance for. If not provided, uses the user\'s keyless wallet.'),
  }),
  execute: async ({ address }: { address?: string }) => {
    try {
      let targetAddress = address;
      
      // If no address provided, get the user's keyless wallet address
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

      // Validate Aptos address format
      if (!targetAddress.startsWith('0x') || targetAddress.length !== 66) {
        return { error: 'Invalid Aptos address format. Address should start with 0x and be 66 characters long.' };
      }

      // Initialize Aptos client for mainnet
      const aptosConfig = new AptosConfig({ network: Network.MAINNET });
      const aptos = new Aptos(aptosConfig);

      // Get account info
      const accountInfo = await aptos.getAccountInfo({ accountAddress: targetAddress });
      
      // Get APT balance
      const balance = await aptos.getAccountAPTAmount({ accountAddress: targetAddress });
      
      // Convert from octas to APT (1 APT = 10^8 octas)
      const aptBalance = balance / 100000000;

      return {
        address: targetAddress,
        balance: aptBalance.toString(),
        currency: 'APT',
        network: 'Aptos Mainnet',
        isUserWallet: !address, // Indicates if this is the user's own wallet
        accountInfo: {
          sequenceNumber: accountInfo.sequence_number,
          authenticationKey: accountInfo.authentication_key,
        }
      };
    } catch (error: any) {
      return { error: `Failed to get Aptos balance: ${error.message}` };
    }
  },
});

export const getAptosTestnetBalance = tool({
  description: 'Get the APT balance for the user\'s keyless wallet on testnet. If no address is provided, it will use the user\'s connected keyless wallet address.',
  parameters: z.object({
    address: z.string().optional().describe('Optional: The Aptos wallet address to fetch balance for. If not provided, uses the user\'s keyless wallet.'),
  }),
  execute: async ({ address }: { address?: string }) => {
    try {
      let targetAddress = address;
      
      // If no address provided, get the user's keyless wallet address
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

      // Validate Aptos address format
      if (!targetAddress.startsWith('0x') || targetAddress.length !== 66) {
        return { error: 'Invalid Aptos address format. Address should start with 0x and be 66 characters long.' };
      }

      // Initialize Aptos client for testnet
      const aptosConfig = new AptosConfig({ network: Network.TESTNET });
      const aptos = new Aptos(aptosConfig);

      // Get account info
      const accountInfo = await aptos.getAccountInfo({ accountAddress: targetAddress });
      
      // Get APT balance
      const balance = await aptos.getAccountAPTAmount({ accountAddress: targetAddress });
      
      // Convert from octas to APT (1 APT = 10^8 octas)
      const aptBalance = balance / 100000000;

      return {
        address: targetAddress,
        balance: aptBalance.toString(),
        currency: 'APT',
        network: 'Aptos Testnet',
        isUserWallet: !address, // Indicates if this is the user's own wallet
        accountInfo: {
          sequenceNumber: accountInfo.sequence_number,
          authenticationKey: accountInfo.authentication_key,
        }
      };
    } catch (error: any) {
      return { error: `Failed to get Aptos testnet balance: ${error.message}` };
    }
  },
});

export const getAptosDevnetBalance = tool({
  description: 'Get the APT balance for the user\'s keyless wallet on devnet. If no address is provided, it will use the user\'s connected keyless wallet address.',
  parameters: z.object({
    address: z.string().optional().describe('Optional: The Aptos wallet address to fetch balance for. If not provided, uses the user\'s keyless wallet.'),
  }),
  execute: async ({ address }: { address?: string }) => {
    try {
      let targetAddress = address;
      
      // If no address provided, get the user's keyless wallet address
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

      // Validate Aptos address format
      if (!targetAddress.startsWith('0x') || targetAddress.length !== 66) {
        return { error: 'Invalid Aptos address format. Address should start with 0x and be 66 characters long.' };
      }

      // Initialize Aptos client for devnet
      const aptosConfig = new AptosConfig({ network: Network.DEVNET });
      const aptos = new Aptos(aptosConfig);

      // Get account info
      const accountInfo = await aptos.getAccountInfo({ accountAddress: targetAddress });
      
      // Get APT balance
      const balance = await aptos.getAccountAPTAmount({ accountAddress: targetAddress });
      
      // Convert from octas to APT (1 APT = 10^8 octas)
      const aptBalance = balance / 100000000;

      return {
        address: targetAddress,
        balance: aptBalance.toString(),
        currency: 'APT',
        network: 'Aptos Devnet',
        isUserWallet: !address, // Indicates if this is the user's own wallet
        accountInfo: {
          sequenceNumber: accountInfo.sequence_number,
          authenticationKey: accountInfo.authentication_key,
        }
      };
    } catch (error: any) {
      return { error: `Failed to get Aptos devnet balance: ${error.message}` };
    }
  },
});
