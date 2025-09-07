import { getAptosBalance, getAptosTestnetBalance } from './aptos/get-balance';
import { transferAptos, transferAptosTestnet } from './aptos/send-tokens';

export const AptosTools = { 
  getAptosBalance, 
  getAptosTestnetBalance, 
  transferAptos,
  transferAptosTestnet 
};
export const ALLTools = {
  getAptosBalance,
  getAptosTestnetBalance,
  transferAptos,
  transferAptosTestnet,
};
