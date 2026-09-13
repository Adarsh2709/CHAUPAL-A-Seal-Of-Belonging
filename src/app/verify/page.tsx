"use client";

import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";
import {
  useAccount,
  useConnect,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseAbi } from "viem";

const ABI = parseAbi([
  "function claimSeal(bytes32 communityId, bytes32 memberCommitment, bytes32[] calldata proof) external",
]);
const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

interface CommunityInfo {
  id: string;
  name: string;
  region: string;
  memberCount: number;
  currentRoot: string | null;
}

interface ProofResult {
  communityId: string;
  communityIdRaw: string;
  memberCommitment: string;
  proof: string[];
  root: string;
}

export default function VerifyPage() {
  const [step, setStep] = useState(1);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityInfo | null>(null);
  const [credential, setCredential] = useState("");
  const [proofData, setProofData] = useState<ProofResult | null>(null);
  const [error, setError] = useState("");
  const [communities, setCommunities] = useState<CommunityInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProofDetail, setShowProofDetail] = useState(false);

  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const {
    writeContract,
    data: hash,
    isPending: isWriting,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    fetch("/api/communities")
      .then((r) => r.json())
      .then((d) => setCommunities(d.communities || []));
  }, []);

  const handleGenerateProof = async () => {
    if (!selectedCommunity || !credential) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          communityId: selectedCommunity.id,
          credential: credential.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate proof");
        setLoading(false);
        return;
      }
      setProofData(data);
      setStep(3);
    } catch {
      setError("Server error — could not reach proof service");
    }
    setLoading(false);
  };

  const handleClaimSeal = async () => {
    if (!proofData || !CONTRACT) return;
    writeContract({
      address: CONTRACT,
      abi: ABI,
      functionName: "claimSeal",
      args: [
        proofData.communityId as `0x${string}`,
        proofData.memberCommitment as `0x${string}`,
        proofData.proof as `0x${string}`[],
      ],
    });
  };

  /* ─── Step indicator ─── */
  const steps = [
    { n: 1, label: "Community" },
    { n: 2, label: "Credential" },
    { n: 3, label: "Proof" },
    { n: 4, label: "Seal" },
  ];

  return (
    <main className="flex-1">
      <Navbar />
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="label-caps text-saffron mb-2">Membership Verification</p>
            <h1 className="mb-3">Prove Your Belonging</h1>
            <p className="text-warm-gray">
              Your credential generates a Merkle proof.
              Your community list stays private.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center mb-12">
            {steps.map((s, i) => (
              <div key={s.n} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 flex items-center justify-center text-[11px] font-mono border transition-colors duration-200
                      ${step >= s.n
                        ? "border-saffron text-saffron"
                        : "border-border-mid text-warm-gray/40"
                      }
                      ${step === s.n ? "bg-saffron/10" : ""}
                    `}
                  >
                    {step > s.n ? "✓" : String(s.n).padStart(2, "0")}
                  </div>
                  <span
                    className={`text-[10px] font-medium tracking-wider uppercase mt-2
                      ${step >= s.n ? "text-ivory/70" : "text-warm-gray/30"}
                    `}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-px flex-1 mx-1 transition-colors duration-200
                      ${step > s.n ? "bg-saffron/40" : "bg-border-subtle"}
                    `}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ─── Step 1: Choose Community ─── */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-base font-semibold mb-1">Select your community</h3>
              <p className="text-sm text-warm-gray mb-6">
                Choose the community you wish to verify membership in.
              </p>
              <div className="grid gap-px bg-border-subtle">
                {communities.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCommunity(c);
                      setStep(2);
                    }}
                    className="bg-charcoal text-left p-4 flex items-center justify-between group hover:bg-charcoal-surface transition-colors duration-150"
                  >
                    <div>
                      <span className="font-medium group-hover:text-saffron transition-colors duration-150">
                        {c.name}
                      </span>
                      <span className="text-[12px] text-warm-gray ml-3">{c.region}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-warm-gray/50">
                        {c.memberCount} members
                      </span>
                      <span className="text-warm-gray/30 group-hover:text-saffron transition-colors">→</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── Step 2: Enter Credential ─── */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="text-base font-semibold mb-1">
                Enter your private credential
              </h3>
              <p className="text-sm text-warm-gray mb-6">
                Community:{" "}
                <span className="text-ivory/80">{selectedCommunity?.name}</span>
              </p>

              <div className="border border-maroon/20 p-4 mb-6">
                <div className="private-badge mb-3">Private · Never stored</div>
                <p className="text-[13px] text-ivory/50 leading-relaxed">
                  Your credential is used locally to generate a cryptographic
                  commitment. It is never sent to the blockchain or stored anywhere.
                </p>
              </div>

              <div className="mb-6">
                <label className="label-caps block mb-2">Credential</label>
                <input
                  type="text"
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  placeholder="32-character hex credential"
                  className="w-full font-mono"
                />
              </div>

              {error && (
                <div className="border border-maroon/30 bg-maroon/5 p-4 mb-6">
                  <p className="text-sm text-maroon">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setStep(1);
                    setError("");
                  }}
                  className="btn-secondary"
                >
                  ← Back
                </button>
                <button
                  onClick={handleGenerateProof}
                  disabled={!credential || loading}
                  className="btn flex-1"
                >
                  {loading ? "Generating proof…" : "Generate Merkle Proof"}
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 3: Proof Generated ─── */}
          {step === 3 && proofData && (
            <div className="animate-fade-in">
              {/* Verification timeline */}
              <div className="mb-8">
                <h3 className="text-base font-semibold mb-6">Verification complete</h3>
                <div className="space-y-0">
                  {[
                    { label: "Private credential accepted", badge: "private-badge", badgeText: "Private" },
                    { label: "Membership found in register", badge: "private-badge", badgeText: "Off-chain" },
                    { label: "Merkle proof generated", badge: "onchain-badge", badgeText: "Proof" },
                    { label: "Root retrieved from tree", badge: "onchain-badge", badgeText: "Root" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-border-subtle last:border-0">
                      <div className="w-6 h-6 flex items-center justify-center text-deep-green text-sm">✓</div>
                      <span className="text-sm text-ivory/80 flex-1">{item.label}</span>
                      <span className={item.badge}>{item.badgeText}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proof data display */}
              <div className="border border-border-subtle p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="label-caps">Cryptographic proof</span>
                  <button
                    onClick={() => setShowProofDetail(!showProofDetail)}
                    className="text-[11px] text-warm-gray hover:text-saffron transition-colors"
                  >
                    {showProofDetail ? "Hide details" : "Show details"}
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="label-caps block mb-1">Community</span>
                    <span className="text-sm text-ivory/80">{selectedCommunity?.name}</span>
                  </div>
                  <div>
                    <span className="label-caps block mb-1">Merkle Root</span>
                    <span className="font-mono text-[11px] text-ivory/60">{proofData.root}</span>
                  </div>

                  {showProofDetail && (
                    <div className="pt-3 border-t border-border-subtle space-y-3 animate-fade-in">
                      <div>
                        <span className="label-caps block mb-1">Community ID (bytes32)</span>
                        <span className="font-mono text-[11px] text-ivory/40 break-all">{proofData.communityId}</span>
                      </div>
                      <div>
                        <span className="label-caps block mb-1">Member Commitment</span>
                        <span className="font-mono text-[11px] text-ivory/40 break-all">{proofData.memberCommitment}</span>
                      </div>
                      <div>
                        <span className="label-caps block mb-1">Proof ({proofData.proof.length} nodes)</span>
                        <div className="space-y-1">
                          {proofData.proof.map((node, i) => (
                            <span key={i} className="font-mono text-[10px] text-ivory/30 block break-all">
                              [{i}] {node}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Wallet + Claim */}
              {!isConnected ? (
                <div className="border border-saffron/20 p-5">
                  <span className="label-caps block mb-3">Connect wallet to claim seal</span>
                  <p className="text-[13px] text-warm-gray mb-4">
                    A wallet transaction is required to claim your non-transferable community seal.
                  </p>
                  <div className="space-y-2">
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-deep-green/20">
                    <div>
                      <span className="label-caps block mb-0.5">Connected</span>
                      <span className="font-mono text-[12px] text-ivory/60">
                        {address}
                      </span>
                    </div>
                    <span className="public-badge">Wallet ✓</span>
                  </div>

                  <button
                    onClick={handleClaimSeal}
                    disabled={isWriting || isConfirming}
                    className="btn w-full text-base py-4"
                  >
                    {isWriting
                      ? "Waiting for signature…"
                      : isConfirming
                      ? "Confirming on-chain…"
                      : "Claim Community Seal"}
                  </button>

                  {isConfirmed && (
                    <div className="border border-deep-green/30 bg-deep-green/5 p-6 text-center animate-fade-in">
                      {/* The Seal */}
                      <div className="w-32 h-32 mx-auto mb-6 border-2 border-saffron rounded-full flex items-center justify-center">
                        <div className="text-center">
                          <span className="block font-serif text-2xl font-bold text-saffron">चौपाल</span>
                          <span className="block text-[9px] tracking-[0.15em] uppercase text-warm-gray mt-1">Verified Member</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">Seal Claimed</h3>
                      <p className="text-sm text-warm-gray mb-4">
                        Your non-transferable community seal for{" "}
                        <span className="text-ivory/80">{selectedCommunity?.name}</span>{" "}
                        has been minted.
                      </p>
                      <div className="onchain-badge mx-auto">Soulbound · Non-transferable</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
