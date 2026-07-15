"use client";

import { useCart } from "@/lib/cart";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const { cart } = useCart();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-full transition"
        >
          <ShoppingBag className="w-5 h-5" />
          Browse Hampers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-900 mb-8">Checkout</h1>

      <div className="bg-white rounded-2xl border border-amber-100 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.product.name} × {item.quantity}
              </span>
              <span className="font-medium">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
          <div className="border-t border-amber-100 pt-3 flex justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-amber-900 text-lg">
              {formatPrice(cart.total)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-4">🚧</div>
        <h2 className="text-xl font-bold text-amber-900 mb-2">
          Stripe Integration Coming Soon
        </h2>
        <p className="text-amber-700 mb-4">
          Payment processing will be available once Stripe is configured.
          For now, this is a demo of the checkout flow.
        </p>
        <p className="text-sm text-amber-600">
          Supports: UPI, Indian Cards, Netbanking, International Cards (USD/GBP)
        </p>
      </div>

      <Link
        href="/cart"
        className="mt-6 block text-center text-amber-600 hover:text-amber-700"
      >
        ← Back to Cart
      </Link>
    </div>
  );
}
