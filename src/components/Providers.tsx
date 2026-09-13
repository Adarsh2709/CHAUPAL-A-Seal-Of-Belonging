"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet, sepolia, foundry } from 'wagmi/chains';
import { AnonAadhaarProvider } from '@anon-aadhaar/react';

const queryClient = new QueryClient();

export const wagmiConfig = createConfig({
  chains: [foundry, sepolia, mainnet],
  transports: {
    [foundry.id]: http(),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AnonAadhaarProvider _useTestAadhaar={true}>
          {mounted && children}
        </AnonAadhaarProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}