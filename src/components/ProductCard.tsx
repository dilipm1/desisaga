import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/format";
import { CATEGORY_BG, DEFAULT_BG } from "@/lib/constants";

export default function ProductCard({ product }: { product: Product }) {
  const categoryBg = CATEGORY_BG[product.category] || DEFAULT_BG;

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div className="h-full bg-ember border border-line rounded-lg overflow-hidden warm-shadow transition-all duration-300 hover:border-flame/50 hover:warm-shadow-lg hover:-translate-y-1">
        <div className="aspect-[4/3] bg-gradient-to-br from-ember to-ember-light flex items-center justify-center relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.featured && (
            <span className="absolute top-3 left-3 bg-flame text-night text-[11px] font-semibold px-2.5 py-1 rounded-full">
              Featured
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-night/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-5">
          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mb-3 ${categoryBg}`}>
            {product.category}
          </span>
          <h3 className="font-display text-lg text-parchment leading-snug mb-1.5 group-hover:text-flame transition-colors">
            {product.name}
          </h3>
          <p className="text-sm font-bold text-flame">{formatPrice(product.price)}</p>
        </div>
      </div>
    </Link>
  );
}
