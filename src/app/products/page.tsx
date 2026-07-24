"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createProduct, deleteAllProducts, fetchAllProducts, type Product } from "../../lib/products";
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
  const [sort, setSort] = useState<"relevance" | "price_asc" | "price_desc" | "rating">("relevance");

  useEffect(() => {
    void (async () => {
      try {
        let data = await fetchAllProducts();
        if (data.length === 0) {
          await fetch("/api/seed", { method: "POST" });
          data = await fetchAllProducts();
        } else if (data.some((p) => !p.image)) {
          await fetch("/api/seed?force=true", { method: "POST" });
          data = await fetchAllProducts();
        }
        setProducts(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => { setSearch(searchParams.get("q") ?? ""); }, [searchParams]);

  const handleSeed = async () => {
    if (!window.confirm("Seed demo products? This replaces all existing products.")) return;
    setSeeding(true);
    try {
      await deleteAllProducts();
      for (const p of SEED_PRODUCTS) await createProduct(p);
      setProducts(await fetchAllProducts());
    } finally { setSeeding(false); }
  };

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [products]);

  const filtered = useMemo(() => {
    const base = products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "all" || p.category.toLowerCase() === category.toLowerCase();
      return matchSearch && matchCat;
    });
    if (sort === "price_asc") return [...base].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") return [...base].sort((a, b) => b.price - a.price);
    if (sort === "rating") return [...base].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return base;
  }, [products, search, category, sort]);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">
      <div className="grid gap-8 md:grid-cols-[220px,1fr]">
        <CategoriesSidebar selected={category} onSelect={setCategory} categories={categoryCounts} />
        <div>
          {/* Header bar */}
          <div className="rounded-2xl border border-[var(--gray-100)] bg-white p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-[22px] font-bold tracking-[-0.02em] text-[var(--gray-900)]">Shop</h1>
                <p className="mt-0.5 text-[13px] text-[var(--gray-400)]">{filtered.length} product{filtered.length === 1 ? "" : "s"}</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border border-[var(--gray-200)] bg-[var(--gray-50)] px-4 py-2.5 text-[13px] outline-none focus:border-[var(--gray-900)] sm:w-56"
                />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="w-full rounded-full border border-[var(--gray-200)] bg-[var(--gray-50)] px-4 py-2.5 text-[13px] outline-none focus:border-[var(--gray-900)] sm:w-auto"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Rating</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="mt-6">
            {loading && <p className="text-[13px] text-[var(--gray-400)]">Loading...</p>}
            {!loading && products.length === 0 && (
              <div className="rounded-2xl border border-[var(--gray-100)] bg-white p-10 text-center">
                <p className="text-[15px] font-medium text-[var(--gray-900)]">No products yet.</p>
                <p className="mt-1 text-[13px] text-[var(--gray-400)]">Seed demo products to get started.</p>
                <button type="button" onClick={() => void handleSeed()} disabled={seeding}
                  className="mt-5 rounded-full bg-[var(--gray-900)] px-6 py-2.5 text-[13px] font-semibold text-white hover:bg-[var(--gray-700)] disabled:opacity-50 transition-colors"
                >
                  {seeding ? "Seeding..." : "Seed products"}
                </button>
              </div>
            )}
            {!loading && products.length > 0 && filtered.length === 0 && (
              <p className="text-[13px] text-[var(--gray-400)]">No products found. Try adjusting your search.</p>
            )}
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
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
    <Suspense fallback={<div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10"><p className="text-[13px] text-[var(--gray-400)]">Loading...</p></div>}>
      <ProductsContent />
    </Suspense>
  );
}
