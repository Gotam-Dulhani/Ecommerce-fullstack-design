"use client";

import Link from "next/link";
import { Gift } from "lucide-react";

export default function GiftCardsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 md:px-6 pt-24">
      <section className="overflow-hidden rounded-2xl border border-white/5 bg-[var(--surface)]">
        <div className="relative p-6 md:p-10">
          <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_0%_0%,rgba(212,168,83,0.4),transparent_55%),radial-gradient(circle_at_100%_0%,rgba(212,168,83,0.15),transparent_55%)]" />
          <div className="relative space-y-3 md:space-y-4">
            <div className="flex items-center gap-3">
              <Gift className="h-6 w-6 text-[var(--gold)]" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Shop</p>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Gift Cards
            </h1>
            <p className="max-w-2xl text-sm text-zinc-400 md:text-base">
              A simple way to share your favorite store. This is a demo page – no
              payment is processed, but it shows a full gift-card style layout.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[var(--gold-dim)] transition-colors"
              >
                Browse products
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-white/10 transition-colors"
              >
                Gift card FAQ (demo)
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
