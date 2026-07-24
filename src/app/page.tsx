"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchAllProducts, type Product } from "../lib/products";
import { ProductCard } from "../components/ProductCard";
import { Skeleton } from "../components/Skeleton";
import { ArrowRight } from "lucide-react";

const CATEGORY_IMAGES: Record<string, string> = {
  Electronics: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=600&q=80",
  Clothing: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
  Footwear: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
  Accessories: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=600&q=80",
  Home: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=600&q=80",
  Sports: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80",
  Beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
  Lifestyle: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80",
};

function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[4/5] w-full rounded-xl" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}

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
      <section className="relative overflow-hidden bg-[var(--background)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,168,83,0.06),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">New collection</p>
            <h1 className="mt-4 text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight text-white">
              Designed for
              <br />
              <span className="text-zinc-500">everyday life.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-400">
              Curated essentials — premium materials, clean design, no compromises. Everything you need, nothing you don&apos;t.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[var(--gold-dim)] transition-colors"
              >
                Shop now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center rounded-full border border-white/10 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:border-white/20 hover:text-white transition-colors"
              >
                View all
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">Browse</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">Categories</h2>
            </div>
            <Link href="/products" className="text-xs font-semibold text-zinc-500 hover:text-white transition-colors">
              View all &rarr;
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c}
                href={`/products?category=${encodeURIComponent(c)}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-[var(--surface)] border border-white/5"
              >
                {CATEGORY_IMAGES[c] ? (
                  <img src={CATEGORY_IMAGES[c]} alt={c} className="block transition-transform duration-700 ease-out group-hover:scale-110" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
                ) : (
                  <div className="h-full w-full bg-[var(--surface)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-base font-bold text-white">{c}</p>
                  <p className="mt-1 text-xs font-medium text-white/50">
                    {allProducts.filter((p) => p.category === c).length} products
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">Hand-picked</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">Featured</h2>
          </div>
          <Link href="/products" className="text-xs font-semibold text-zinc-500 hover:text-white transition-colors">
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
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">Explore</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">All Products</h2>
          </div>
          <Link href="/products" className="text-xs font-semibold text-zinc-500 hover:text-white transition-colors">
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
