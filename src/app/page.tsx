"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchAllProducts, fetchFeaturedProducts, type Product } from "../lib/products";
import { ProductCard } from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/Skeleton";

const CATEGORY_IMAGES: Record<string, string> = {
  Electronics: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=600&q=80",
  Apparel: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
  Footwear: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
  Accessories: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=600&q=80",
  Home: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=600&q=80",
  Fitness: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80",
  Lifestyle: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80",
};

function TruckIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="h-5 w-5 fill-amber-400 text-amber-400" viewBox="0 0 24 24">
      <path d="M10 15.27 16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
    </svg>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [topRated, setTopRated] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
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
        setAllProducts(all);
        setTopRated(
          [...all]
            .filter((p) => typeof p.rating === "number")
            .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
            .slice(0, 8),
        );
        const catSet = new Set<string>();
        all.forEach((p) => catSet.add(p.category));
        setCategories(Array.from(catSet).slice(0, 7));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_50%,rgba(56,189,248,0.4),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(129,140,248,0.3),transparent_50%),radial-gradient(circle_at_60%_80%,rgba(236,72,153,0.2),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="animate-fade-up space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                New Season Collection
              </div>
              <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Discover
                <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent"> premium </span>
                products for your lifestyle
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">
                Curated collections, top-rated picks, and a seamless shopping experience — all in one place.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-white/10 transition hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-xl"
                >
                  Shop now
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/30 hover:bg-white/10"
                >
                  View collections
                </Link>
              </div>
            </div>
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-3">
              {allProducts.slice(0, 4).map((p, i) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className={`group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition hover:border-white/20 hover:bg-white/10 ${
                    i === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"
                  }`}
                >
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-indigo-500/20 to-pink-500/20" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-sm font-semibold text-white">{p.name}</p>
                    <p className="text-xs text-white/70">${p.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px md:grid-cols-4">
          {[
            { icon: <TruckIcon />, title: "Free Shipping", desc: "On orders over $150" },
            { icon: <ShieldIcon />, title: "Secure Payment", desc: "256-bit SSL encryption" },
            { icon: <RefreshIcon />, title: "Easy Returns", desc: "30-day return policy" },
            { icon: <HeadphonesIcon />, title: "24/7 Support", desc: "Dedicated help center" },
          ].map((badge) => (
            <div key={badge.title} className="flex items-center gap-3 px-6 py-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                {badge.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{badge.title}</p>
                <p className="text-xs text-slate-500">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Browse by</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Categories</h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              View all &rarr;
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c}
                href={`/products?q=${encodeURIComponent(c)}`}
                className="group relative overflow-hidden rounded-2xl bg-slate-100 aspect-[4/3]"
              >
                {CATEGORY_IMAGES[c] ? (
                  <img src={CATEGORY_IMAGES[c]} alt={c} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-indigo-100 to-pink-100" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-sm font-bold text-white sm:text-base">{c}</p>
                  <p className="mt-0.5 text-xs text-white/70">
                    {allProducts.filter((p) => p.category === c).length} products
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Hand-picked</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Featured products</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            View all &rarr;
          </Link>
        </div>
        {loading ? (
          <div className="mt-6"><ProductGridSkeleton count={4} /></div>
        ) : featured.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-500">No featured products yet. Add some from the admin panel.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Top rated */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Customer favorites</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Top rated</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            View all &rarr;
          </Link>
        </div>
        {loading ? (
          <div className="mt-6"><ProductGridSkeleton count={4} /></div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {topRated.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Promo banner */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-8 sm:p-12">
          <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.3),transparent_50%)]" />
          <div className="relative grid items-center gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">Limited offer</p>
              <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
                Get 10% off your first order
              </h2>
              <p className="mt-2 text-sm text-indigo-100">
                Use code <span className="font-bold text-white">WELCOME10</span> at checkout. Valid for new customers only.
              </p>
              <Link
                href="/products"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-lg shadow-indigo-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Shop the sale
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="hidden sm:flex sm:justify-end">
              <div className="text-7xl font-extrabold text-white/10">10%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">What people say</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Customer reviews</h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              name: "Sarah M.",
              text: "Amazing quality and super fast shipping! The product exceeded my expectations. Will definitely order again.",
              rating: 5,
            },
            {
              name: "James K.",
              text: "Great selection and easy checkout process. Customer service was very helpful when I had questions.",
              rating: 5,
            },
            {
              name: "Emily R.",
              text: "Love the curated collection. Everything feels premium and the packaging was beautiful too.",
              rating: 5,
            },
          ].map((review) => (
            <div key={review.name} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex gap-0.5">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">&ldquo;{review.text}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                  {review.name[0]}
                </span>
                <p className="text-sm font-semibold text-slate-900">{review.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Stay updated</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Join our newsletter
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Get the latest on new arrivals, exclusive deals, and style inspiration.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-6 flex max-w-md gap-2"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-3 text-xs text-slate-400">No spam, unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
