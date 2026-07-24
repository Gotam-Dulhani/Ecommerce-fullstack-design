"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";

function MinusIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14" /></svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

function EmptyCartIcon() {
  return (
    <svg className="mx-auto h-16 w-16 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  );
}

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } =
    useCart();
  const router = useRouter();

  const shipping = totalPrice >= 150 ? 0 : 9.99;
  const total = totalPrice + shipping;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
      {/* Header */}
      <div className="animate-fade-up">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
          Shopping cart
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {totalItems === 0
            ? "Your cart is empty"
            : `${totalItems} item${totalItems === 1 ? "" : "s"} in your cart`}
        </p>
      </div>

      {items.length === 0 ? (
        /* Empty state */
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <EmptyCartIcon />
          <h2 className="mt-4 text-lg font-bold text-slate-900">Nothing in your cart yet</h2>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Looks like you haven&apos;t added anything. Start exploring our products and find something you love.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Browse products
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr),minmax(0,1fr)] lg:items-start">
          {/* Cart items */}
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-slate-200 hover:shadow-md"
              >
                {/* Image */}
                <Link
                  href={`/products/${item.product.id}`}
                  className="hidden h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-50 sm:block"
                >
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-100" />
                  )}
                </Link>

                {/* Info */}
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/products/${item.product.id}`}
                        className="text-sm font-bold text-slate-900 transition hover:text-indigo-600"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs font-medium text-slate-500">{item.product.category}</p>
                    </div>
                    <p className="whitespace-nowrap text-sm font-extrabold text-slate-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                    {/* Quantity stepper */}
                    <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white text-sm">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="flex h-8 w-8 items-center justify-center text-slate-400 transition hover:text-slate-900"
                      >
                        <MinusIcon />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-slate-400 transition hover:text-slate-900"
                      >
                        <PlusIcon />
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-400">${item.product.price.toFixed(2)} each</span>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="ml-auto flex items-center gap-1 text-xs font-medium text-slate-400 transition hover:text-rose-600"
                    >
                      <TrashIcon />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary - sticky on desktop */}
          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900">Order summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-slate-900">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    Shipping
                    {shipping === 0 && <TruckIcon />}
                  </span>
                  <span className={`font-semibold ${shipping === 0 ? "text-emerald-600" : "text-slate-900"}`}>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                  <TruckIcon />
                  Add ${(150 - totalPrice).toFixed(2)} more for free shipping
                </div>
              )}

              <div className="border-t border-dashed border-slate-200 pt-3">
                <div className="flex justify-between text-sm font-extrabold text-slate-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo code */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Promo code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />
                  <button
                    type="button"
                    className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl active:translate-y-0"
              >
                Proceed to checkout
              </button>

              <Link
                href="/products"
                className="block text-center text-xs font-medium text-indigo-600 transition hover:text-indigo-700"
              >
                Continue shopping &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
