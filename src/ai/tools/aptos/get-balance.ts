import { z } from 'zod';
import { tool } from 'ai';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

// Initialize Aptos client
const aptosConfig = new AptosConfig({ network: Network.MAINNET });
const aptos = new Aptos(aptosConfig);

export const getAptosBalance = tool({
  description: 'Get the APT balance for a given Aptos wallet address.',
  parameters: z.object({
    address: z.string().describe('The Aptos wallet address to fetch balance for'),
  }),
  execute: async ({ address }: { address: string }) => {
    try {
      // Validate Aptos address format
      if (!address.startsWith('0x') || address.length !== 66) {
        return { error: 'Invalid Aptos address format. Address should start with 0x and be 66 characters long.' };
      }

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
