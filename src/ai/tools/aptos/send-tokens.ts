import { z } from 'zod';
import { tool } from 'ai';
import { Aptos, AptosConfig, Network, AccountAddress } from '@aptos-labs/ts-sdk';

// Initialize Aptos client
const aptosConfig = new AptosConfig({ network: Network.MAINNET });
const aptos = new Aptos(aptosConfig);

function isValidAptosAddress(address: string): boolean {
  try {
    AccountAddress.fromString(address);
    return true;
  } catch {
    return false;
  }
}

export const transferAptosMainnet = tool({
  description: 'Create a transaction for sending APT on Aptos Mainnet.',
  parameters: z.object({
    recipient: z.string().describe('The recipient Aptos wallet address'),
    amount: z.number().positive().describe('Amount in APT (must be positive)'),
    sender: z.string().describe('The sender Aptos wallet address'),
  }),
  execute: async ({ recipient, amount, sender }: { recipient: string; amount: number; sender: string }) => {
    try {
      // Validate addresses
      if (!isValidAptosAddress(recipient)) {
        return { error: `Invalid recipient address: ${recipient}` };
      }
      if (!isValidAptosAddress(sender)) {
        return { error: `Invalid sender address: ${sender}` };
      }
      if (amount <= 0) {
        return { error: 'Amount must be greater than 0' };
      }

      // Convert APT to octas (1 APT = 10^8 octas)
      const amountInOctas = Math.floor(amount * 100000000);

      // Create transaction
      await aptos.transferCoinTransaction({
        sender: sender,
        recipient: recipient,
        amount: amountInOctas,
      });

      // Get transaction data
      const transactionData = {
        sender: sender,
        recipient: recipient,
        amount: amount,
        amountInOctas: amountInOctas,
        network: 'Aptos Mainnet',
        currency: 'APT',
      };

      return {
        transactionData,
        message: `APT transfer transaction prepared. Send ${amount} APT to ${recipient} on Aptos Mainnet.`,
        amount,
        recipient,
        sender,
        network: 'Aptos Mainnet',
        currency: 'APT',
      };
    } catch (error: any) {
      return { error: `Failed to create Aptos transaction: ${error.message}` };
    }
  },
});

export const transferAptosTestnet = tool({
  description: 'Create a transaction for sending APT on Aptos Testnet.',
  parameters: z.object({
    recipient: z.string().describe('The recipient Aptos wallet address'),
    amount: z.number().positive().describe('Amount in APT (must be positive)'),
    sender: z.string().describe('The sender Aptos wallet address'),
  }),
  execute: async ({ recipient, amount, sender }: { recipient: string; amount: number; sender: string }) => {
    try {
      // Validate addresses
      if (!isValidAptosAddress(recipient)) {
        return { error: `Invalid recipient address: ${recipient}` };
      }
      if (!isValidAptosAddress(sender)) {
        return { error: `Invalid sender address: ${sender}` };
      }
      if (amount <= 0) {
        return { error: 'Amount must be greater than 0' };
      }

      // Convert APT to octas (1 APT = 10^8 octas)
      const amountInOctas = Math.floor(amount * 100000000);

      // Create testnet client
      const testnetConfig = new AptosConfig({ network: Network.TESTNET });
      const testnetAptos = new Aptos(testnetConfig);

      // Create transaction
      await testnetAptos.transferCoinTransaction({
        sender: sender,
        recipient: recipient,
        amount: amountInOctas,
      });

      // Get transaction data
      const transactionData = {
        sender: sender,
        recipient: recipient,
        amount: amount,
        amountInOctas: amountInOctas,
        network: 'Aptos Testnet',
        currency: 'APT',
      };

      return {
        transactionData,
        message: `APT transfer transaction prepared. Send ${amount} APT to ${recipient} on Aptos Testnet.`,
        amount,
        recipient,
        sender,
        network: 'Aptos Testnet',
        currency: 'APT',
      };
    } catch (error: any) {
      return { error: `Failed to create Aptos testnet transaction: ${error.message}` };
    }
  },
});
