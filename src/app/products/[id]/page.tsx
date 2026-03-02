"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProductById, type Product } from "../../../lib/products";
import { useCart } from "../../../context/CartContext";
import { RatingStars } from "../../../components/RatingStars";

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    void (async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [params]);

  if (!loading && !product) {
    notFound();
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 pt-8 md:px-6">
        <p className="text-sm text-slate-500">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pt-8 md:px-6">
      <div className="grid gap-6 md:grid-cols-[1.1fr,1.2fr] md:items-start">
        <div className="animate-fade-up rounded-[28px] border border-slate-200/70 bg-white/80 p-4 shadow-sm shadow-slate-900/5 md:p-6">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-100">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-slate-200" />
            )}
          </div>
        </div>
        <div className="animate-fade-up space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {product.category}
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              {product.name}
            </h1>
          </div>
          {typeof product.rating === "number" ? (
            <RatingStars
              rating={product.rating}
              count={product.ratingCount}
              size="md"
            />
          ) : (
            <p className="text-xs text-slate-500">No ratings yet.</p>
          )}
          <p className="text-sm leading-relaxed text-slate-600 md:text-base">
            {product.description}
          </p>
          <p className="text-sm text-slate-600">
            In stock:{" "}
            <span className="font-semibold text-slate-900">{product.stock}</span>
          </p>
          <p className="text-3xl font-extrabold text-slate-900">
            ${product.price.toFixed(2)}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => addToCart(product, 1)}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-slate-900/20 transition hover:-translate-y-[1px] hover:bg-slate-800 active:translate-y-0"
            >
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => addToCart(product, 1)}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm shadow-slate-900/5 hover:bg-white"
            >
              Buy now (demo)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


