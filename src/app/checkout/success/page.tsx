import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white">
      <div className="max-w-lg mx-auto px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">Order Confirmed</h1>
        <p className="text-muted leading-relaxed mb-10 max-w-sm mx-auto">
          Thank you for your order. Your festive hamper is being prepared and will be shipped soon.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products" className="inline-flex items-center justify-center gap-2 bg-foreground text-white font-semibold px-8 py-3.5 text-sm hover:bg-neutral-800 transition-colors">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/" className="inline-flex items-center justify-center border border-border text-foreground font-semibold px-8 py-3.5 text-sm hover:bg-neutral-50 transition-colors">
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}