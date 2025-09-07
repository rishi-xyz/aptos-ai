import { getAptosBalance, getAptosTestnetBalance, getAptosDevnetBalance } from './aptos/get-balance';
import { transferAptos, transferAptosTestnet, checkAptosBalance } from './aptos/send-tokens';
import { createAptosToken } from './aptos/create-token';

export const AptosTools = { 
  getAptosBalance, 
  getAptosTestnetBalance,
  getAptosDevnetBalance,
  transferAptos,
  transferAptosTestnet,
  checkAptosBalance,
  createAptosToken
};
export const ALLTools = {
  getAptosBalance,
  getAptosTestnetBalance,
  getAptosDevnetBalance,
  transferAptos,
  transferAptosTestnet,
  checkAptosBalance,
  createAptosToken,
};
