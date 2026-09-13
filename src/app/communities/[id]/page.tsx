"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

interface CommunityData {
  id: string;
  name: string;
  region: string;
  description: string;
  stewardName: string;
  memberCount: number;
  currentRoot: string | null;
}

export default function CommunityDetail() {
  const params = useParams();
  const id = params.id as string;
  const [community, setCommunity] = useState<CommunityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/communities")
      .then((res) => res.json())
      .then((data) => {
        const found = data.communities.find((c: CommunityData) => c.id === id);
        setCommunity(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="flex-1">
        <Navbar />
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-32 bg-border-subtle" />
              <div className="h-10 w-64 bg-border-subtle" />
              <div className="h-4 w-48 bg-border-subtle" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!community) {
    return (
      <main className="flex-1">
        <Navbar />
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-4">Community Not Found</h1>
            <p className="text-warm-gray mb-8">
              The community &quot;{id}&quot; does not exist in the directory.
            </p>
            <Link href="/communities" className="btn-secondary">
              ← Back to Directory
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <Navbar />
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link href="/communities" className="label-caps text-warm-gray hover:text-saffron transition-colors">
              ← Directory
            </Link>
          </div>

          {/* Header */}
          <div className="mb-10">
            <span className="label-caps text-saffron block mb-2">{community.region}</span>
            <h1 className="text-4xl sm:text-5xl mb-4">{community.name}</h1>
            <p className="text-warm-gray text-lg leading-relaxed">{community.description}</p>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-border-subtle mb-10">
            <div className="bg-charcoal-surface p-5">
              <span className="label-caps block mb-1">Members</span>
              <span className="font-serif text-2xl font-bold">{community.memberCount}</span>
            </div>
            <div className="bg-charcoal-surface p-5">
              <span className="label-caps block mb-1">Steward</span>
              <span className="text-sm text-ivory/80">{community.stewardName}</span>
            </div>
            <div className="bg-charcoal-surface p-5 col-span-2 sm:col-span-1">
              <span className="label-caps block mb-1">Merkle Root</span>
              {community.currentRoot ? (
                <span className="font-mono text-[11px] text-ivory/60 break-all">
                  {community.currentRoot.slice(0, 18)}…
                </span>
              ) : (
                <span className="text-sm text-warm-gray/50">Not yet published</span>
              )}
            </div>
          </div>

          {/* Privacy notice */}
          <div className="border border-maroon/20 p-5 mb-10">
            <div className="private-badge mb-3">Private Register</div>
            <p className="text-sm text-ivory/60 leading-relaxed">
              The membership list for {community.name} is kept entirely off-chain.
              Only a cryptographic Merkle root is published. Individual members can
              prove their belonging without revealing who else is on the list.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <Link href="/verify" className="btn">
              Verify &amp; Claim Seal
            </Link>
            <Link href="/steward" className="btn-secondary">
              Steward Console
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}