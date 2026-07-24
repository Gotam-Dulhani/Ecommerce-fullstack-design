"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../lib/utils";
import { Minus, Plus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();
  const shipping = totalPrice >= 5000 ? 0 : 250;
  const total = totalPrice + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 pt-24">
      <h1 className="text-2xl font-bold tracking-tight text-white">Cart</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {totalItems === 0 ? "Your cart is empty" : `${totalItems} item${totalItems === 1 ? "" : "s"}`}
      </p>

      {items.length === 0 ? (
        <div className="mt-20 flex flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--surface)] border border-white/5">
            <ShoppingBag className="h-10 w-10 text-zinc-700" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-white">Nothing here yet</h2>
          <p className="mt-2 max-w-xs text-sm text-zinc-500">Start exploring our products and find something you love.</p>
          <Link href="/products" className="mt-8 rounded-full bg-[var(--gold)] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[var(--gold-dim)] transition-colors">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)] lg:items-start">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-5 rounded-xl border border-white/5 bg-[var(--surface)] p-5 transition-colors hover:border-white/10">
                <Link href={`/products/${item.product.id}`} className="hidden h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[var(--surface-elevated)] sm:block">
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.name} className="block" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
                  ) : <div className="h-full w-full bg-[var(--surface)]" />}
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/products/${item.product.id}`} className="text-sm font-semibold text-white hover:text-[var(--gold)] transition-colors">
                        {item.product.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-zinc-500">{item.product.category}</p>
                    </div>
                    <p className="text-sm font-bold text-[var(--gold)]">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-4 pt-3">
                    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5">
                      <button type="button" onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="flex h-9 w-9 items-center justify-center text-zinc-400 hover:text-white transition-colors">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-white">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center text-zinc-400 hover:text-white transition-colors">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.product.id)}
                      className="ml-auto text-xs font-medium text-zinc-500 hover:text-red-500 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-28">
            <div className="rounded-xl border border-white/5 bg-[var(--surface)] p-6 space-y-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Order summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-white">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? "text-emerald-500" : "text-white"}`}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
              </div>
              {shipping > 0 && (
                <p className="rounded-lg bg-emerald-500/10 px-4 py-2.5 text-xs font-medium text-emerald-500">
                  Add {formatPrice(5000 - totalPrice)} more for free shipping
                </p>
              )}
              <div className="border-t border-dashed border-white/10 pt-4">
                <div className="flex justify-between text-base font-bold text-white">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Link href="/checkout" className="block w-full rounded-full bg-[var(--gold)] py-3.5 text-center text-xs font-bold uppercase tracking-wider text-black hover:bg-[var(--gold-dim)] transition-colors">
                Checkout
              </Link>
              <Link href="/products" className="block text-center text-xs font-semibold text-zinc-500 hover:text-white transition-colors">
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
