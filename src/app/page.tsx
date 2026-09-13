import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1">
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="pt-28 pb-24 px-4 border-b border-border-subtle">
        <div className="max-w-3xl mx-auto">
          <p className="label-caps text-saffron mb-6">
            Road to Devcon IV — Hackathon Submission
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-8">
            A seal of belonging,<br />
            <span className="text-saffron">without opening<br className="hidden sm:inline" /> the cupboard.</span>
          </h1>
          <p className="text-lg text-warm-gray leading-relaxed max-w-xl mb-12">
            Twelve Indian communities keep their membership lists private.
            Members prove they belong using cryptographic Merkle proofs and
            receive a non-transferable on-chain seal — without revealing who
            else is on the list.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/communities" className="btn">
              Enter the Chaupal
            </Link>
            <Link href="/verify" className="btn-secondary">
              Prove Membership
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Privacy Pipeline ─── */}
      <section id="how-it-works" className="py-24 px-4 bg-charcoal-surface border-b border-border-subtle">
        <div className="max-w-4xl mx-auto">
          <p className="label-caps mb-3">How it works</p>
          <h2 className="mb-16">From private register to public seal</h2>

          <div className="grid md:grid-cols-5 gap-0">
            {[
              {
                label: "PRIVATE REGISTER",
                title: "The Cupboard",
                desc: "Each community keeps its membership records privately, in its own cupboard.",
                color: "text-maroon",
                badge: "private-badge",
                badgeText: "Off-chain",
              },
              {
                label: "COMMITMENT",
                title: "The Fingerprint",
                desc: "Member credentials are hashed. Only a Merkle root — a cryptographic fingerprint of the list — is published.",
                color: "text-warm-gray",
                badge: "label-caps",
                badgeText: "Hashed",
              },
              {
                label: "MERKLE PROOF",
                title: "The Proof",
                desc: "A member presents their credential to generate a Merkle proof, privately, without exposing the list.",
                color: "text-warm-gray",
                badge: "private-badge",
                badgeText: "Private",
              },
              {
                label: "ROOT VERIFIED",
                title: "The Check",
                desc: "The smart contract verifies the proof against the published root. No member data touches the chain.",
                color: "text-deep-green",
                badge: "onchain-badge",
                badgeText: "On-chain",
              },
              {
                label: "COMMUNITY SEAL",
                title: "The Seal",
                desc: "The verified member receives a non-transferable, soulbound token — their community seal.",
                color: "text-saffron",
                badge: "onchain-badge",
                badgeText: "SBT",
              },
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col">
                {/* Connector line */}
                {i > 0 && (
                  <div className="hidden md:block absolute left-0 top-8 w-full -translate-x-1/2">
                    <div className="h-px bg-border-mid w-full" />
                  </div>
                )}
                <div className="relative z-10 flex flex-col items-start px-1 pb-8 md:pb-0">
                  {/* Step number */}
                  <div className={`w-8 h-8 rounded-full border border-border-mid flex items-center justify-center text-[11px] font-mono ${step.color} mb-4`}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <span className={step.badge}>{step.badgeText}</span>
                  <h3 className="text-base font-semibold mt-3 mb-2">{step.title}</h3>
                  <p className="text-[13px] text-warm-gray leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Twelve Communities ─── */}
      <section className="py-24 px-4 border-b border-border-subtle">
        <div className="max-w-4xl mx-auto">
          <p className="label-caps mb-3">The Archive</p>
          <h2 className="mb-4">Twelve Communities</h2>
          <p className="text-warm-gray mb-12 max-w-lg">
            Independent governance. Private membership lists. One shared
            verification layer.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px bg-border-subtle">
            {[
              { name: "Punjabi Sangat", region: "Punjab" },
              { name: "Ganesh Mandal", region: "Maharashtra" },
              { name: "Nagaland Weavers", region: "Nagaland" },
              { name: "Bengali Durga", region: "West Bengal" },
              { name: "Kerala Reading Circle", region: "Kerala" },
              { name: "Tamil Arts Sabha", region: "Tamil Nadu" },
              { name: "Rajasthan Craft Guild", region: "Rajasthan" },
              { name: "Kashmir Handicraft", region: "Kashmir" },
              { name: "Assam Bihu Society", region: "Assam" },
              { name: "Odisha Folk Circle", region: "Odisha" },
              { name: "Delhi Katta", region: "Delhi" },
              { name: "Goa Cultural Trust", region: "Goa" },
            ].map((c) => (
              <div key={c.name} className="bg-charcoal p-5">
                <span className="block text-sm font-medium text-ivory/90 mb-1">{c.name}</span>
                <span className="text-[11px] text-warm-gray">{c.region}</span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link href="/communities" className="btn-secondary">
              View Full Directory →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Technical Summary ─── */}
      <section className="py-24 px-4 bg-charcoal-surface border-b border-border-subtle">
        <div className="max-w-4xl mx-auto">
          <p className="label-caps mb-3">Architecture</p>
          <h2 className="mb-12">What stays private. What goes on-chain.</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Private column */}
            <div className="border border-maroon/20 p-6">
              <div className="private-badge mb-4">Private · Off-chain</div>
              <ul className="space-y-3 text-sm text-ivory/70">
                <li className="flex items-start gap-3">
                  <span className="text-maroon mt-0.5 text-xs">●</span>
                  Member names, identifiers, credentials
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-maroon mt-0.5 text-xs">●</span>
                  Full membership lists
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-maroon mt-0.5 text-xs">●</span>
                  Community internal records
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-maroon mt-0.5 text-xs">●</span>
                  Who verified when
                </li>
              </ul>
            </div>

            {/* On-chain column */}
            <div className="border border-deep-green/20 p-6">
              <div className="onchain-badge mb-4">Public · On-chain</div>
              <ul className="space-y-3 text-sm text-ivory/70">
                <li className="flex items-start gap-3">
                  <span className="text-deep-green mt-0.5 text-xs">●</span>
                  Community Merkle root (fingerprint only)
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-deep-green mt-0.5 text-xs">●</span>
                  Steward address per community
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-deep-green mt-0.5 text-xs">●</span>
                  Soulbound membership seals (non-transferable)
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-deep-green mt-0.5 text-xs">●</span>
                  Root version history
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-8 px-4 text-center">
        <p className="label-caps text-warm-gray/60">
          Chaupal — Road to Devcon IV · Built on Ethereum
        </p>
      </footer>
    </main>
  );
}
