"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchAllProducts, type Product } from "../lib/products";
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

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        let all = await fetchAllProducts();
        if (all.length === 0) {
          await fetch("/api/seed", { method: "POST" });
          all = await fetchAllProducts();
        } else if (all.some((p) => !p.image)) {
          await fetch("/api/seed?force=true", { method: "POST" });
          all = await fetchAllProducts();
        }
        setFeatured(all.filter((p) => p.featured).slice(0, 4));
        setAllProducts(all);
        const catSet = new Set<string>();
        all.forEach((p) => catSet.add(p.category));
        setCategories(Array.from(catSet));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[var(--gray-900)] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(217,119,6,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-[1400px] px-6 py-24 sm:py-32 lg:px-10 lg:py-40">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--amber)]">New collection</p>
            <h1 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.95] tracking-[-0.04em] text-white">
              Designed for
              <br />
              <span className="text-[var(--gray-400)]">everyday life.</span>
            </h1>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-[var(--gray-400)]">
              Curated essentials — premium materials, clean design, no compromises. Everything you need, nothing you don&apos;t.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-[13px] font-bold uppercase tracking-[0.1em] text-[var(--gray-900)] hover:bg-[var(--gray-100)] transition-colors"
              >
                Shop now
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center rounded-full border border-[var(--gray-700)] px-8 py-3.5 text-[13px] font-bold uppercase tracking-[0.1em] text-[var(--gray-300)] hover:border-[var(--gray-500)] hover:text-white transition-colors"
              >
                View all
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-6 pt-20 lg:px-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--amber)]">Browse</p>
              <h2 className="mt-2 text-[28px] font-bold tracking-[-0.02em] text-[var(--gray-900)]">Categories</h2>
            </div>
            <Link href="/products" className="text-[13px] font-semibold text-[var(--gray-400)] hover:text-[var(--gray-900)] transition-colors">
              View all &rarr;
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c}
                href={`/products?q=${encodeURIComponent(c)}`}
                className="group relative aspect-[3/4] overflow-hidden bg-[var(--gray-100)]"
              >
                {CATEGORY_IMAGES[c] ? (
                  <img src={CATEGORY_IMAGES[c]} alt={c} className="block transition-transform duration-700 ease-out group-hover:scale-110" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
                ) : (
                  <div className="h-full w-full bg-[var(--gray-100)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-[17px] font-bold text-white">{c}</p>
                  <p className="mt-1 text-[12px] font-medium text-white/60">
                    {allProducts.filter((p) => p.category === c).length} products
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      <section className="mx-auto max-w-[1400px] px-6 pt-20 lg:px-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--amber)]">Hand-picked</p>
            <h2 className="mt-2 text-[28px] font-bold tracking-[-0.02em] text-[var(--gray-900)]">Featured</h2>
          </div>
          <Link href="/products" className="text-[13px] font-semibold text-[var(--gray-400)] hover:text-[var(--gray-900)] transition-colors">
            View all &rarr;
          </Link>
        </div>
        {loading ? (
          <div className="mt-8"><ProductGridSkeleton count={4} /></div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* All products */}
      <section className="mx-auto max-w-[1400px] px-6 pt-20 pb-24 lg:px-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--amber)]">Explore</p>
            <h2 className="mt-2 text-[28px] font-bold tracking-[-0.02em] text-[var(--gray-900)]">All Products</h2>
          </div>
          <Link href="/products" className="text-[13px] font-semibold text-[var(--gray-400)] hover:text-[var(--gray-900)] transition-colors">
            View all &rarr;
          </Link>
        </div>
        {loading ? (
          <div className="mt-8"><ProductGridSkeleton count={8} /></div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
            {allProducts.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
