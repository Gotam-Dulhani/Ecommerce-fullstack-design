"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  return (
    <div className="mx-auto max-w-lg px-6 py-24">
      <div className="text-center space-y-5">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--gold)]/10">
          <CheckCircle className="h-9 w-9 text-[var(--gold)]" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Order confirmed</h1>
        <p className="text-sm text-zinc-400">Thank you for your purchase. No payment was processed — this is a demo.</p>
        {orderId && <p className="text-xs font-mono text-zinc-500">Order ID: {orderId.slice(0, 12)}...</p>}
        <div className="flex justify-center gap-4 pt-6">
          <Link href="/products" className="rounded-full bg-[var(--gold)] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[var(--gold-dim)] transition-colors">Continue shopping</Link>
          <Link href="/" className="rounded-full border border-white/10 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:border-white/20 hover:text-white transition-colors">Home</Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-lg px-6 py-24"><div className="flex items-center justify-center gap-3 text-sm text-zinc-500"><div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-[var(--gold)]" /> Loading...</div></div>}>
      <SuccessContent />
    </Suspense>
  );
}
