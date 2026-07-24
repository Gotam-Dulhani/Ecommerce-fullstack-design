"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { createOrder, type ShippingAddress } from "../../lib/orders";

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
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="mt-1 text-sm text-gray-500">Add products before checking out.</p>
          <Link href="/products" className="mt-5 rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-gray-600" /> Loading checkout...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link><span>/</span>
        <Link href="/cart" className="hover:text-gray-900 transition-colors">Cart</Link><span>/</span>
        <span className="text-gray-900 font-medium">Checkout</span>
      </nav>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Checkout</h1>
      <p className="mt-1 text-sm text-gray-500">Demo — no payment processed</p>

      {/* Step indicator */}
      <div className="mt-6 flex items-center gap-2 text-sm">
        <span className={`font-medium ${step === "address" ? "text-gray-900" : "text-gray-400"}`}>1. Shipping</span>
        <span className="text-gray-300">→</span>
        <span className={`font-medium ${step === "review" ? "text-gray-900" : "text-gray-400"}`}>2. Review</span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr),minmax(0,1fr)] lg:items-start">
        <div>
          {step === "address" && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-900">Shipping details</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Full name</label>
                  <input value={address.fullName} onChange={onChange("fullName")} placeholder="John Doe" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-gray-400 focus:outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Phone</label>
                  <input value={address.phone} onChange={onChange("phone")} placeholder="+92 300 1234567" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-gray-400 focus:outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Address</label>
                  <input value={address.addressLine1} onChange={onChange("addressLine1")} placeholder="House #, Street, Area" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-gray-400 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">City</label>
                  <input value={address.city} onChange={onChange("city")} placeholder="Lahore" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-gray-400 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Postal code</label>
                  <input value={address.postalCode} onChange={onChange("postalCode")} placeholder="54000" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-gray-400 focus:outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Country</label>
                  <input value={address.country} onChange={onChange("country")} placeholder="Pakistan" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-gray-400 focus:outline-none" />
                </div>
              </div>
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
              )}
              <button
                type="button"
                onClick={() => { const e = validateAddress(); if (e) { setError(e); return; } setError(null); setStep("review"); }}
                className="w-full rounded-lg bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Review order
              </button>
            </div>
          )}

          {step === "review" && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">Order review</h2>
                <button type="button" onClick={() => setStep("address")} className="text-xs font-medium text-gray-500 hover:text-gray-900">Edit shipping</button>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                <p className="font-medium text-gray-900">{address.fullName}</p>
                <p>{address.addressLine1}</p>
                <p>{address.city} {address.postalCode}</p>
                <p>{address.country} · {address.phone}</p>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map((it) => (
                  <div key={it.product.id} className="flex items-center gap-3 py-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden bg-gray-100">
                      {it.product.image ? <img src={it.product.image} alt={it.product.name} className="h-full w-full object-cover" loading="lazy" /> : <div className="h-full w-full bg-gray-100" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{it.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {it.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">${(it.quantity * it.product.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
              )}
              <button
                type="button"
                onClick={placeOrder}
                disabled={placing}
                className="w-full rounded-lg bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {placing ? "Placing order..." : `Place order — $${grandTotal.toFixed(2)}`}
              </button>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24">
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={`font-medium ${shipping === 0 ? "text-green-600" : "text-gray-900"}`}>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between text-sm font-bold text-gray-900">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <Link href="/cart" className="block text-center text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Back to cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
