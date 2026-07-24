"use client";

import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, ArrowRight, CreditCard } from "lucide-react";

export default function CheckoutPage() {
  const { cart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-6 py-20">
          <ShoppingBag className="w-12 h-12 text-muted mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Nothing to checkout</h1>
          <p className="text-muted text-sm mb-8">Your cart is empty.</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-foreground text-white font-semibold px-8 py-3.5 text-sm hover:bg-neutral-800 transition-colors">
            Shop Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-10">Checkout</h1>

        <div className="border border-border p-6 mb-6">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-5">Order Summary</h2>
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="text-muted">{item.product.name} &times; {item.quantity}</span>
                <span className="font-medium text-foreground">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-foreground">{formatPrice(cart.total)}</span>
            </div>
          </div>
        </div>

        <div className="border border-border p-8 text-center bg-neutral-50">
          <CreditCard className="w-8 h-8 text-muted mx-auto mb-4" />
          <h2 className="text-lg font-bold text-foreground mb-2">Stripe Coming Soon</h2>
          <p className="text-muted text-sm max-w-sm mx-auto leading-relaxed">
            Payment processing will be available once Stripe is configured. This is a demo.
          </p>
        </div>

        <Link href="/cart" className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
      </div>
    </div>
  );
}