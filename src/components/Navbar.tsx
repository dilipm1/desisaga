"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart";
import { useNextFestival } from "@/lib/festivals";
import { AnimatedDiya } from "@/components/FestiveHero";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const solid = !isHome || scrolled;
  const { itemCount } = useCart();
  const next = useNextFestival();

  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const linkColor = solid ? "text-parchment-dim hover:text-flame" : "text-parchment/80 hover:text-parchment";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      solid ? "bg-night/90 backdrop-blur-md border-b border-line" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Desi Saga Home">
            <AnimatedDiya size={22} delay={0} />
            <span className="font-display text-xl tracking-tight text-parchment">
              DESI SAGA
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["Shop", "Diwali", "Wedding", "Puja"].map((label) => (
              <Link
                key={label}
                href={label === "Shop" ? "/products" : `/products?category=${label}`}
                className={`text-sm font-medium transition-colors ${linkColor}`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {next && (
              <Link
                href={`/products?category=${encodeURIComponent(next.festival.category)}`}
                className="hidden lg:inline-flex items-center gap-2 border border-flame/40 rounded-full pl-3.5 pr-2.5 py-1.5 font-mono text-xs text-parchment-dim hover:text-flame hover:border-flame/70 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-flame animate-pulse" />
                {next.festival.name} · {next.daysLeft}d
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
            <Link
              href="/cart"
              className={`relative p-2 rounded-md transition-colors ${
                solid ? "text-parchment hover:text-flame hover:bg-ember" : "text-parchment hover:text-flame"
              }`}
              aria-label={`Cart${itemCount > 0 ? ` with ${itemCount} items` : ""}`}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-flame text-night text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              className={`md:hidden p-2 rounded-md ${solid ? "text-parchment hover:bg-ember" : "text-parchment"}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-6 pt-2 space-y-1 bg-night border border-line rounded-b-2xl shadow-2xl animate-fade-in">
            {[
              { label: "Shop All", href: "/products" },
              { label: "Diwali", href: "/products?category=Diwali" },
              { label: "Wedding", href: "/products?category=Wedding" },
              { label: "Puja", href: "/products?category=Puja" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block py-2.5 px-4 text-sm font-medium text-parchment-dim hover:text-flame hover:bg-ember rounded-md transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
