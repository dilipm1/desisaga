"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { getAllProducts, getCategories } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { CATEGORY_BG, DEFAULT_BG } from "@/lib/constants";
import { Sparkle } from "@/components/FestiveHero";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  const products = getAllProducts();
  const categories = getCategories();

  const filtered = products.filter((p) => {
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-24 pb-20 bg-warm-cream min-h-screen rangoli-pattern">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl tracking-tight text-parchment mb-2">
            {selectedCategory || "All Hampers"}
          </h1>
          <p className="text-muted text-sm">
            {filtered.length} {filtered.length === 1 ? "product" : "products"} found
          </p>
          <div className="festive-divider mt-4 w-24" />
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search hampers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-sm border-b-2 border-line pb-2 text-sm focus:outline-none focus:border-flame transition-colors bg-transparent text-parchment placeholder:text-muted/50"
          />
        </div>

        <div className="flex gap-2 flex-wrap mb-10">
          <button
            onClick={() => setSelectedCategory("")}
            className={`text-sm font-medium transition-all px-4 py-2 rounded-full border ${
              !selectedCategory
                ? "bg-flame text-night border-transparent"
                : "text-muted hover:text-parchment border-line hover:border-flame/50 bg-ember"
            }`}
          >
            All
          </button>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const bg = isActive ? "" : (CATEGORY_BG[cat] || DEFAULT_BG);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-sm font-medium transition-all px-4 py-2 rounded-full border ${
                  isActive
                    ? "bg-flame text-night border-transparent"
                    : `${bg} hover:opacity-80`
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Sparkle className="w-8 h-8 text-flame mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-parchment mb-2">No results</h2>
            <p className="text-muted text-sm">Try a different search or category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-warm-cream">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-amber-300 border-t-saffron rounded-full animate-spin mx-auto mb-3" />
          <p className="text-muted text-sm">Loading hampers...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
