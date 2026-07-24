import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-lg font-bold tracking-tight text-foreground">DESI SAGA</Link>
            <p className="mt-3 text-sm text-muted leading-relaxed max-w-xs">
              Modern gift hampers for Indian festivals and rituals.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2.5 text-sm text-muted">
              <li><Link href="/products?category=Diwali" className="hover:text-foreground transition-colors">Diwali</Link></li>
              <li><Link href="/products?category=Wedding" className="hover:text-foreground transition-colors">Wedding</Link></li>
              <li><Link href="/products?category=Puja" className="hover:text-foreground transition-colors">Puja</Link></li>
              <li><Link href="/products?category=Housewarming" className="hover:text-foreground transition-colors">Housewarming</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Festivals</h3>
            <ul className="space-y-2.5 text-sm text-muted">
              <li><Link href="/products?category=Navratri" className="hover:text-foreground transition-colors">Navratri</Link></li>
              <li><Link href="/products?category=Holi" className="hover:text-foreground transition-colors">Holi</Link></li>
              <li><Link href="/products?category=Ganesh Chaturthi" className="hover:text-foreground transition-colors">Ganesh Chaturthi</Link></li>
              <li><Link href="/products?category=Raksha Bandhan" className="hover:text-foreground transition-colors">Raksha Bandhan</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2.5 text-sm text-muted">
              <li><span className="hover:text-foreground cursor-pointer transition-colors">Contact</span></li>
              <li><span className="hover:text-foreground cursor-pointer transition-colors">Shipping</span></li>
              <li><span className="hover:text-foreground cursor-pointer transition-colors">Returns</span></li>
              <li><span className="hover:text-foreground cursor-pointer transition-colors">FAQ</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">&copy; {new Date().getFullYear()} Desi Saga</p>
          <p className="text-xs text-muted">Made in India</p>
        </div>
      </div>
    </footer>
  );
}