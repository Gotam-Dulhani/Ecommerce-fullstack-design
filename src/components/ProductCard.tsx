"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "../lib/products";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { RatingStars } from "./RatingStars";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-sm text-gray-400">No image</span>
          </div>
        )}

        {product.featured && (
          <span className="absolute left-2 top-2 rounded bg-amber-500 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
            Featured
          </span>
        )}

        {typeof product.stock === "number" && product.stock <= 5 && product.stock > 0 && (
          <span className="absolute left-2 top-2 rounded bg-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
            Low stock
          </span>
        )}

        <button
          type="button"
          onClick={handleAddToCart}
          className="absolute bottom-3 left-3 right-3 rounded-lg bg-gray-900 py-2.5 text-xs font-medium text-white opacity-0 transition-all duration-200 hover:bg-gray-800 group-hover:opacity-100"
        >
          {added ? "Added!" : "Add to cart"}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">{product.category}</p>
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900 leading-snug">
          {product.name}
        </h3>
        {typeof product.rating === "number" && (
          <RatingStars rating={product.rating} count={product.ratingCount} />
        )}
        <div className="mt-auto pt-1.5">
          <p className="text-sm font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
}
