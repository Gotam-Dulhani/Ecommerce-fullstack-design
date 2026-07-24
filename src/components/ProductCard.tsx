"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "../lib/products";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { Plus, Check } from "lucide-react";
import { formatPrice } from "../lib/utils";

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
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[var(--surface)] border border-white/5">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="block h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--surface)]">
            <span className="text-xs text-zinc-600">No image</span>
          </div>
        )}

        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--gold)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
            Featured
          </span>
        )}
        {typeof product.stock === "number" && product.stock <= 5 && product.stock > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Low stock
          </span>
        )}

        <button
          type="button"
          onClick={handleAdd}
          className="absolute bottom-0 left-0 right-0 translate-y-full bg-[var(--gold)] py-3 text-xs font-bold uppercase tracking-wider text-black transition-transform duration-300 ease-out group-hover:translate-y-0 flex items-center justify-center gap-1.5"
        >
          {added ? <><Check className="h-3.5 w-3.5" /> Added</> : <><Plus className="h-3.5 w-3.5" /> Quick add</>}
        </button>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{product.category}</p>
        <h3 className="line-clamp-1 text-sm font-medium text-white group-hover:text-[var(--gold)] transition-colors">
          {product.name}
        </h3>
        <p className="text-sm font-bold text-[var(--gold)]">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
