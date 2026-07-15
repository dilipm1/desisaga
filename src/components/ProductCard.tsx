import Link from "next/link";
import { Product } from "@/types";
import { ShoppingBag } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300">
        <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-6xl relative overflow-hidden">
          <span className="group-hover:scale-110 transition-transform duration-300">
            {product.category === "Diwali" && "🪔"}
            {product.category === "Puja" && "🙏"}
            {product.category === "Wedding" && "💍"}
            {product.category === "Housewarming" && "🏠"}
            {product.category === "Navratri" && "💃"}
            {product.category === "Raksha Bandhan" && "🎀"}
            {product.category === "Holi" && "🎨"}
            {product.category === "Ganesh Chaturthi" && "🐘"}
          </span>
          {product.featured && (
            <span className="absolute top-3 right-3 bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="text-xs text-amber-600 font-medium uppercase tracking-wide mb-1">
            {product.category}
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-amber-700 transition mb-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-amber-900">
              {formatPrice(product.price)}
            </span>
            <span className="flex items-center gap-1 text-sm text-amber-600 group-hover:text-amber-700">
              <ShoppingBag className="w-4 h-4" />
              View
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
