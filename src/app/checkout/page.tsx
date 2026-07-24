"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { createOrder, type ShippingAddress } from "../../lib/orders";

function LockIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"address" | "review">("address");
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Pakistan",
  });

  const shipping = useMemo(() => (totalPrice > 150 ? 0 : totalItems > 0 ? 9.99 : 0), [totalItems, totalPrice]);
  const grandTotal = totalPrice + shipping;

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/auth/login");
      return;
    }
    if (!user.emailVerified) {
      router.replace("/auth/verify");
    }
  }, [authLoading, router, user]);

  const onChange = (key: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const validateAddress = (): string | null => {
    const required: Array<[keyof ShippingAddress, string]> = [
      ["fullName", "Full name"],
      ["phone", "Phone"],
      ["addressLine1", "Address"],
      ["city", "City"],
      ["postalCode", "Postal code"],
      ["country", "Country"],
    ];
    for (const [k, label] of required) {
      if (!String(address[k] ?? "").trim()) return `${label} is required.`;
    }
    return null;
  };

  const placeOrder = async () => {
    setError(null);
    if (!user) { setError("Please sign in to place your order."); return; }
    if (!user.emailVerified) { setError("Please verify your email first."); return; }

    setPlacing(true);
    await new Promise((r) => setTimeout(r, 700));
    try {
      await user.getIdToken(true);
      const { orderId } = await createOrder({
        uid: user.uid,
        email: user.email,
        items,
        subtotal: totalPrice,
        shipping,
        total: grandTotal,
        address: {
          ...address,
          fullName: address.fullName.trim(),
          phone: address.phone.trim(),
          addressLine1: address.addressLine1.trim(),
          addressLine2: address.addressLine2?.trim() || "",
          city: address.city.trim(),
          state: address.state?.trim() || "",
          postalCode: address.postalCode.trim(),
          country: address.country.trim(),
        },
      });
      if (user.email) {
        void fetch("/api/order-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: user.email, orderId, total: grandTotal }),
        });
      }
      clearCart();
      router.push(`/checkout/success?orderId=${encodeURIComponent(orderId)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order.");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0 && !placing) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="flex flex-col items-center justify-center text-center">
          <svg className="h-16 w-16 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
          <h1 className="mt-4 text-xl font-bold text-slate-900">Your cart is empty</h1>
          <p className="mt-1 text-sm text-slate-500">Add some products before checking out.</p>
          <Link href="/products" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="flex items-center gap-2 text-sm text-slate-500"><div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" /> Loading checkout...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
      {/* Header + breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        <Link href="/" className="transition hover:text-slate-900">Home</Link><span>/</span>
        <Link href="/cart" className="transition hover:text-slate-900">Cart</Link><span>/</span>
        <span className="text-slate-900 font-medium">Checkout</span>
      </nav>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">Checkout</h1>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
        <LockIcon /> Secure checkout &middot; Demo — no payment processed
      </p>

      {/* Step indicator */}
      <div className="mt-6 flex items-center gap-3">
        {[
          { key: "address" as const, label: "Shipping" },
          { key: "review" as const, label: "Review" },
        ].map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${step === s.key ? "bg-slate-900 text-white" : step === "review" || i < 1 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
              {step === "review" || (step === "address" && i === 0 && step !== "address") ? <CheckIcon /> : i + 1}
            </span>
            <span className={`text-xs font-semibold ${step === s.key ? "text-slate-900" : "text-slate-400"}`}>{s.label}</span>
            {i === 0 && <div className="mx-2 h-px w-8 bg-slate-200" />}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr),minmax(0,1fr)] lg:items-start">
        <div className="space-y-5">
          {step === "address" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900">Shipping details</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Full name</label>
                  <input value={address.fullName} onChange={onChange("fullName")} placeholder="John Doe" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Phone</label>
                  <input value={address.phone} onChange={onChange("phone")} placeholder="+92 300 1234567" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Address line 1</label>
                  <input value={address.addressLine1} onChange={onChange("addressLine1")} placeholder="House #, Street, Area" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Address line 2 (optional)</label>
                  <input value={address.addressLine2 ?? ""} onChange={onChange("addressLine2")} placeholder="Apartment, landmark" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">City</label>
                  <input value={address.city} onChange={onChange("city")} placeholder="Lahore" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">State (optional)</label>
                  <input value={address.state ?? ""} onChange={onChange("state")} placeholder="Punjab" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Postal code</label>
                  <input value={address.postalCode} onChange={onChange("postalCode")} placeholder="54000" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Country</label>
                  <input value={address.country} onChange={onChange("country")} placeholder="Pakistan" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                </div>
              </div>
              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                  <p className="text-xs text-rose-700">{error}</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => { const e = validateAddress(); if (e) { setError(e); return; } setError(null); setStep("review"); }}
                className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl active:translate-y-0"
              >
                Review order
              </button>
            </div>
          )}

          {step === "review" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">Order review</h2>
                <button type="button" onClick={() => setStep("address")} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Edit shipping</button>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">{address.fullName}</p>
                <p>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ""}</p>
                <p>{address.city}{address.state ? `, ${address.state}` : ""} {address.postalCode}</p>
                <p>{address.country} &middot; {address.phone}</p>
              </div>
              <div className="divide-y divide-slate-100">
                {items.map((it) => (
                  <div key={it.product.id} className="flex items-center gap-3 py-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-50">
                      {it.product.image ? <img src={it.product.image} alt={it.product.name} className="h-full w-full object-cover" loading="lazy" /> : <div className="h-full w-full bg-slate-100" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{it.product.name}</p>
                      <p className="text-xs text-slate-500">Qty: {it.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-slate-900">${(it.quantity * it.product.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                  <p className="text-xs text-rose-700">{error}</p>
                </div>
              )}
              <button
                type="button"
                onClick={placeOrder}
                disabled={placing}
                className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {placing ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Placing order...
                  </span>
                ) : (
                  `Place order — $${grandTotal.toFixed(2)}`
                )}
              </button>
            </div>
          )}
        </div>

        {/* Order summary - sticky */}
        <div className="lg:sticky lg:top-24">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Order summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-slate-900">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className={`font-semibold ${shipping === 0 ? "text-emerald-600" : "text-slate-900"}`}>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
            </div>
            {shipping > 0 && (
              <div className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                Add ${(150 - totalPrice).toFixed(2)} more for free shipping
              </div>
            )}
            <div className="border-t border-dashed border-slate-200 pt-3">
              <div className="flex justify-between text-sm font-extrabold text-slate-900">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <Link href="/cart" className="block text-center text-xs font-medium text-indigo-600 transition hover:text-indigo-700">
              Back to cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
