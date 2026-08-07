"use client";

import { useParams } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { ShoppingBag, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { CATEGORY_BG, DEFAULT_BG } from "@/lib/constants";
import { AnimatedDiya, Sparkle } from "@/components/FestiveHero";

export default function ProductDetailPage() {
  const params = useParams();
  const product = getProductBySlug(params.slug as string);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-2xl font-semibold text-parchment mb-4">Product not found</h1>
        <Link href="/products" className="text-sm font-medium text-flame border-b border-flame">
          &larr; Back to shop
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const categoryBg = CATEGORY_BG[product.category] || DEFAULT_BG;

  return (
    <div className="pt-24 pb-20 bg-warm-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-flame transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <div className="aspect-square bg-gradient-to-br from-ember to-ember-light rounded-xl overflow-hidden warm-shadow-lg">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="pt-4">
            <span className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full border mb-3 ${categoryBg}`}>
              {product.category}
            </span>
            <h1 className="font-display text-3xl md:text-4xl tracking-tight text-parchment mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="text-2xl font-bold text-flame">{formatPrice(product.price)}</div>
              <div className="flex items-center gap-1 text-xs text-parchment-dim">
                <AnimatedDiya size={20} delay={0} />
                <span>Inclusive of all taxes</span>
              </div>
            </div>

            <p className="text-muted leading-relaxed mb-8">{product.description}</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-ember-light text-parchment-dim text-xs font-medium rounded-full border border-line">{tag}</span>
              ))}
            </div>

            <button
              onClick={handleAdd}
              className={`w-full flex items-center justify-center gap-2.5 py-4 font-semibold text-sm transition-all duration-300 rounded-md ${
                added
                  ? "bg-leaf text-night"
                  : "bg-flame text-night hover:bg-marigold warm-shadow hover:warm-shadow-lg"
              }`}
            >
              {added ? (
                <><Check className="w-4 h-4" /> Added to Cart</>
              ) : (
                <><ShoppingBag className="w-4 h-4" /> Add to Cart &mdash; {formatPrice(product.price)}</>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted mt-4">
              <Sparkle className="w-3 h-3 text-flame" />
              <span>Free shipping on orders above &#8377;999</span>
              <Sparkle className="w-3 h-3 text-flame" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
