"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "../lib/products";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

type Props = { product: Product };

export function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { router.push("/auth/login"); return; }
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--gray-50)]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-[13px] text-[var(--gray-300)]">No image</span>
          </div>
        )}

        {/* Badges */}
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--amber)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
            Featured
          </span>
        )}
        {typeof product.stock === "number" && product.stock <= 5 && product.stock > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--red)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
            Low stock
          </span>
        )}

        {/* Quick add */}
        <button
          type="button"
          onClick={handleAdd}
          className="absolute bottom-0 left-0 right-0 translate-y-full bg-[var(--gray-900)] py-3.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-transform duration-300 ease-out group-hover:translate-y-0"
        >
          {added ? "Added" : "Quick add"}
        </button>
      </div>

      <div className="mt-4 px-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--gray-400)]">{product.category}</p>
        <h3 className="mt-1 line-clamp-1 text-[15px] font-medium text-[var(--gray-900)]">
          {product.name}
        </h3>
        <p className="mt-1.5 text-[15px] font-semibold text-[var(--gray-900)]">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
