"use client";

import { useParams } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const product = getProductBySlug(params.slug as string);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        <Link href="/products" className="text-amber-600 hover:text-amber-700 font-medium">
          ← Back to shop
        </Link>
      </div>
    );
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/products" className="text-amber-600 hover:text-amber-700 text-sm mb-6 inline-block">
        ← Back to shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl flex items-center justify-center text-[10rem]">
          {product.category === "Diwali" && "🪔"}
          {product.category === "Puja" && "🙏"}
          {product.category === "Wedding" && "💍"}
          {product.category === "Housewarming" && "🏠"}
          {product.category === "Navratri" && "💃"}
          {product.category === "Raksha Bandhan" && "🎀"}
          {product.category === "Holi" && "🎨"}
          {product.category === "Ganesh Chaturthi" && "🐘"}
        </div>

        {/* Details */}
        <div>
          <span className="text-sm text-amber-600 font-medium uppercase tracking-wide">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
            {product.name}
          </h1>
          <div className="text-3xl font-bold text-amber-900 mb-6">
            {formatPrice(product.price)}
          </div>
          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAdd}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-full font-semibold text-lg transition ${
              added
                ? "bg-green-500 text-white"
                : "bg-amber-600 hover:bg-amber-700 text-white"
            }`}
          >
            {added ? (
              <>
                <Check className="w-5 h-5" />
                Added to Cart!
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                Add to Cart — {formatPrice(product.price)}
              </>
            )}
          </button>

          <p className="text-sm text-gray-500 text-center mt-4">
            🚚 Free shipping on orders above ₹999
          </p>
        </div>
      </div>
    </div>
  );
}
