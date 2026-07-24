import Link from "next/link";
import { getFeaturedProducts, getCategories } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { CATEGORY_EMOJI, DEFAULT_EMOJI } from "@/lib/constants";
import { ArrowRight, Star } from "lucide-react";

export default function Home() {
  const featured = getFeaturedProducts();
  const categories = getCategories();

  return (
    <div>
      {/* Hero - full bleed, product-first */}
      <section className="bg-neutral-950 text-white min-h-[85vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-amber-950" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10 pt-24 pb-20">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-amber-400/80 mb-4 tracking-widest uppercase">Festival Essentials</p>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[0.9] mb-6">
              Celebrate
              <br />
              <span className="text-amber-400">Every Moment</span>
            </h1>
            <p className="text-base md:text-lg text-white/40 max-w-md mb-10 leading-relaxed">
              Curated gift hampers for Indian festivals. Modern. Thoughtful. Beautiful.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="bg-white text-foreground font-semibold px-8 py-3.5 text-sm hover:bg-neutral-200 transition-colors inline-flex items-center justify-center gap-2"
              >
                Shop Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="#categories"
                className="border border-white/20 text-white/80 font-medium px-8 py-3.5 text-sm hover:bg-white/10 transition-colors text-center"
              >
                Browse Festivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - clean grid */}
      <section id="categories" className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">Collections</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Shop by Festival</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${encodeURIComponent(cat)}`}
                className="group bg-neutral-50 hover:bg-neutral-100 transition-colors p-8 text-center"
              >
                <div className="text-4xl mb-3">{CATEGORY_EMOJI[cat] || DEFAULT_EMOJI}</div>
                <h3 className="font-semibold text-foreground text-sm">{cat}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="border-t border-border bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">Featured</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Best Sellers</h2>
            </div>
            <Link href="/products" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-muted transition-colors">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Link href="/products" className="sm:hidden mt-8 inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-muted transition-colors">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Trust - minimal bar */}
      <section className="border-t border-border bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-sm text-muted">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              <span>4.9 / 5.0 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
              <span>500+ happy families</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
              <span>Free shipping over &#8377;999</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}