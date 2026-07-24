"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="mx-auto max-w-lg px-4 py-16 md:px-6">
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg className="h-7 w-7 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Order confirmed</h1>
        <p className="text-sm text-gray-500">
          Thank you for your purchase. No payment was processed — this is a demo.
        </p>
        {orderId && (
          <p className="text-xs text-gray-400 font-mono">Order ID: {orderId.slice(0, 12)}...</p>
        )}
        <div className="flex justify-center gap-3 pt-4">
          <Link
            href="/products"
            className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Continue shopping
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-lg px-4 py-16 md:px-6">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-gray-600" /> Loading...
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
