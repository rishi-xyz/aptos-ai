import { Network } from '@aptos-labs/ts-sdk';

// Aptos network configurations
export const APTOS_NETWORKS = {
  mainnet: Network.MAINNET,
  testnet: Network.TESTNET,
  devnet: Network.DEVNET,
} as const;

export const DEFAULT_NETWORK = APTOS_NETWORKS.mainnet;

// Aptos wallet adapter configuration
export const walletAdapterConfig = {
  autoConnect: true,
  network: DEFAULT_NETWORK,
};
