import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white">
        <div className="aspect-[4/3] bg-neutral-100 flex items-center justify-center relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.featured && (
            <span className="absolute top-3 left-3 bg-white text-foreground text-[11px] font-semibold px-2.5 py-1">
              Featured
            </span>
          )}
        </div>
        <div className="pt-4 pb-2">
          <p className="text-xs text-muted font-medium mb-1">{product.category}</p>
          <h3 className="font-semibold text-foreground text-sm leading-snug mb-1">{product.name}</h3>
          <p className="text-sm text-muted">{formatPrice(product.price)}</p>
        </div>
      </div>
    </Link>
  );
}