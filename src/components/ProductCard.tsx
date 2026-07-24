"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "../lib/products";
import { useCart } from "../context/CartContext";
import { RatingStars } from "./RatingStars";

type Props = {
  product: Product;
};

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-900/8"
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-50 to-pink-50">
            <span className="text-sm font-medium text-slate-300">No image</span>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {product.featured && (
            <span className="inline-flex items-center rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
              Featured
            </span>
          )}
          {typeof product.stock === "number" && product.stock <= 5 && product.stock > 0 && (
            <span className="inline-flex items-center rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
              Low stock
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setWishlisted(!wishlisted);
          }}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:text-rose-500"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HeartIcon filled={wishlisted} />
        </button>

        {/* Quick-add button (visible on hover) */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-center gap-2 rounded-xl bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-white shadow-lg backdrop-blur-sm transition-all duration-200 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-slate-800"
        >
          {added ? (
            <>
              <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              Added!
            </>
          ) : (
            <>
              <PlusIcon />
              Add to cart
            </>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">{product.category}</p>
        <h3 className="line-clamp-2 text-sm font-bold text-slate-900 sm:text-[15px] leading-snug">
          {product.name}
        </h3>
        {typeof product.rating === "number" && (
          <RatingStars rating={product.rating} count={product.ratingCount} />
        )}
        <div className="mt-auto pt-2 flex items-baseline justify-between">
          <p className="text-lg font-extrabold text-slate-900">
            ${product.price.toFixed(2)}
          </p>
          {typeof product.stock === "number" && product.stock > 0 && (
            <p className="text-[11px] font-medium text-emerald-600">In stock</p>
          )}
        </div>
      </div>
    </Link>
  );
}
