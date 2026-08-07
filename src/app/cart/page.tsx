"use client";

import { useCart } from "@/lib/cart";
import { CATEGORY_EMOJI, CATEGORY_GRADIENT, DEFAULT_GRADIENT, DEFAULT_EMOJI } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnimatedDiya, Sparkle } from "@/components/FestiveHero";

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-warm-cream">
        <div className="text-center max-w-md mx-auto px-6 py-20">
          <div className="flex justify-center gap-2 mb-6">
            <AnimatedDiya size={40} delay={0} />
            <AnimatedDiya size={32} delay={0.3} />
            <AnimatedDiya size={36} delay={0.6} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
          <p className="text-muted text-sm mb-8">Add some festive hampers to get started.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-flame text-night font-semibold px-8 py-3.5 text-sm hover:bg-marigold transition-all rounded-md warm-shadow"
          >
            Shop Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.total;
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="pt-24 pb-20 bg-warm-cream min-h-screen rangoli-pattern">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h1 className="font-display text-4xl tracking-tight text-parchment mb-2">Cart</h1>
        <div className="festive-divider mt-2 mb-10 w-24" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const gradient = CATEGORY_GRADIENT[item.product.category] || DEFAULT_GRADIENT;
              const emoji = CATEGORY_EMOJI[item.product.category] || DEFAULT_EMOJI;
              return (
                <div key={item.product.id} className="flex gap-4 p-4 bg-ember border border-line rounded-xl warm-shadow">
                  <div className={`w-20 h-20 bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl flex-shrink-0 rounded-lg`}>
                    {emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.slug}`} className="font-semibold text-parchment hover:text-flame transition-colors text-sm block truncate">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-flame font-medium mt-0.5">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 border border-line flex items-center justify-center hover:bg-ember-light transition-colors rounded-md">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-parchment">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 border border-line flex items-center justify-center hover:bg-ember-light transition-colors rounded-md">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-sm text-flame">{formatPrice(item.product.price * item.quantity)}</span>
                        <button onClick={() => removeItem(item.product.id)} className="text-muted hover:text-warm-red transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <button onClick={clearCart} className="text-xs text-muted hover:text-warm-red transition-colors">Clear all</button>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-ember border border-line p-6 rounded-xl warm-shadow">
              <h2 className="text-sm font-semibold text-parchment uppercase tracking-wider mb-5 flex items-center gap-2">
                <Sparkle className="w-3 h-3 text-flame" />
                Summary
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-medium text-parchment">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? "text-leaf" : "text-parchment"}`}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && <p className="text-xs text-muted">Add {formatPrice(999 - subtotal)} more for free shipping</p>}
                <div className="border-t border-line pt-3 flex justify-between">
                  <span className="font-semibold text-parchment">Total</span>
                  <span className="font-bold text-flame">{formatPrice(total)}</span>
                </div>
              </div>
              <Link href="/checkout" className="mt-6 block w-full bg-flame text-night font-semibold py-3.5 text-sm text-center hover:bg-marigold transition-all rounded-md warm-shadow">
                Checkout
              </Link>
              <Link href="/products" className="mt-3 block text-center text-xs text-muted hover:text-flame transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
