"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchAllProducts, fetchFeaturedProducts, type Product } from "../lib/products";
import { ProductCard } from "../components/ProductCard";

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [topRated, setTopRated] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const [featuredData, all] = await Promise.all([
          fetchFeaturedProducts(),
          fetchAllProducts(),
        ]);
        setFeatured(featuredData);
        setTopRated(
          [...all]
            .filter((p) => typeof p.rating === "number")
            .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
            .slice(0, 8),
        );
        const set = new Set<string>();
        all.forEach((p) => set.add(p.category));
        setCategories(Array.from(set).slice(0, 10));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 md:max-w-7xl md:px-6 lg:pt-14">
      {/* Hero */}
      <section className="animate-fade-up overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/80 shadow-lg shadow-slate-900/10">
        <div className="relative grid gap-8 p-6 md:grid-cols-[1.25fr,0.95fr] md:p-10 lg:gap-10">
          <div className="absolute inset-0 opacity-90 [background:radial-gradient(circle_at_10%_10%,rgba(56,189,248,0.16),transparent_60%),radial-gradient(circle_at_90%_0%,rgba(129,140,248,0.18),transparent_60%),radial-gradient(circle_at_10%_100%,rgba(236,72,153,0.18),transparent_60%)]" />
          <div className="relative space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              New · Next.js ecommerce demo
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-[3.2rem] lg:leading-[1.02]">
              <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
                ShopNest
              </span>
              {" "}
              makes shopping feel premium.
            </h1>
            <p className="max-w-lg text-sm text-slate-600 md:text-base">
              Beautiful product cards, smooth cart + checkout, and a layout that feels like a real brand store.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-slate-900/20 transition hover:-translate-y-[1px] hover:bg-slate-800 active:translate-y-0"
              >
                Start shopping
                <span aria-hidden="true" className="ml-1.5">
                  →
                </span>
              </Link>
              <Link
                href="/cart"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/75 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm shadow-slate-900/5 hover:bg-white"
              >
                View cart
              </Link>
            </div>

            <div className="grid gap-3 pt-4 text-xs text-slate-600 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-2xl bg-white/85 px-3 py-2 shadow-sm shadow-slate-900/5">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-sky-100 text-sky-600">
                  ✓
                </span>
                <div>
                  <p className="font-semibold text-slate-900">Free shipping</p>
                  <p>On curated demo orders</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/85 px-3 py-2 shadow-sm shadow-slate-900/5">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                  ★
                </span>
                <div>
                  <p className="font-semibold text-slate-900">Top‑rated picks</p>
                  <p>See what customers love</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/85 px-3 py-2 shadow-sm shadow-slate-900/5">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-100 text-amber-600">
                  24/7
                </span>
                <div>
                  <p className="font-semibold text-slate-900">Secure checkout</p>
                  <p>Backed by modern stack</p>
                </div>
              </div>
            </div>

            {categories.length > 0 && (
              <div className="pt-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Popular categories
                  </p>
                  <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90">
                    Explore
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <Link
                      key={c}
                      href={`/products?q=${encodeURIComponent(c)}`}
                      className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm shadow-slate-900/5 hover:bg-white"
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="relative h-full rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4 shadow-xl shadow-slate-900/40 md:p-5 lg:p-6">
              <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.65),transparent_55%),radial-gradient(circle_at_100%_20%,rgba(236,72,153,0.55),transparent_55%),radial-gradient(circle_at_50%_100%,rgba(250,204,21,0.45),transparent_55%)]" />
              <div className="relative flex h-full flex-col justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Featured today
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-50">
                    Hand‑picked items from your catalog
                  </p>
                  <p className="mt-1 text-[11px] text-slate-300">
                    Updated live as you manage products in the admin dashboard.
                  </p>
                </div>

                {loading && (
                  <p className="mt-4 text-sm text-slate-300">Loading curated picks…</p>
                )}

                {!loading && featured.length === 0 && (
                  <div className="mt-4 rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 text-sm text-slate-200">
                    No featured products yet. Mark a few items as{" "}
                    <span className="font-semibold">featured</span> in your data or seed demo
                    products from{" "}
                    <Link
                      href="/products"
                      className="font-semibold text-sky-300 underline-offset-2 hover:underline"
                    >
                      /products
                    </Link>
                    .
                  </div>
                )}

                <div className="mt-3 grid grid-cols-2 gap-3">
                  {featured.slice(0, 4).map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.id}`}
                      className="group relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/80 p-3 text-left shadow-sm shadow-slate-950/50 transition hover:border-sky-400/80 hover:bg-slate-900"
                    >
                      <p className="line-clamp-2 text-xs font-semibold text-slate-50">
                        {p.name}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">{p.category}</p>
                      <p className="mt-2 text-sm font-extrabold text-sky-300">
                        ${p.price.toFixed(2)}
                      </p>
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 [background:radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.35),transparent_55%),radial-gradient(circle_at_100%_0%,rgba(236,72,153,0.35),transparent_55%)]" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top rated */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 md:text-xl">
              Top rated
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Popular picks based on ratings
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-indigo-700 hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {topRated.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
