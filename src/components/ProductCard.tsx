"use client";

import Link from "next/link";
import type { Product } from "../lib/products";
import { useCart } from "../context/CartContext";
import { RatingStars } from "./RatingStars";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const { addToCart } = useCart();

  return (
    <Card className="group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:border-sky-300/90 hover:shadow-md hover:shadow-slate-900/10">
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100"
        aria-label={`Open ${product.name}`}
      >
        {product.featured && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-sky-600/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm shadow-slate-900/30">
            Featured
          </span>
        )}
        {product.image ? (
          // Use <img> to avoid Next/Image remotePatterns config for demo URLs.
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="h-full w-full bg-slate-200" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3 md:p-4">
        <Link
          href={`/products/${product.id}`}
          className="line-clamp-2 text-sm font-semibold text-slate-900 md:text-[15px]"
        >
          {product.name}
        </Link>
        <p className="text-xs font-medium text-slate-500">{product.category}</p>
        {typeof product.rating === "number" && (
          <RatingStars
            rating={product.rating}
            count={product.ratingCount}
          />
        )}
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-extrabold text-slate-900 md:text-base">
            ${product.price.toFixed(2)}
          </p>
          <Button
            onClick={() => addToCart(product, 1)}
            size="sm"
          >
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}


