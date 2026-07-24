"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
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

function ProductsContent() {
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
        let data = await fetchAllProducts();
        if (data.length === 0) {
          await fetch("/api/seed", { method: "POST" });
          data = await fetchAllProducts();
        }
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
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <div className="grid gap-6 md:grid-cols-[220px,1fr]">
        <CategoriesSidebar
          selected={category}
          onSelect={setCategory}
          categories={categoryCounts}
        />
        <div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Shop</h1>
                <p className="text-sm text-gray-500">
                  {filtered.length} product{filtered.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-400 md:w-56"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-400 md:w-40"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === "all" ? "All categories" : c}
                    </option>
                  ))}
                </select>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-400 md:w-40"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Rating</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4">
            {loading && (
              <p className="text-sm text-gray-500">Loading products...</p>
            )}
            {!loading && products.length === 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
                <p className="text-sm font-medium text-gray-900">No products yet.</p>
                <p className="mt-1 text-sm text-gray-500">
                  Click below to add demo products to Firebase.
                </p>
                <button
                  type="button"
                  onClick={() => void handleSeed()}
                  disabled={seeding}
                  className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {seeding ? "Seeding..." : "Seed demo products"}
                </button>
              </div>
            )}
            {!loading && products.length > 0 && filtered.length === 0 && (
              <p className="text-sm text-gray-500">
                No products found. Try adjusting your search.
              </p>
            )}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-6 md:px-6"><p className="text-sm text-gray-500">Loading...</p></div>}>
      <ProductsContent />
    </Suspense>
  );
}
