'use client';

import React, { type ReactNode } from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';

import { walletAdapterConfig } from '@/src/config';
import { SessionProvider } from 'next-auth/react';

// Set up metadata
export const metadata = {
  name: 'AptosAI',
  description: 'Talk to blockchain in Natural Language',
  url: 'https://aptosai-eight.vercel.app',
  icons: [
    'https://drive.google.com/drive/folders/1-GKGLD2YQI2PlO5rtSwYTGPvegzubQWs?usp=sharing',
  ],
};

function ContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AptosWalletAdapterProvider
      autoConnect={walletAdapterConfig.autoConnect}
      dappConfig={{
        network: walletAdapterConfig.network,
        aptosApiKeys: {
          mainnet: process.env.NEXT_PUBLIC_APTOS_API_KEY_MAINNET,
          testnet: process.env.NEXT_PUBLIC_APTOS_API_KEY_TESTNET,
          devnet: process.env.NEXT_PUBLIC_APTOS_API_KEY_DEVNET,
        },
      }}
      onError={(error) => {
        console.error('Wallet adapter error:', error);
      }}
    >
      <SessionProvider>
      {children}
      </SessionProvider>
    </AptosWalletAdapterProvider>
  );
}

export default ContextProvider;
