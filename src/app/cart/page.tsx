"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();

  const shipping = totalPrice >= 150 ? 0 : 9.99;
  const total = totalPrice + shipping;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        Cart
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {totalItems === 0
          ? "Your cart is empty"
          : `${totalItems} item${totalItems === 1 ? "" : "s"}`}
      </p>

      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <svg className="h-16 w-16 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          <h2 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h2>
          <p className="mt-1 text-sm text-gray-500">Browse products and add items to get started.</p>
          <Link
            href="/products"
            className="mt-6 rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr),minmax(0,1fr)] lg:items-start">
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
              >
                <Link
                  href={`/products/${item.product.id}`}
                  className="hidden h-20 w-20 shrink-0 overflow-hidden bg-gray-100 sm:block"
                >
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-100" />
                  )}
                </Link>

                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/products/${item.product.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-gray-500">{item.product.category}</p>
                    </div>
                    <p className="whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                    <div className="inline-flex items-center rounded-lg border border-gray-200">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="flex h-8 w-8 items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /></svg>
                      </button>
                      <span className="w-8 text-center text-xs font-medium text-gray-900">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="ml-auto text-xs font-medium text-gray-400 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:sticky lg:top-24">
            <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-900">Order summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-medium text-gray-900">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? "text-green-600" : "text-gray-900"}`}>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>
              {shipping > 0 && (
                <p className="rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
                  Add ${(150 - totalPrice).toFixed(2)} more for free shipping
                </p>
              )}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between text-sm font-bold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block w-full rounded-lg bg-gray-900 py-3 text-center text-sm font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Checkout
              </Link>
              <Link
                href="/products"
                className="block text-center text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
