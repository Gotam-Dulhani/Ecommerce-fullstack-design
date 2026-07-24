"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  return (
    <div className="mx-auto max-w-lg px-6 py-24">
      <div className="text-center space-y-5">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--green-light)]">
          <svg className="h-9 w-9 text-[var(--green)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[var(--gray-900)]">Order confirmed</h1>
        <p className="text-[15px] text-[var(--gray-400)]">Thank you for your purchase. No payment was processed — this is a demo.</p>
        {orderId && <p className="text-[12px] font-mono text-[var(--gray-400)]">Order ID: {orderId.slice(0, 12)}...</p>}
        <div className="flex justify-center gap-4 pt-6">
          <Link href="/products" className="rounded-full bg-[var(--gray-900)] px-8 py-3.5 text-[13px] font-bold uppercase tracking-[0.1em] text-white hover:bg-[var(--gray-700)] transition-colors">Continue shopping</Link>
          <Link href="/" className="rounded-full border border-[var(--gray-200)] px-8 py-3.5 text-[13px] font-bold uppercase tracking-[0.1em] text-[var(--gray-600)] hover:border-[var(--gray-400)] transition-colors">Home</Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-lg px-6 py-24"><div className="flex items-center justify-center gap-3 text-[13px] text-[var(--gray-400)]"><div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--gray-200)] border-t-[var(--gray-600)]" /> Loading...</div></div>}>
      <SuccessContent />
    </Suspense>
  );
}
