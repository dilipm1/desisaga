import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import FestivalHero from "@/components/FestivalHero";
import YearCalendar from "@/components/YearCalendar";
import Reveal from "@/components/Reveal";
import { Flame, CalendarClock, Gift, Truck, Heart } from "lucide-react";

const RITUALS = [
  {
    icon: <Flame className="w-5 h-5" />,
    title: "Every item ritual-ready",
    desc: "Each piece is checked for the ritual it belongs to — diyas that light, rakhis that tie, camphor that burns — before it is packed.",
  },
  {
    icon: <CalendarClock className="w-5 h-5" />,
    title: "Delivered before the celebration",
    desc: "We watch the festival date, not just the address. Hampers arrive in time to be offered, opened, and shared.",
  },
  {
    icon: <Gift className="w-5 h-5" />,
    title: "Packed like a shagun",
    desc: "Wrapped as a gift and ready to hand over, with a card written in your words for the family receiving it.",
  },
];

export default function Home() {
  const featured = getFeaturedProducts();

  return (
    <div>
      <FestivalHero />

      <YearCalendar />

      {/* Featured hampers */}
      <section className="border-t border-line/60 bg-gradient-to-b from-night to-ember/40 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="flex items-end justify-between gap-8 mb-12">
              <div className="max-w-xl">
                <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.25em] text-flame mb-4">
                  This season
                </p>
                <h2 className="font-display text-4xl md:text-5xl leading-tight text-parchment">
                  Hampers for the season
                </h2>
                <p className="mt-5 text-parchment-dim leading-relaxed">
                  Handpicked best sellers — ready to pick, quick to send.
                </p>
              </div>
              <Link
                href="/products"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-parchment-dim hover:text-flame transition-colors shrink-0"
              >
                View all hampers →
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((product, i) => (
              <Reveal key={product.id} delay={i * 90}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>

          <Link
            href="/products"
            className="sm:hidden mt-10 inline-flex items-center gap-2 text-sm font-medium text-parchment-dim hover:text-flame transition-colors"
          >
            View all hampers →
          </Link>
        </div>
      </section>

      {/* Built for the ritual */}
      <section className="relative py-24 md:py-32 bg-night rangoli-pattern">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl mb-14">
              <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.25em] text-flame mb-4">
                Built for the ritual
              </p>
              <h2 className="font-display text-4xl md:text-5xl leading-tight text-parchment">
                A hamper should hold its place in the ceremony.
              </h2>
              <p className="mt-5 text-parchment-dim leading-relaxed">
                Not a box of generic goodies — every Desi Saga hamper is assembled
                around the ritual it&rsquo;s meant for.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {RITUALS.map((item, i) => (
              <Reveal key={item.title} delay={i * 110}>
                <div className="h-full rounded-lg border border-line bg-ember p-7 hover:border-flame/40 transition-colors">
                  <div className="w-11 h-11 rounded-md bg-ember-light border border-line flex items-center justify-center text-flame mb-6">
                    {item.icon}
                  </div>
                  <h3 className="font-display text-xl text-parchment mb-3">{item.title}</h3>
                  <p className="text-sm text-parchment-dim leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-t border-line/60 bg-ember/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-sm text-parchment-dim">
            <div className="flex items-center gap-2">
              <span className="text-flame">★★★★★</span>
              <span>4.9 / 5 from 500+ families</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-kumkum" />
              <span>500+ hampers delivered</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-flame" />
              <span>Free shipping over ₹999</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
