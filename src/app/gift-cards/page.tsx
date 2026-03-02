"use client";

import Link from "next/link";

export default function GiftCardsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 md:px-6">
      <section className="animate-fade-up overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/80 shadow-sm shadow-slate-900/5">
        <div className="relative p-6 md:p-10">
          <div className="absolute inset-0 opacity-80 [background:radial-gradient(circle_at_0%_0%,rgba(129,140,248,0.3),transparent_55%),radial-gradient(circle_at_100%_0%,rgba(236,72,153,0.35),transparent_55%)]" />
          <div className="relative space-y-3 md:space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Shop
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Gift Cards
            </h1>
            <p className="max-w-2xl text-sm text-slate-700 md:text-base">
              A simple way to share your favorite store. This is a demo page – no
              payment is processed, but it shows a full gift-card style layout.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-slate-900/20 hover:bg-slate-800"
              >
                Browse products
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/70 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm shadow-slate-900/5 hover:bg-white"
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


