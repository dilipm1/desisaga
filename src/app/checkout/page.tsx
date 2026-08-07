"use client";

import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, ArrowRight, CreditCard } from "lucide-react";
import { Sparkle } from "@/components/FestiveHero";

export default function CheckoutPage() {
  const { cart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-warm-cream">
        <div className="text-center max-w-md mx-auto px-6 py-20">
          <ShoppingBag className="w-12 h-12 text-flame mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-parchment mb-2">Nothing to checkout</h1>
          <p className="text-muted text-sm mb-8">Your cart is empty.</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-flame text-night font-semibold px-8 py-3.5 text-sm hover:bg-marigold transition-all rounded-md warm-shadow">
            Shop Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-warm-cream min-h-screen rangoli-pattern">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="font-display text-4xl tracking-tight text-parchment mb-2">Checkout</h1>
        <div className="festive-divider mt-2 mb-10 w-24" />

        <div className="bg-ember border border-line p-6 mb-6 rounded-xl warm-shadow">
          <h2 className="text-sm font-semibold text-parchment uppercase tracking-wider mb-5 flex items-center gap-2">
            <Sparkle className="w-3 h-3 text-flame" />
            Order Summary
          </h2>
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="text-muted">{item.product.name} &times; {item.quantity}</span>
                <span className="font-medium text-parchment">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-line pt-3 flex justify-between">
              <span className="font-semibold text-parchment">Total</span>
              <span className="font-bold text-flame">{formatPrice(cart.total)}</span>
            </div>
          </div>
        </div>

        <div className="border border-line p-8 text-center bg-ember rounded-xl warm-shadow">
          <CreditCard className="w-8 h-8 text-flame mx-auto mb-4" />
          <h2 className="text-lg font-bold text-parchment mb-2">Stripe Coming Soon</h2>
          <p className="text-muted text-sm max-w-sm mx-auto leading-relaxed">
            Payment processing will be available once Stripe is configured. This is a demo.
          </p>
        </div>

        <Link href="/cart" className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-flame transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
      </div>
    </div>
  );
}
