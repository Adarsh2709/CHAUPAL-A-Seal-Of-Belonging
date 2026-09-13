"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import ThemeToggle from "./ThemeToggle";

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
    <nav className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center h-14">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-lg font-bold tracking-widest-plus text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors duration-200"
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
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Wallet indicator */}
          {isConnected && address && (
            <div className="ml-3 pl-3 border-l border-[var(--color-border)]">
              <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
                {address.slice(0, 6)}…{address.slice(-4)}
              </span>
            </div>
          )}

          <div className="ml-4 flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
