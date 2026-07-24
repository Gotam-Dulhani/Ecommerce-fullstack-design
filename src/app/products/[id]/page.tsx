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
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-gray-600" />
          Loading...
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-gray-900 transition-colors">Products</Link>
        <span>/</span>
        <Link href={`/products?q=${encodeURIComponent(product.category)}`} className="hover:text-gray-900 transition-colors">{product.category}</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.2fr,1fr] lg:items-start">
        {/* Image */}
        <div className="overflow-hidden bg-gray-100">
          <div className="relative aspect-[4/3] w-full">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-sm text-gray-400">No image available</span>
              </div>
            )}
            {product.featured && (
              <span className="absolute left-4 top-4 rounded bg-amber-500 px-2.5 py-1 text-xs font-semibold uppercase text-white">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{product.category}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              {product.name}
            </h1>
          </div>

          {typeof product.rating === "number" ? (
            <RatingStars rating={product.rating} count={product.ratingCount} size="md" />
          ) : (
            <p className="text-xs text-gray-400">No ratings yet</p>
          )}

          <p className="text-sm leading-relaxed text-gray-600">
            {product.description}
          </p>

          {/* Price + stock */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {typeof product.stock === "number" && product.stock > 0 && (
              <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                In stock ({product.stock})
              </span>
            )}
            {typeof product.stock === "number" && product.stock <= 0 && (
              <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
                Out of stock
              </span>
            )}
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-lg border border-gray-200">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                aria-label="Decrease quantity"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /></svg>
              </button>
              <span className="w-10 text-center text-sm font-medium text-gray-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(product?.stock ?? 99, quantity + 1))}
                className="flex h-10 w-10 items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                aria-label="Increase quantity"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 rounded-lg bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors sm:flex-none sm:px-8"
            >
              {added ? "Added to cart!" : "Add to cart"}
            </button>
          </div>

          {/* Trust info */}
          <div className="grid grid-cols-3 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-center">
            <div>
              <p className="text-xs font-medium text-gray-900">Free shipping</p>
              <p className="text-[11px] text-gray-500">Over $150</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900">Secure checkout</p>
              <p className="text-[11px] text-gray-500">SSL encrypted</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900">Easy returns</p>
              <p className="text-[11px] text-gray-500">30-day policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-semibold text-gray-900">You may also like</h2>
            <Link href={`/products?q=${encodeURIComponent(product.category)}`} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              View all
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
