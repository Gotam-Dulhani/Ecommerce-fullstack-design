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
      <section className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">New Season</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Products built for everyday life.
            </h1>
            <p className="mt-4 max-w-lg text-base text-gray-400">
              Curated essentials — quality materials, clean design, no compromises.
            </p>
            <div className="mt-8 flex gap-3">
              <Link
                href="/products"
                className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-medium text-gray-950 hover:bg-gray-100 transition-colors"
              >
                Shop now
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center rounded-lg border border-gray-700 px-6 py-3 text-sm font-medium text-white hover:border-gray-500 transition-colors"
              >
                View all
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {[
            { title: "Free Shipping", desc: "Orders over $150" },
            { title: "Secure Payment", desc: "SSL encrypted" },
            { title: "Easy Returns", desc: "30-day policy" },
            { title: "24/7 Support", desc: "We're here to help" },
          ].map((badge) => (
            <div key={badge.title} className="border-r border-gray-100 px-6 py-4 last:border-r-0">
              <p className="text-sm font-medium text-gray-900">{badge.title}</p>
              <p className="text-xs text-gray-500">{badge.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">Categories</h2>
            <Link href="/products" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              View all
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c}
                href={`/products?q=${encodeURIComponent(c)}`}
                className="group relative overflow-hidden bg-gray-100 aspect-[4/3]"
              >
                {CATEGORY_IMAGES[c] ? (
                  <img src={CATEGORY_IMAGES[c]} alt={c} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="h-full w-full bg-gray-200" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-sm font-medium text-white">{c}</p>
                  <p className="text-xs text-white/70">
                    {allProducts.filter((p) => p.category === c).length} products
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">Featured</h2>
          <Link href="/products" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="mt-6"><ProductGridSkeleton count={4} /></div>
        ) : featured.length === 0 ? (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-sm text-gray-500">No featured products yet.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* All products preview */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-16 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">All Products</h2>
          <Link href="/products" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="mt-6"><ProductGridSkeleton count={8} /></div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {allProducts.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
