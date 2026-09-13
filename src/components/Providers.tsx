"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet, sepolia, foundry } from 'wagmi/chains';
import { mock, injected } from 'wagmi/connectors';
import { AnonAadhaarProvider } from '@anon-aadhaar/react';
import { ThemeProvider } from 'next-themes';

const queryClient = new QueryClient();

export const wagmiConfig = createConfig({
  chains: [foundry, sepolia, mainnet],
  connectors: [
    injected(),
    mock({
      accounts: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'],
    }),
  ],
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
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
          </ThemeProvider>
        </AnonAadhaarProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}