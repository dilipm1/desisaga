"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const solid = !isHome || scrolled;
  const { itemCount } = useCart();

  useEffect(() => {
    if (!isHome) { setScrolled(true); return; }
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      solid ? "bg-white border-b border-border" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2" aria-label="Desi Saga Home">
            <span className={`text-xl font-bold tracking-tight ${solid ? "text-foreground" : "text-white"}`}>
              DESI SAGA
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["Shop", "Diwali", "Wedding", "Puja"].map((label) => (
              <Link
                key={label}
                href={label === "Shop" ? "/products" : `/products?category=${label}`}
                className={`text-sm font-medium transition-colors ${
                  solid ? "text-muted hover:text-foreground" : "text-white/80 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className={`relative p-2 transition-colors ${
                solid ? "text-foreground hover:text-muted" : "text-white hover:text-white/80"
              }`}
              aria-label={`Cart${itemCount > 0 ? ` with ${itemCount} items` : ""}`}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-foreground text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              className={`md:hidden p-2 ${solid ? "text-foreground" : "text-white"}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-6 pt-2 space-y-1 bg-white animate-fade-in">
            {[
              { label: "Shop All", href: "/products" },
              { label: "Diwali", href: "/products?category=Diwali" },
              { label: "Wedding", href: "/products?category=Wedding" },
              { label: "Puja", href: "/products?category=Puja" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block py-2.5 text-sm font-medium text-foreground hover:text-muted transition-colors"
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