import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Order Confirmed!
      </h1>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Thank you for your order. Your festive hamper is being prepared and will
        be shipped soon. You&apos;ll receive a confirmation email with tracking details.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-full transition"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="border border-amber-200 text-amber-700 font-semibold px-8 py-3 rounded-full hover:bg-amber-50 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
