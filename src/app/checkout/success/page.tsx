import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Sparkle, AnimatedDiya } from "@/components/FestiveHero";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-warm-cream">
      <div className="max-w-lg mx-auto px-6 text-center">
        <div className="flex justify-center gap-2 mb-6">
          <AnimatedDiya size={32} delay={0} />
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-festive-green to-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <AnimatedDiya size={32} delay={0.3} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-parchment mb-4">Order Confirmed</h1>
        <div className="festive-divider mx-auto w-32 mb-4" />
        <p className="text-muted leading-relaxed mb-10 max-w-sm mx-auto">
          Thank you for your order. Your festive hamper is being prepared with love and will be shipped soon.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products" className="inline-flex items-center justify-center gap-2 bg-flame text-night font-semibold px-8 py-3.5 text-sm hover:bg-marigold transition-all rounded-md warm-shadow">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/" className="inline-flex items-center justify-center border border-line text-parchment-dim font-semibold px-8 py-3.5 text-sm hover:border-flame/60 hover:text-parchment transition-colors rounded-md">
            <Sparkle className="w-3 h-3 text-flame mr-1" />
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
