"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="page-shell max-w-4xl">
      <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-900/5 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Success
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
          Your order has been placed (demo)
        </h1>
        {orderId && (
          <p className="mt-2 text-sm text-zinc-600">
            Order ID: <span className="font-medium text-zinc-900">{orderId}</span>
          </p>
        )}
        <p className="mt-2 text-sm text-zinc-600">
          This is a demo checkout flow. No payment was processed.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex items-center rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-zinc-900"
          >
            Continue shopping
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Go to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="page-shell max-w-4xl"><p className="text-sm text-slate-500">Loading...</p></div>}>
      <SuccessContent />
    </Suspense>
  );
}
