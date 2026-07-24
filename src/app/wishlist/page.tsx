"use client";

import Link from "next/link";
import { useWishlist } from "../../context/WishlistContext";
import { ProductCard } from "../../components/ProductCard";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 pt-24">
      <h1 className="text-2xl font-bold tracking-tight text-white">Wishlist</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {items.length === 0 ? "Your wishlist is empty" : `${items.length} item${items.length === 1 ? "" : "s"}`}
      </p>

      {items.length === 0 ? (
        <div className="mt-20 flex flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--surface)] border border-white/5">
            <Heart className="h-10 w-10 text-zinc-700" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-white">Nothing saved yet</h2>
          <p className="mt-2 max-w-xs text-sm text-zinc-500">Browse products and tap the heart icon to save your favorites here.</p>
          <Link href="/products" className="mt-8 rounded-full bg-[var(--gold)] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[var(--gold-dim)] transition-colors">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
