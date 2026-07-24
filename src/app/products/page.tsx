"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createProduct, deleteAllProducts, fetchAllProducts, type Product } from "../../lib/products";
import { ProductCard } from "../../components/ProductCard";
import { SEED_PRODUCTS, SEED_VERSION } from "../../lib/seedCatalog";
import { Search, X, ArrowLeft, SlidersHorizontal, ChevronDown } from "lucide-react";

const CATEGORY_BANNERS: Record<string, { image: string; tagline: string }> = {
  Electronics: {
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1200&q=80",
    tagline: "Cutting-edge tech for modern life",
  },
  Clothing: {
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    tagline: "Style that speaks for itself",
  },
  Footwear: {
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    tagline: "Step into something extraordinary",
  },
  Accessories: {
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
    tagline: "The details that define you",
  },
  Home: {
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200&q=80",
    tagline: "Spaces that inspire",
  },
  Beauty: {
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
    tagline: "Your glow-up starts here",
  },
  Sports: {
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80",
    tagline: "Gear up, level up",
  },
  Lifestyle: {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    tagline: "Live well, live beautifully",
  },
};

const SORT_OPTIONS = [
  { value: "relevance", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "all");
  const [seeding, setSeeding] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [view, setView] = useState<"banner" | "grid">("banner");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        let data = await fetchAllProducts();
        const needsReseed =
          data.length === 0 ||
          data.some((p) => !p.image) ||
          data.some((p: any) => p.seedVersion !== SEED_VERSION);
        if (needsReseed) {
          await fetch("/api/seed?force=true", { method: "POST" });
          data = await fetchAllProducts();
        }
        setProducts(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const cat = searchParams.get("category") ?? "all";
    setSearch(q);
    setCategory(cat);
    if (cat !== "all") setView("grid");
  }, [searchParams]);

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
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "all" || p.category.toLowerCase() === category.toLowerCase();
      return matchSearch && matchCat;
    });
    if (sort === "price_asc") return [...base].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") return [...base].sort((a, b) => b.price - a.price);
    if (sort === "rating") return [...base].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    if (sort === "newest") return [...base].reverse();
    return base;
  }, [products, search, category, sort]);

  const selectCategory = (cat: string) => {
    setCategory(cat);
    setView("grid");
    router.push(cat === "all" ? "/products" : `/products?category=${encodeURIComponent(cat)}`, { scroll: false });
  };

  const clearFilters = () => {
    setCategory("all");
    setSearch("");
    setSort("relevance");
    setView("banner");
    router.push("/products", { scroll: false });
  };

  const activeCategoryName = category !== "all" ? category : null;

  return (
    <div className="min-h-screen pt-16">
      {/* ─── HERO when no category selected ─── */}
      {view === "banner" && category === "all" && !search && (
        <section className="relative overflow-hidden bg-[var(--background)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,168,83,0.06),transparent_60%)]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">Browse by category</p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight text-white">
              Find what you love.
            </h1>
            <p className="mt-4 max-w-md mx-auto text-sm text-zinc-400">
              Explore our curated collection — {products.length} premium products across {categoryCounts.length} categories.
            </p>
          </div>
        </section>
      )}

      {/* ─── CATEGORY BANNERS ─── */}
      {view === "banner" && category === "all" && !search && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="skeleton aspect-[16/10] rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categoryCounts.map((c) => {
                const banner = CATEGORY_BANNERS[c.name];
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => selectCategory(c.name)}
                    className="group relative aspect-[16/10] overflow-hidden rounded-xl bg-[var(--surface)] border border-white/5 cursor-pointer text-left transition-all hover:border-[var(--gold)]/30 hover:shadow-lg hover:shadow-[var(--gold)]/5"
                  >
                    {banner?.image ? (
                      <img
                        src={banner.image}
                        alt={c.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        style={{ height: "100%", width: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[var(--surface)]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--gold)]">
                        {c.count} products
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-white group-hover:text-[var(--gold)] transition-colors">
                        {c.name}
                      </h3>
                      {banner?.tagline && (
                        <p className="mt-0.5 text-xs text-zinc-400 line-clamp-1">{banner.tagline}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ─── GRID VIEW (after category selected or search) ─── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Category hero banner */}
        {activeCategoryName && CATEGORY_BANNERS[activeCategoryName] && (
          <div className="relative mb-8 aspect-[21/5] sm:aspect-[3/1] overflow-hidden rounded-2xl bg-[var(--surface)]">
            <img
              src={CATEGORY_BANNERS[activeCategoryName].image}
              alt={activeCategoryName}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ height: "100%", width: "100%", objectFit: "cover" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-center p-6 sm:p-10">
              <div>
                <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors mb-3">
                  <ArrowLeft className="h-3.5 w-3.5" /> All categories
                </button>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">{activeCategoryName}</h2>
                <p className="mt-1 text-sm text-zinc-400">{CATEGORY_BANNERS[activeCategoryName].tagline}</p>
                <p className="mt-2 text-xs text-zinc-500">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search + filter bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {activeCategoryName && (
              <button type="button" onClick={clearFilters} className="lg:hidden inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 transition-colors">
                <X className="h-3 w-3" /> {activeCategoryName}
              </button>
            )}
            {!activeCategoryName && (
              <h2 className="text-lg font-bold tracking-tight text-white">
                {search ? `Results for "${search}"` : "All Products"}
              </h2>
            )}
            {activeCategoryName && (
              <h2 className="text-lg font-bold tracking-tight text-white hidden sm:block">
                {activeCategoryName}
              </h2>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-xs text-white placeholder:text-zinc-500 focus:border-[var(--gold)]/50 focus:outline-none transition-colors sm:w-64"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none rounded-full border border-white/10 bg-white/5 px-4 py-2.5 pr-8 text-xs text-white focus:border-[var(--gold)]/50 focus:outline-none transition-colors cursor-pointer"
                style={{ colorScheme: "dark" }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-[#18181b] text-white">{o.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-500" />
            </div>

            {/* Mobile filters toggle */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-zinc-300 hover:bg-white/10 transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
            </button>
          </div>
        </div>

        {/* Mobile category pills */}
        {mobileFiltersOpen && (
          <div className="mt-4 lg:hidden overflow-x-auto no-scrollbar">
            <div className="flex gap-2 pb-2">
              <button type="button" onClick={() => selectCategory("all")} className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all ${category === "all" ? "bg-[var(--gold)] text-black" : "border border-white/10 text-zinc-400 hover:text-white"}`}>
                All
              </button>
              {categoryCounts.map((c) => (
                <button key={c.name} type="button" onClick={() => selectCategory(c.name)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all ${category === c.name ? "bg-[var(--gold)] text-black" : "border border-white/10 text-zinc-400 hover:text-white"}`}>
                  {c.name} ({c.count})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Desktop category sidebar — only show in grid view */}
        {view === "grid" && (
          <div className="mt-6 hidden lg:block">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => selectCategory("all")} className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${category === "all" ? "bg-[var(--gold)] text-black" : "border border-white/10 text-zinc-400 hover:text-white hover:border-white/20"}`}>
                All
              </button>
              {categoryCounts.map((c) => (
                <button key={c.name} type="button" onClick={() => selectCategory(c.name)} className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${category === c.name ? "bg-[var(--gold)] text-black" : "border border-white/10 text-zinc-400 hover:text-white hover:border-white/20"}`}>
                  {c.name}
                  <span className={`ml-1.5 text-[10px] ${category === c.name ? "text-black/50" : "text-zinc-600"}`}>{c.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="mt-6">
          {loading && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i}>
                  <div className="skeleton aspect-[4/5] w-full rounded-xl" />
                  <div className="mt-3 space-y-2">
                    <div className="skeleton h-3 w-16 rounded" />
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-4 w-14 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="rounded-xl border border-white/5 bg-[var(--surface)] p-10 text-center">
              <p className="text-sm font-medium text-white">No products yet.</p>
              <p className="mt-1 text-xs text-zinc-500">Seed demo products to get started.</p>
              <button type="button" onClick={() => void handleSeed()} disabled={seeding}
                className="mt-5 rounded-full bg-[var(--gold)] px-6 py-2.5 text-xs font-bold text-black hover:bg-[var(--gold-dim)] disabled:opacity-50 transition-colors"
              >
                {seeding ? "Seeding..." : "Seed products"}
              </button>
            </div>
          )}

          {!loading && products.length > 0 && filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm font-medium text-white">No products found</p>
              <p className="mt-1 text-xs text-zinc-500">Try adjusting your search or filters.</p>
              <button type="button" onClick={clearFilters} className="mt-4 text-xs font-semibold text-[var(--gold)] hover:underline">
                Clear all filters
              </button>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 pt-24">
          <div className="skeleton h-10 w-64 rounded-lg mb-4" />
          <div className="skeleton h-4 w-96 rounded-lg" />
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
