"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🪔</span>
            <span className="text-xl font-bold text-amber-900">Desi Saga</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-gray-700 hover:text-amber-700 transition">
              Shop
            </Link>
            <Link href="/products?category=Diwali" className="text-gray-700 hover:text-amber-700 transition">
              Diwali
            </Link>
            <Link href="/products?category=Wedding" className="text-gray-700 hover:text-amber-700 transition">
              Wedding
            </Link>
            <Link href="/products?category=Puja" className="text-gray-700 hover:text-amber-700 transition">
              Puja
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-amber-700 transition">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/products" className="block py-2 text-gray-700 hover:text-amber-700" onClick={() => setMobileOpen(false)}>
              Shop All
            </Link>
            <Link href="/products?category=Diwali" className="block py-2 text-gray-700 hover:text-amber-700" onClick={() => setMobileOpen(false)}>
              Diwali
            </Link>
            <Link href="/products?category=Wedding" className="block py-2 text-gray-700 hover:text-amber-700" onClick={() => setMobileOpen(false)}>
              Wedding
            </Link>
            <Link href="/products?category=Puja" className="block py-2 text-gray-700 hover:text-amber-700" onClick={() => setMobileOpen(false)}>
              Puja
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
