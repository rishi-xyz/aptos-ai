import { getAptosBalance } from './aptos/get-balance';
import { transferAptosMainnet, transferAptosTestnet } from './aptos/send-tokens';

export const AptosTools = { getAptosBalance, transferAptosMainnet, transferAptosTestnet };
export const ALLTools = {
  getAptosBalance,
  transferAptosMainnet,
  transferAptosTestnet,
};
