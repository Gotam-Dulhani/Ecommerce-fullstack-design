"use client";

import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAllProducts, fetchProductById, type Product } from "../../../lib/products";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { RatingStars } from "../../../components/RatingStars";
import { ProductCard } from "../../../components/ProductCard";

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    void (async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
        if (data) {
          const all = await fetchAllProducts();
          setRelated(all.filter((p) => p.id !== data.id && p.category === data.category).slice(0, 4));
        }
      } finally { setLoading(false); }
    })();
  }, [params]);

  if (!loading && !product) notFound();
  if (!product) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
        <div className="flex items-center gap-3 text-[13px] text-[var(--gray-400)]">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--gray-200)] border-t-[var(--gray-600)]" />
          Loading...
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) { router.push("/auth/login"); return; }
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[12px] text-[var(--gray-400)] mb-8">
        <Link href="/" className="hover:text-[var(--gray-900)] transition-colors">Home</Link>
        <span className="text-[var(--gray-300)]">/</span>
        <Link href="/products" className="hover:text-[var(--gray-900)] transition-colors">Shop</Link>
        <span className="text-[var(--gray-300)]">/</span>
        <Link href={`/products?q=${encodeURIComponent(product.category)}`} className="hover:text-[var(--gray-900)] transition-colors">{product.category}</Link>
        <span className="text-[var(--gray-300)]">/</span>
        <span className="text-[var(--gray-900)] font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[1.3fr,1fr] lg:items-start">
        {/* Image */}
        <div className="overflow-hidden bg-[var(--gray-50)]">
          <div className="relative aspect-[4/5] w-full">
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-[13px] text-[var(--gray-300)]">No image</span>
              </div>
            )}
            {product.featured && (
              <span className="absolute left-4 top-4 rounded-full bg-[var(--amber)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6 lg:sticky lg:top-28">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--gray-400)]">{product.category}</p>
            <h1 className="mt-2 text-[28px] font-bold tracking-[-0.02em] text-[var(--gray-900)] sm:text-[36px]">
              {product.name}
            </h1>
          </div>

          {typeof product.rating === "number" ? (
            <RatingStars rating={product.rating} count={product.ratingCount} size="md" />
          ) : (
            <p className="text-[12px] text-[var(--gray-400)]">No ratings yet</p>
          )}

          <p className="text-[15px] leading-relaxed text-[var(--gray-500)]">
            {product.description}
          </p>

          <div className="flex items-baseline gap-4">
            <span className="text-[32px] font-bold tracking-[-0.02em] text-[var(--gray-900)]">${product.price.toFixed(2)}</span>
            {typeof product.stock === "number" && product.stock > 0 && (
              <span className="rounded-full bg-[var(--green-light)] px-3 py-1 text-[12px] font-semibold text-[var(--green)]">
                In stock ({product.stock})
              </span>
            )}
            {typeof product.stock === "number" && product.stock <= 0 && (
              <span className="rounded-full bg-[var(--red-light)] px-3 py-1 text-[12px] font-semibold text-[var(--red)]">
                Out of stock
              </span>
            )}
          </div>

          {/* Quantity + CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center rounded-full border border-[var(--gray-200)] bg-white">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-12 w-12 items-center justify-center text-[var(--gray-400)] hover:text-[var(--gray-900)] transition-colors"
                aria-label="Decrease quantity">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /></svg>
              </button>
              <span className="w-10 text-center text-[15px] font-semibold text-[var(--gray-900)]">{quantity}</span>
              <button type="button" onClick={() => setQuantity(Math.min(product?.stock ?? 99, quantity + 1))}
                className="flex h-12 w-12 items-center justify-center text-[var(--gray-400)] hover:text-[var(--gray-900)] transition-colors"
                aria-label="Increase quantity">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
              </button>
            </div>
            <button type="button" onClick={handleAddToCart}
              className="flex-1 rounded-full bg-[var(--gray-900)] py-3.5 px-8 text-[13px] font-bold uppercase tracking-[0.1em] text-white hover:bg-[var(--gray-700)] transition-colors sm:flex-none"
            >
              {added ? "Added to cart" : "Add to cart"}
            </button>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-3 gap-4 rounded-2xl border border-[var(--gray-100)] bg-[var(--gray-50)] p-5">
            <div className="text-center">
              <p className="text-[12px] font-semibold text-[var(--gray-900)]">Free shipping</p>
              <p className="text-[11px] text-[var(--gray-400)]">Over $150</p>
            </div>
            <div className="text-center">
              <p className="text-[12px] font-semibold text-[var(--gray-900)]">Secure</p>
              <p className="text-[11px] text-[var(--gray-400)]">SSL encrypted</p>
            </div>
            <div className="text-center">
              <p className="text-[12px] font-semibold text-[var(--gray-900)]">Returns</p>
              <p className="text-[11px] text-[var(--gray-400)]">30-day</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24">
          <div className="flex items-end justify-between">
            <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[var(--gray-900)]">You may also like</h2>
            <Link href={`/products?q=${encodeURIComponent(product.category)}`} className="text-[13px] font-semibold text-[var(--gray-400)] hover:text-[var(--gray-900)] transition-colors">
              View all &rarr;
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
