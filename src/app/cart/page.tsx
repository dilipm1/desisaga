"use client";

import { useCart } from "@/lib/cart";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart();

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
        <p className="text-gray-500 mb-8">
          Start adding some festive hampers to your cart!
        </p>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-amber-900 mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.product.id}
              className="bg-white rounded-2xl border border-amber-100 p-4 flex gap-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                {item.product.category === "Diwali" && "🪔"}
                {item.product.category === "Puja" && "🙏"}
                {item.product.category === "Wedding" && "💍"}
                {item.product.category === "Housewarming" && "🏠"}
                {item.product.category === "Navratri" && "💃"}
                {item.product.category === "Raksha Bandhan" && "🎀"}
                {item.product.category === "Holi" && "🎨"}
                {item.product.category === "Ganesh Chaturthi" && "🐘"}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="font-semibold text-gray-900 hover:text-amber-700 transition block truncate"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-500">{item.product.category}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="w-8 h-8 rounded-full border border-amber-200 flex items-center justify-center hover:bg-amber-50 transition"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-full border border-amber-200 flex items-center justify-center hover:bg-amber-50 transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-amber-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-600 transition"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-amber-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({cart.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium">{formatPrice(cart.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">
                  {cart.total >= 999 ? "Free" : formatPrice(99)}
                </span>
              </div>
              {cart.total < 999 && (
                <p className="text-xs text-amber-600">
                  Add {formatPrice(999 - cart.total)} more for free shipping!
                </p>
              )}
              <div className="border-t border-amber-100 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-amber-900 text-lg">
                  {formatPrice(cart.total + (cart.total >= 999 ? 0 : 99))}
                </span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-full text-center transition"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/products"
              className="mt-3 block text-center text-amber-600 hover:text-amber-700 text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
