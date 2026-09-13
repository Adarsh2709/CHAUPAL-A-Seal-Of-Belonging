"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";

const links = [
  { href: "/communities", label: "Communities" },
  { href: "/verify", label: "Verify" },
  { href: "/seals", label: "My Seals" },
  { href: "/steward", label: "Steward" },
];

export function Navbar() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();

  return (
    <nav className="border-b border-border-subtle bg-charcoal/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center h-14">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-lg font-bold tracking-widest-plus text-ivory hover:text-ivory"
        >
          CHAUPAL
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-[13px] font-medium tracking-wide transition-colors duration-200
                  ${isActive
                    ? "text-saffron"
                    : "text-warm-gray hover:text-ivory"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Wallet indicator */}
          {isConnected && address && (
            <div className="ml-3 pl-3 border-l border-border-subtle">
              <span className="font-mono text-[11px] text-warm-gray">
                {address.slice(0, 6)}…{address.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
