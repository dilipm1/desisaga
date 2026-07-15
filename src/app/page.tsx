import Link from "next/link";
import { getFeaturedProducts, getCategories } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const featured = getFeaturedProducts();
  const categories = getCategories();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">🪔</div>
          <div className="absolute bottom-10 right-10 text-9xl">🙏</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem]">✨</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Celebrate Every
              <span className="text-amber-300"> Sacred Moment</span>
            </h1>
            <p className="text-lg md:text-xl text-amber-100 mb-8">
              Curated gift hampers for Indian festivals and rituals. From Diwali
              diyas to wedding blessings — everything you need to honor tradition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-semibold px-8 py-3 rounded-full transition text-center"
              >
                Shop All Hampers
              </Link>
              <Link
                href="#categories"
                className="border border-amber-300/50 hover:border-amber-300 text-amber-100 font-semibold px-8 py-3 rounded-full transition text-center"
              >
                Browse by Festival
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-amber-900 text-center mb-12">
          Shop by Festival
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${encodeURIComponent(cat)}`}
              className="group bg-white rounded-2xl border border-amber-100 p-6 text-center hover:shadow-lg hover:shadow-amber-100/50 hover:border-amber-300 transition-all"
            >
              <div className="text-4xl mb-3">
                {cat === "Diwali" && "🪔"}
                {cat === "Puja" && "🙏"}
                {cat === "Wedding" && "💍"}
                {cat === "Housewarming" && "🏠"}
                {cat === "Navratri" && "💃"}
                {cat === "Raksha Bandhan" && "🎀"}
                {cat === "Holi" && "🎨"}
                {cat === "Ganesh Chaturthi" && "🐘"}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-amber-700 transition">
                {cat}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-amber-900">Featured Hampers</h2>
          <Link
            href="/products"
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-amber-100/50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-2">🚚</div>
              <h3 className="font-semibold text-amber-900">Pan-India Delivery</h3>
              <p className="text-sm text-amber-700">Free shipping on orders above ₹999</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎁</div>
              <h3 className="font-semibold text-amber-900">Gift Wrapping</h3>
              <p className="text-sm text-amber-700">Beautiful traditional packaging included</p>
            </div>
            <div>
              <div className="text-3xl mb-2">✅</div>
              <h3 className="font-semibold text-amber-900">Quality Assured</h3>
              <p className="text-sm text-amber-700">Handpicked items from trusted artisans</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
