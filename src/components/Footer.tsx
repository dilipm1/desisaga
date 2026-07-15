import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-amber-950 text-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🪔</span>
              <span className="text-xl font-bold">Desi Saga</span>
            </div>
            <p className="text-amber-200 text-sm">
              Celebrating Indian traditions with curated festival hampers and ritual essentials.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-amber-200">
              <li><Link href="/products?category=Diwali" className="hover:text-white transition">Diwali Hampers</Link></li>
              <li><Link href="/products?category=Wedding" className="hover:text-white transition">Wedding Boxes</Link></li>
              <li><Link href="/products?category=Puja" className="hover:text-white transition">Puja Kits</Link></li>
              <li><Link href="/products?category=Housewarming" className="hover:text-white transition">Griha Pravesh</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Festivals</h3>
            <ul className="space-y-2 text-sm text-amber-200">
              <li><Link href="/products?category=Navratri" className="hover:text-white transition">Navratri</Link></li>
              <li><Link href="/products?category=Holi" className="hover:text-white transition">Holi</Link></li>
              <li><Link href="/products?category=Ganesh Chaturthi" className="hover:text-white transition">Ganesh Chaturthi</Link></li>
              <li><Link href="/products?category=Raksha Bandhan" className="hover:text-white transition">Raksha Bandhan</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-amber-200">
              <li><span className="hover:text-white transition cursor-pointer">Contact Us</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Shipping Info</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Returns</span></li>
              <li><span className="hover:text-white transition cursor-pointer">FAQ</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-800 mt-8 pt-8 text-center text-sm text-amber-300">
          <p>&copy; {new Date().getFullYear()} Desi Saga. All rights reserved. Made with ❤️ for Indian traditions.</p>
        </div>
      </div>
    </footer>
  );
}
