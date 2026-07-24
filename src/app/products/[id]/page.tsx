"use client";

import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAllProducts, fetchProductById, type Product } from "../../../lib/products";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { useWishlist } from "../../../context/WishlistContext";
import { RatingStars } from "../../../components/RatingStars";
import { ProductCard } from "../../../components/ProductCard";
import { Skeleton } from "../../../components/Skeleton";
import { formatPrice } from "../../../lib/utils";
import { Minus, Plus, Truck, Shield, RotateCcw, Heart } from "lucide-react";

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
  const { toggleWishlist, isInWishlist } = useWishlist();

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 pt-24">
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <Skeleton className="h-4 w-4 rounded-full" />
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

  const liked = isInWishlist(product.id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pt-24">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-zinc-700">/</span>
        <Link href="/products" className="hover:text-white transition-colors">Shop</Link>
        <span className="text-zinc-700">/</span>
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-white transition-colors">{product.category}</Link>
        <span className="text-zinc-700">/</span>
        <span className="text-white font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[1.3fr,1fr] lg:items-start">
        {/* Image */}
        <div className="overflow-hidden rounded-xl bg-[var(--surface)] border border-white/5">
          <div className="relative aspect-[4/5] w-full">
            {product.image ? (
              <img src={product.image} alt={product.name} className="block h-full w-full object-cover" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[var(--surface)]">
                <span className="text-xs text-zinc-600">No image</span>
              </div>
            )}
            {product.featured && (
              <span className="absolute left-4 top-4 rounded-full bg-[var(--gold)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6 lg:sticky lg:top-28">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500">{product.category}</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {product.name}
            </h1>
          </div>

          {typeof product.rating === "number" ? (
            <div className="flex items-center gap-2">
              <RatingStars rating={product.rating} size={16} />
              {typeof product.ratingCount === "number" && <span className="text-xs text-zinc-500">({product.ratingCount})</span>}
            </div>
          ) : (
            <p className="text-xs text-zinc-500">No ratings yet</p>
          )}

          <p className="text-sm leading-relaxed text-zinc-400">
            {product.description}
          </p>

          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold tracking-tight text-[var(--gold)]">{formatPrice(product.price)}</span>
            {typeof product.stock === "number" && product.stock > 0 && (
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
                In stock ({product.stock})
              </span>
            )}
            {typeof product.stock === "number" && product.stock <= 0 && (
              <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500">
                Out of stock
              </span>
            )}
          </div>

          {/* Quantity + CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-12 w-12 items-center justify-center text-zinc-400 hover:text-white transition-colors"
                aria-label="Decrease quantity">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold text-white">{quantity}</span>
              <button type="button" onClick={() => setQuantity(Math.min(product?.stock ?? 99, quantity + 1))}
                className="flex h-12 w-12 items-center justify-center text-zinc-400 hover:text-white transition-colors"
                aria-label="Increase quantity">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button type="button" onClick={handleAddToCart}
              className="flex-1 rounded-full bg-[var(--gold)] py-3.5 px-8 text-xs font-bold uppercase tracking-wider text-black hover:bg-[var(--gold-dim)] transition-colors sm:flex-none"
            >
              {added ? "Added to cart" : "Add to cart"}
            </button>
            <button type="button" onClick={() => toggleWishlist(product)}
              className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all ${
                liked
                  ? "border-red-500/30 bg-red-500/10 text-red-500"
                  : "border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-white/20"
              }`}
              aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-red-500" : ""}`} />
            </button>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-3 gap-4 rounded-xl border border-white/5 bg-[var(--surface)] p-5">
            <div className="flex flex-col items-center gap-2 text-center">
              <Truck className="h-5 w-5 text-[var(--gold)]" />
              <div>
                <p className="text-xs font-semibold text-white">Free shipping</p>
                <p className="text-[10px] text-zinc-500">Over Rs. 42,000</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <Shield className="h-5 w-5 text-[var(--gold)]" />
              <div>
                <p className="text-xs font-semibold text-white">Secure</p>
                <p className="text-[10px] text-zinc-500">SSL encrypted</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <RotateCcw className="h-5 w-5 text-[var(--gold)]" />
              <div>
                <p className="text-xs font-semibold text-white">Returns</p>
                <p className="text-[10px] text-zinc-500">30-day</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-white">You may also like</h2>
            <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="text-xs font-semibold text-zinc-500 hover:text-white transition-colors">
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
