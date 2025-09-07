import { z } from 'zod';
import { tool } from 'ai';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

export const getAptosBalance = tool({
  description: 'Get the APT balance for a given Aptos wallet address on mainnet.',
  parameters: z.object({
    address: z.string().describe('The Aptos wallet address to fetch balance for'),
  }),
  execute: async ({ address }: { address: string }) => {
    try {
      // Validate Aptos address format
      if (!address.startsWith('0x') || address.length !== 66) {
        return { error: 'Invalid Aptos address format. Address should start with 0x and be 66 characters long.' };
      }

      // Initialize Aptos client for mainnet
      const aptosConfig = new AptosConfig({ network: Network.MAINNET });
      const aptos = new Aptos(aptosConfig);

      // Get account info
      const accountInfo = await aptos.getAccountInfo({ accountAddress: address });
      
      // Get APT balance
      const balance = await aptos.getAccountAPTAmount({ accountAddress: address });
      
      // Convert from octas to APT (1 APT = 10^8 octas)
      const aptBalance = balance / 100000000;

      return {
        address,
        balance: aptBalance.toString(),
        currency: 'APT',
        network: 'Aptos Mainnet',
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
  description: 'Get the APT balance for a given Aptos wallet address on testnet.',
  parameters: z.object({
    address: z.string().describe('The Aptos wallet address to fetch balance for'),
  }),
  execute: async ({ address }: { address: string }) => {
    try {
      // Validate Aptos address format
      if (!address.startsWith('0x') || address.length !== 66) {
        return { error: 'Invalid Aptos address format. Address should start with 0x and be 66 characters long.' };
      }

      // Initialize Aptos client for testnet
      const aptosConfig = new AptosConfig({ network: Network.TESTNET });
      const aptos = new Aptos(aptosConfig);

      // Get account info
      const accountInfo = await aptos.getAccountInfo({ accountAddress: address });
      
      // Get APT balance
      const balance = await aptos.getAccountAPTAmount({ accountAddress: address });
      
      // Convert from octas to APT (1 APT = 10^8 octas)
      const aptBalance = balance / 100000000;

      return {
        address,
        balance: aptBalance.toString(),
        currency: 'APT',
        network: 'Aptos Testnet',
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
  description: 'Get the APT balance for a given Aptos wallet address on devnet.',
  parameters: z.object({
    address: z.string().describe('The Aptos wallet address to fetch balance for'),
  }),
  execute: async ({ address }: { address: string }) => {
    try {
      // Validate Aptos address format
      if (!address.startsWith('0x') || address.length !== 66) {
        return { error: 'Invalid Aptos address format. Address should start with 0x and be 66 characters long.' };
      }

      // Initialize Aptos client for devnet
      const aptosConfig = new AptosConfig({ network: Network.DEVNET });
      const aptos = new Aptos(aptosConfig);

      // Get account info
      const accountInfo = await aptos.getAccountInfo({ accountAddress: address });
      
      // Get APT balance
      const balance = await aptos.getAccountAPTAmount({ accountAddress: address });
      
      // Convert from octas to APT (1 APT = 10^8 octas)
      const aptBalance = balance / 100000000;

      return {
        address,
        balance: aptBalance.toString(),
        currency: 'APT',
        network: 'Aptos Devnet',
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
