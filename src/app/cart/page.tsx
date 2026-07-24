"use client";

import { useCart } from "@/lib/cart";
import { CATEGORY_EMOJI, CATEGORY_GRADIENT, DEFAULT_GRADIENT, DEFAULT_EMOJI } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-6 py-20">
          <ShoppingBag className="w-12 h-12 text-muted mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
          <p className="text-muted text-sm mb-8">Add some hampers to get started.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-foreground text-white font-semibold px-8 py-3.5 text-sm hover:bg-neutral-800 transition-colors"
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
  const itemCount = cart.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-10">Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const gradient = CATEGORY_GRADIENT[item.product.category] || DEFAULT_GRADIENT;
              const emoji = CATEGORY_EMOJI[item.product.category] || DEFAULT_EMOJI;
              return (
                <div key={item.product.id} className="flex gap-4 pb-4 border-b border-border">
                  <div className={`w-20 h-20 bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.slug}`} className="font-semibold text-foreground hover:text-muted transition-colors text-sm block truncate">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-muted mt-0.5">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 border border-border flex items-center justify-center hover:bg-neutral-50 transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 border border-border flex items-center justify-center hover:bg-neutral-50 transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-sm text-foreground">{formatPrice(item.product.price * item.quantity)}</span>
                        <button onClick={() => removeItem(item.product.id)} className="text-muted hover:text-foreground transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <button onClick={clearCart} className="text-xs text-muted hover:text-foreground transition-colors">Clear all</button>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-5">Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? "text-emerald-600" : "text-foreground"}`}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && <p className="text-xs text-muted">Add {formatPrice(999 - subtotal)} more for free shipping</p>}
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-foreground">{formatPrice(total)}</span>
                </div>
              </div>
              <Link href="/checkout" className="mt-6 block w-full bg-foreground text-white font-semibold py-3.5 text-sm text-center hover:bg-neutral-800 transition-colors">
                Checkout
              </Link>
              <Link href="/products" className="mt-3 block text-center text-xs text-muted hover:text-foreground transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}