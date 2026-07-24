"use client";

import { useParams } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { ShoppingBag, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const product = getProductBySlug(params.slug as string);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-4">Product not found</h1>
        <Link href="/products" className="text-sm font-medium text-foreground border-b border-foreground">
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

  return (
    <div className="pt-24 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <div className="aspect-square bg-neutral-100 flex items-center justify-center overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="pt-4">
            <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">{product.name}</h1>
            <div className="text-2xl font-bold text-foreground mb-6">{formatPrice(product.price)}</div>
            <p className="text-muted leading-relaxed mb-8">{product.description}</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-neutral-50 text-muted text-xs font-medium">{tag}</span>
              ))}
            </div>

            <button
              onClick={handleAdd}
              className={`w-full flex items-center justify-center gap-2.5 py-4 font-semibold text-sm transition-all duration-300 ${
                added
                  ? "bg-neutral-900 text-white"
                  : "bg-foreground text-white hover:bg-neutral-800"
              }`}
            >
              {added ? (
                <><Check className="w-4 h-4" /> Added to Cart</>
              ) : (
                <><ShoppingBag className="w-4 h-4" /> Add to Cart — {formatPrice(product.price)}</>
              )}
            </button>

            <p className="text-xs text-muted text-center mt-3">Free shipping on orders above &#8377;999</p>
          </div>
        </div>
      </div>
    </div>
  );
}