"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg className="h-8 w-8 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
          Order confirmed!
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Thank you for your purchase. This is a demo checkout — no payment was processed.
        </p>
        {orderId && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2">
            <span className="text-xs text-slate-500">Order ID</span>
            <span className="text-sm font-bold text-slate-900 font-mono">{orderId.slice(0, 12)}...</span>
          </div>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl"
          >
            Continue shopping
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
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
    <Suspense fallback={
      <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" /> Loading...
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
