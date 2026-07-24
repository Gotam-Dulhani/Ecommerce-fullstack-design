"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAllProducts, fetchProductById, type Product } from "../../../lib/products";
import { useCart } from "../../../context/CartContext";
import { RatingStars } from "../../../components/RatingStars";
import { ProductCard } from "../../../components/ProductCard";

function TruckIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14" /></svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
  );
}

function CartIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    void (async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
        if (data) {
          const all = await fetchAllProducts();
          setRelated(
            all
              .filter((p) => p.id !== data.id && p.category === data.category)
              .slice(0, 4)
          );
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [params]);

  if (!loading && !product) notFound();

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 pt-12 md:px-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
          Loading product...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-16 md:px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="transition hover:text-slate-900">Home</Link>
        <span>/</span>
        <Link href="/products" className="transition hover:text-slate-900">Products</Link>
        <span>/</span>
        <Link href={`/products?q=${encodeURIComponent(product.category)}`} className="transition hover:text-slate-900">{product.category}</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.2fr,1fr] lg:items-start">
        {/* Image */}
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-50 to-pink-50">
                <span className="text-sm font-medium text-slate-300">No image available</span>
              </div>
            )}
            {product.featured && (
              <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">{product.category}</p>
            <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>
          </div>

          {typeof product.rating === "number" ? (
            <RatingStars rating={product.rating} count={product.ratingCount} size="md" />
          ) : (
            <p className="text-xs text-slate-400">No ratings yet</p>
          )}

          <p className="text-base leading-relaxed text-slate-600">
            {product.description}
          </p>

          {/* Price + stock */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-900">${product.price.toFixed(2)}</span>
            {typeof product.stock === "number" && product.stock > 0 && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                In stock ({product.stock})
              </span>
            )}
            {typeof product.stock === "number" && product.stock <= 0 && (
              <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-600">
                Out of stock
              </span>
            )}
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center text-slate-400 transition hover:text-slate-900"
                aria-label="Decrease quantity"
              >
                <MinusIcon />
              </button>
              <span className="w-10 text-center text-sm font-bold text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(product?.stock ?? 99, quantity + 1))}
                className="flex h-10 w-10 items-center justify-center text-slate-400 transition hover:text-slate-900"
                aria-label="Increase quantity"
              >
                <PlusIcon />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                addToCart(product, quantity);
                setAdded(true);
                setTimeout(() => setAdded(false), 1500);
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl active:translate-y-0 sm:flex-none"
            >
              {added ? (
                <>
                  <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  Added to cart!
                </>
              ) : (
                <>
                  <CartIcon />
                  Add to cart
                </>
              )}
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-1 gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-slate-600">
              <TruckIcon />
              <div>
                <p className="text-xs font-semibold text-slate-900">Free shipping</p>
                <p className="text-[11px] text-slate-500">Orders over $150</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <ShieldIcon />
              <div>
                <p className="text-xs font-semibold text-slate-900">Secure checkout</p>
                <p className="text-[11px] text-slate-500">SSL encrypted</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <RefreshIcon />
              <div>
                <p className="text-xs font-semibold text-slate-900">Easy returns</p>
                <p className="text-[11px] text-slate-500">30-day policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">You may also like</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Related products</h2>
            </div>
            <Link href={`/products?q=${encodeURIComponent(product.category)}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              View all &rarr;
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
