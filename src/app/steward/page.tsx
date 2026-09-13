"use client";

import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";
import {
  useAccount,
  useConnect,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseAbi, keccak256, toBytes } from "viem";

const ABI = parseAbi([
  "function updateRoot(bytes32 communityId, bytes32 newRoot) external",
]);
const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

interface CommunityInfo {
  id: string;
  name: string;
  region: string;
  memberCount: number;
  currentRoot: string | null;
}

export default function StewardConsole() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const [communities, setCommunities] = useState<CommunityInfo[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [newRoot, setNewRoot] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const {
    writeContract,
    data: hash,
    isPending: isWriting,
    error: writeError,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    fetch("/api/communities")
      .then((r) => r.json())
      .then((d) => setCommunities(d.communities || []));
  }, []);

  const handleUpdateRoot = () => {
    if (!selectedCommunity || !newRoot || !CONTRACT) {
      setStatusMsg("Please select a community and enter a new root.");
      return;
    }
    const communityIdBytes32 = keccak256(toBytes(selectedCommunity));
    writeContract({
      address: CONTRACT,
      abi: ABI,
      functionName: "updateRoot",
      args: [communityIdBytes32, newRoot as `0x${string}`],
    });
  };

  const currentComm = communities.find((c) => c.id === selectedCommunity);

  return (
    <main className="flex-1">
      <Navbar />
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <p className="label-caps text-maroon mb-2">Administrative</p>
            <h1 className="mb-3">Steward Console</h1>
            <p className="text-warm-gray">
              Manage your community&apos;s membership root. Only the registered
              steward for a community can update its root.
            </p>
          </div>

          {!isConnected ? (
            /* ─── Not connected ─── */
            <div className="border border-border-subtle p-8 text-center">
              <h3 className="text-base font-semibold mb-2">Wallet required</h3>
              <p className="text-sm text-warm-gray mb-6 max-w-sm mx-auto">
                Connect the wallet registered as steward for your community.
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
            <div className="space-y-8">
              {/* Wallet info */}
              <div className="flex items-center justify-between p-4 border border-deep-green/20">
                <div>
                  <span className="label-caps block mb-0.5">Steward wallet</span>
                  <span className="font-mono text-[12px] text-ivory/60">{address}</span>
                </div>
                <span className="public-badge">Connected</span>
              </div>

              {/* ─── Root Update Form ─── */}
              <div className="border border-border-subtle">
                <div className="px-6 py-4 border-b border-border-subtle">
                  <h2 className="text-lg font-semibold">Update Merkle Root</h2>
                </div>

                <div className="p-6 space-y-5">
                  {/* Community selector */}
                  <div>
                    <label className="label-caps block mb-2">Community</label>
                    <select
                      value={selectedCommunity}
                      onChange={(e) => setSelectedCommunity(e.target.value)}
                      className="w-full"
                    >
                      <option value="">Select community…</option>
                      {communities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} — {c.region}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Current root display */}
                  {currentComm && (
                    <div className="border border-border-subtle p-4">
                      <span className="label-caps block mb-1">Current root</span>
                      {currentComm.currentRoot ? (
                        <span className="font-mono text-[11px] text-ivory/50 break-all">
                          {currentComm.currentRoot}
                        </span>
                      ) : (
                        <span className="text-sm text-warm-gray/50">No root published yet</span>
                      )}
                    </div>
                  )}

                  {/* New root input */}
                  <div>
                    <label className="label-caps block mb-2">New Merkle Root</label>
                    <input
                      type="text"
                      value={newRoot}
                      onChange={(e) => setNewRoot(e.target.value)}
                      placeholder="0x..."
                      className="w-full font-mono"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleUpdateRoot}
                    disabled={!selectedCommunity || !newRoot || isWriting || isConfirming}
                    className="btn w-full"
                  >
                    {isWriting
                      ? "Waiting for signature…"
                      : isConfirming
                      ? "Confirming on-chain…"
                      : "Publish Root Update"}
                  </button>

                  {/* Status messages */}
                  {statusMsg && (
                    <div className="border border-saffron/20 p-3">
                      <p className="text-sm text-saffron">{statusMsg}</p>
                    </div>
                  )}

                  {writeError && (
                    <div className="border border-maroon/30 bg-maroon/5 p-4">
                      <span className="label-caps text-maroon block mb-1">Transaction failed</span>
                      <p className="text-[13px] text-ivory/50">
                        {writeError.message.includes("Only steward")
                          ? "You are not the registered steward for this community."
                          : writeError.message.slice(0, 200)}
                      </p>
                    </div>
                  )}

                  {isConfirmed && (
                    <div className="border border-deep-green/30 bg-deep-green/5 p-4 animate-fade-in">
                      <span className="label-caps text-deep-green block mb-1">Root updated</span>
                      <p className="text-sm text-ivory/60">
                        The Merkle root for {currentComm?.name || selectedCommunity} has been
                        published on-chain. Previous proofs generated against the old root
                        will no longer verify.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ─── Instructions ─── */}
              <div className="border border-border-subtle">
                <div className="px-6 py-4 border-b border-border-subtle">
                  <h2 className="text-lg font-semibold">How to update membership</h2>
                </div>
                <div className="p-6">
                  <ol className="space-y-4 text-sm text-ivory/60">
                    <li className="flex gap-3">
                      <span className="font-mono text-saffron/50 shrink-0">01</span>
                      <span>Update your community&apos;s member list JSON file in the <code className="font-mono text-[12px] text-ivory/40 bg-charcoal-surface px-1.5 py-0.5 border border-border-subtle">data/communities/</code> directory.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-mono text-saffron/50 shrink-0">02</span>
                      <span>Run the tree generation script: <code className="font-mono text-[12px] text-ivory/40 bg-charcoal-surface px-1.5 py-0.5 border border-border-subtle">npx ts-node scripts/generate-tree.ts your-community-id</code></span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-mono text-saffron/50 shrink-0">03</span>
                      <span>Copy the generated Merkle root from the output.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-mono text-saffron/50 shrink-0">04</span>
                      <span>Paste the root above and click &quot;Publish Root Update&quot;.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-mono text-saffron/50 shrink-0">05</span>
                      <span>Sign the transaction. Only your steward wallet can publish.</span>
                    </li>
                  </ol>
                </div>
              </div>

              {/* ─── Steward isolation notice ─── */}
              <div className="border border-maroon/15 p-5">
                <div className="private-badge mb-3">Steward Isolation</div>
                <p className="text-[13px] text-ivory/50 leading-relaxed">
                  Each community has exactly one steward. A steward can only
                  update the root for their own community. Attempting to update
                  another community&apos;s root will be rejected by the smart contract.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}