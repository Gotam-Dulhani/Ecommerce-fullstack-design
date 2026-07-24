"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();
  const shipping = totalPrice >= 150 ? 0 : 9.99;
  const total = totalPrice + shipping;

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">
      <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[var(--gray-900)]">Cart</h1>
      <p className="mt-1 text-[14px] text-[var(--gray-400)]">
        {totalItems === 0 ? "Your cart is empty" : `${totalItems} item${totalItems === 1 ? "" : "s"}`}
      </p>

      {items.length === 0 ? (
        <div className="mt-20 flex flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--gray-50)]">
            <svg className="h-10 w-10 text-[var(--gray-300)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
              <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
          </div>
          <h2 className="mt-6 text-[20px] font-bold text-[var(--gray-900)]">Nothing here yet</h2>
          <p className="mt-2 max-w-xs text-[14px] text-[var(--gray-400)]">Start exploring our products and find something you love.</p>
          <Link href="/products" className="mt-8 rounded-full bg-[var(--gray-900)] px-8 py-3.5 text-[13px] font-bold uppercase tracking-[0.1em] text-white hover:bg-[var(--gray-700)] transition-colors">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)] lg:items-start">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-5 rounded-2xl border border-[var(--gray-100)] bg-white p-5 transition-colors hover:border-[var(--gray-200)]">
                <Link href={`/products/${item.product.id}`} className="hidden h-24 w-24 shrink-0 overflow-hidden bg-[var(--gray-50)] sm:block">
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.name} className="block" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
                  ) : <div className="h-full w-full bg-[var(--gray-100)]" />}
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/products/${item.product.id}`} className="text-[14px] font-semibold text-[var(--gray-900)] hover:text-[var(--gray-500)] transition-colors">
                        {item.product.name}
                      </Link>
                      <p className="mt-0.5 text-[12px] text-[var(--gray-400)]">{item.product.category}</p>
                    </div>
                    <p className="text-[15px] font-bold text-[var(--gray-900)]">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-4 pt-3">
                    <div className="inline-flex items-center rounded-full border border-[var(--gray-200)]">
                      <button type="button" onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="flex h-9 w-9 items-center justify-center text-[var(--gray-400)] hover:text-[var(--gray-900)] transition-colors">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /></svg>
                      </button>
                      <span className="w-8 text-center text-[13px] font-semibold text-[var(--gray-900)]">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center text-[var(--gray-400)] hover:text-[var(--gray-900)] transition-colors">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                      </button>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.product.id)}
                      className="ml-auto text-[12px] font-medium text-[var(--gray-400)] hover:text-[var(--red)] transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-28">
            <div className="rounded-2xl border border-[var(--gray-100)] bg-white p-6 space-y-5">
              <h2 className="text-[13px] font-bold uppercase tracking-[0.1em] text-[var(--gray-900)]">Order summary</h2>
              <div className="space-y-3 text-[14px]">
                <div className="flex justify-between text-[var(--gray-500)]">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-[var(--gray-900)]">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--gray-500)]">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? "text-[var(--green)]" : "text-[var(--gray-900)]"}`}>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>
              {shipping > 0 && (
                <p className="rounded-xl bg-[var(--green-light)] px-4 py-2.5 text-[12px] font-medium text-[var(--green)]">
                  Add ${(150 - totalPrice).toFixed(2)} more for free shipping
                </p>
              )}
              <div className="border-t border-dashed border-[var(--gray-200)] pt-4">
                <div className="flex justify-between text-[15px] font-bold text-[var(--gray-900)]">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Link href="/checkout" className="block w-full rounded-full bg-[var(--gray-900)] py-3.5 text-center text-[13px] font-bold uppercase tracking-[0.1em] text-white hover:bg-[var(--gray-700)] transition-colors">
                Checkout
              </Link>
              <Link href="/products" className="block text-center text-[12px] font-semibold text-[var(--gray-400)] hover:text-[var(--gray-900)] transition-colors">
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
