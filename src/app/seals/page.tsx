"use client";

import { Navbar } from "@/components/Navbar";
import { useAccount, useConnect, useReadContract } from "wagmi";
import { parseAbi } from "viem";
import Link from "next/link";

const ABI = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
]);
const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function SealsPage() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { data: balance } = useReadContract({
    address: CONTRACT,
    abi: ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  }) as { data: bigint | undefined };

  return (
    <main className="flex-1">
      <Navbar />
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <p className="label-caps text-saffron mb-2">Your Collection</p>
            <h1 className="mb-3">My Seals</h1>
            <p className="text-warm-gray">
              Non-transferable community seals bound to your wallet.
            </p>
          </div>

          {!isConnected ? (
            /* ─── Not connected ─── */
            <div className="border border-border-subtle p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 border border-border-mid rounded-full flex items-center justify-center">
                <span className="font-serif text-2xl text-warm-gray/30">◎</span>
              </div>
              <h3 className="text-base font-semibold mb-2">Wallet not connected</h3>
              <p className="text-sm text-warm-gray mb-6 max-w-sm mx-auto">
                Connect your wallet to view your community seals.
                Seals are soulbound tokens that cannot be transferred.
              </p>
              <div className="space-y-2 max-w-xs mx-auto">
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    disabled={isConnecting}
                    className="btn w-full"
                  >
                    {isConnecting ? "Connecting…" : `Connect ${connector.name}`}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ─── Connected ─── */
            <div>
              {/* Wallet info */}
              <div className="flex items-center justify-between p-4 border border-deep-green/20 mb-8">
                <div>
                  <span className="label-caps block mb-0.5">Connected wallet</span>
                  <span className="font-mono text-[12px] text-ivory/60">{address}</span>
                </div>
                <span className="public-badge">Active</span>
              </div>

              {/* Seal count */}
              <div className="border border-border-subtle p-6 mb-8">
                <span className="label-caps block mb-1">Community seals held</span>
                <span className="font-serif text-4xl font-bold">
                  {balance?.toString() || "0"}
                </span>
                <div className="mt-2">
                  <span className="onchain-badge">Soulbound · Non-transferable</span>
                </div>
              </div>

              {Number(balance || 0) === 0 ? (
                /* Empty state */
                <div className="border border-border-subtle p-8 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 border-2 border-dashed border-border-mid rounded-full flex items-center justify-center">
                    <span className="font-serif text-3xl text-warm-gray/20">चौ</span>
                  </div>
                  <h3 className="text-base font-semibold mb-2">No seals yet</h3>
                  <p className="text-sm text-warm-gray mb-6">
                    Prove your membership in a community to claim your first seal.
                  </p>
                  <Link href="/verify" className="btn">
                    Prove Membership
                  </Link>
                </div>
              ) : (
                /* Has seals */
                <div className="border border-saffron/20 p-8 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 border-2 border-saffron rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <span className="block font-serif text-3xl font-bold text-saffron">चौपाल</span>
                      <span className="block text-[9px] tracking-[0.15em] uppercase text-warm-gray mt-1">
                        Verified
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-warm-gray">
                    You hold {balance?.toString()} community seal(s).
                    These are soulbound and cannot be transferred to another wallet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
