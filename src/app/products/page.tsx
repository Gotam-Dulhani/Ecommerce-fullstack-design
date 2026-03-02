"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  createProduct,
  deleteAllProducts,
  fetchAllProducts,
  type Product,
} from "../../lib/products";
import { ProductCard } from "../../components/ProductCard";
import { SEED_PRODUCTS } from "../../lib/seedCatalog";
import { CategoriesSidebar } from "../../components/CategoriesSidebar";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState("all");
  const [seeding, setSeeding] = useState(false);
  const [sort, setSort] = useState<"relevance" | "price_asc" | "price_desc" | "rating">(
    "relevance",
  );

  useEffect(() => {
    void (async () => {
      try {
        const data = await fetchAllProducts();
        setProducts(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  const handleSeed = async () => {
    const ok = window.confirm(
      "Seed demo products into Firebase? This will DELETE ALL existing products first.",
    );
    if (!ok) return;

    setSeeding(true);
    try {
      await deleteAllProducts();
      for (const p of SEED_PRODUCTS) {
        await createProduct(p);
      }
      const data = await fetchAllProducts();
      setProducts(data);
    } finally {
      setSeeding(false);
    }
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ["all", ...Array.from(set)];
  }, [products]);

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      map.set(p.category, (map.get(p.category) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [products]);

  const filtered = useMemo(() => {
    const base = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === "all" || p.category.toLowerCase() === category.toLowerCase();
      return matchesSearch && matchesCategory;
    });
    if (sort === "price_asc") return [...base].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") return [...base].sort((a, b) => b.price - a.price);
    if (sort === "rating")
      return [...base].sort(
        (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
      );
    return base;
  }, [products, search, category, sort]);

  return (
    <div className="page-shell">
      <div className="grid gap-6 md:grid-cols-[260px,1fr]">
        <CategoriesSidebar
          selected={category}
          onSelect={setCategory}
          categories={categoryCounts}
        />
        <div>
          <div className="animate-fade-up rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm shadow-slate-900/5 md:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                  Shop products
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Search, filter and discover what you need.
                </p>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none ring-0 placeholder:text-slate-400 shadow-sm shadow-slate-900/5 focus:border-indigo-400 md:w-72"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none shadow-sm shadow-slate-900/5 focus:border-indigo-400 md:w-44"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === "all" ? "All categories" : c}
                    </option>
                  ))}
                </select>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none shadow-sm shadow-slate-900/5 focus:border-indigo-400 md:w-44"
                >
                  <option value="relevance">Sort: Relevance</option>
                  <option value="rating">Sort: Rating</option>
                  <option value="price_asc">Sort: Price (Low)</option>
                  <option value="price_desc">Sort: Price (High)</option>
                </select>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
              <p>
                Showing <span className="font-semibold text-slate-900">{filtered.length}</span>{" "}
                product{filtered.length === 1 ? "" : "s"}
              </p>
              <p className="hidden md:block text-slate-500">
                Smooth animations · Responsive layout
              </p>
            </div>
          </div>

          <div className="mt-5">
        {loading && (
          <p className="text-sm text-slate-500">Loading products...</p>
        )}
        {!loading && products.length === 0 && (
          <div className="animate-fade-up rounded-3xl border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600 shadow-sm shadow-slate-900/5 md:p-5">
            <p className="font-semibold text-slate-900">No products in your database yet.</p>
            <p className="mt-1 text-sm text-slate-600">
              Click below to add a complete demo catalog (with images) to Firebase.
            </p>
            <button
              type="button"
              onClick={() => void handleSeed()}
              disabled={seeding}
              className="mt-3 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-slate-900/20 hover:bg-slate-800 disabled:opacity-60 md:text-sm"
            >
              {seeding ? "Seeding demo products..." : "Seed demo products"}
            </button>
          </div>
        )}
        {!loading && products.length > 0 && filtered.length === 0 && (
          <p className="text-sm text-slate-500">
            No products found. Try adjusting your search or category.
          </p>
        )}
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}


