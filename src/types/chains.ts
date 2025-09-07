export type AptosNetwork = 'mainnet' | 'testnet' | 'devnet';

export interface AptosNetworkInfo {
  id: number;
  value: string;
  label: string;
  network: AptosNetwork;
}
