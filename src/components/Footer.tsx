import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-line/60 bg-night">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-display text-xl tracking-tight text-parchment">
              DESI SAGA
            </Link>
            <p className="mt-3 text-sm text-parchment-dim leading-relaxed max-w-xs">
              Pre-curated hampers for Indian festivals and rituals — sent home before
              the celebration.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-flame mb-4">Shop</h3>
            <ul className="space-y-2.5 text-sm text-parchment-dim">
              <li><Link href="/products?category=Diwali" className="hover:text-flame transition-colors">Diwali</Link></li>
              <li><Link href="/products?category=Wedding" className="hover:text-flame transition-colors">Wedding</Link></li>
              <li><Link href="/products?category=Puja" className="hover:text-flame transition-colors">Puja</Link></li>
              <li><Link href="/products?category=Housewarming" className="hover:text-flame transition-colors">Housewarming</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-flame mb-4">Festivals</h3>
            <ul className="space-y-2.5 text-sm text-parchment-dim">
              <li><Link href="/products?category=Navratri" className="hover:text-flame transition-colors">Navratri</Link></li>
              <li><Link href="/products?category=Holi" className="hover:text-flame transition-colors">Holi</Link></li>
              <li><Link href="/products?category=Ganesh Chaturthi" className="hover:text-flame transition-colors">Ganesh Chaturthi</Link></li>
              <li><Link href="/products?category=Raksha Bandhan" className="hover:text-flame transition-colors">Raksha Bandhan</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-flame mb-4">Support</h3>
            <ul className="space-y-2.5 text-sm text-parchment-dim">
              <li><span className="hover:text-flame cursor-pointer transition-colors">Contact</span></li>
              <li><span className="hover:text-flame cursor-pointer transition-colors">Shipping</span></li>
              <li><span className="hover:text-flame cursor-pointer transition-colors">Returns</span></li>
              <li><span className="hover:text-flame cursor-pointer transition-colors">FAQ</span></li>
            </ul>
          </div>
        </div>
        <div className="festive-divider mt-12 mb-6" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-parchment-dim">&copy; {new Date().getFullYear()} Desi Saga</p>
          <p className="text-xs text-parchment-dim flex items-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-kumkum fill-kumkum" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
