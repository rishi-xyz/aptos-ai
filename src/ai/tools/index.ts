import { getAptosBalance, getAptosTestnetBalance, getAptosDevnetBalance } from './aptos/get-balance';
import { transferAptos, transferAptosTestnet, checkAptosBalance } from './aptos/send-tokens';

export const AptosTools = { 
  getAptosBalance, 
  getAptosTestnetBalance,
  getAptosDevnetBalance,
  transferAptos,
  transferAptosTestnet,
  checkAptosBalance
};
export const ALLTools = {
  getAptosBalance,
  getAptosTestnetBalance,
  getAptosDevnetBalance,
  transferAptos,
  transferAptosTestnet,
  checkAptosBalance,
};
