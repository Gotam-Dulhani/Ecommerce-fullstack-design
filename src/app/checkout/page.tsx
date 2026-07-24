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
    fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "Pakistan",
  });
  const shipping = useMemo(() => (totalPrice > 150 ? 0 : totalItems > 0 ? 9.99 : 0), [totalItems, totalPrice]);
  const grandTotal = totalPrice + shipping;

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/auth/login"); return; }
    if (!user.emailVerified) router.replace("/auth/verify");
  }, [authLoading, router, user]);

  const onChange = (key: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddress((prev) => ({ ...prev, [key]: e.target.value }));

  const validateAddress = (): string | null => {
    const required: Array<[keyof ShippingAddress, string]> = [
      ["fullName", "Full name"], ["phone", "Phone"], ["addressLine1", "Address"], ["city", "City"], ["postalCode", "Postal code"], ["country", "Country"],
    ];
    for (const [k, label] of required) { if (!String(address[k] ?? "").trim()) return `${label} is required.`; }
    return null;
  };

  const placeOrder = async () => {
    setError(null);
    if (!user) { setError("Please sign in."); return; }
    if (!user.emailVerified) { setError("Please verify your email."); return; }
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 700));
    try {
      await user.getIdToken(true);
      const { orderId } = await createOrder({
        uid: user.uid, email: user.email, items, subtotal: totalPrice, shipping, total: grandTotal,
        address: { ...address, fullName: address.fullName.trim(), phone: address.phone.trim(), addressLine1: address.addressLine1.trim(), addressLine2: address.addressLine2?.trim() || "", city: address.city.trim(), state: address.state?.trim() || "", postalCode: address.postalCode.trim(), country: address.country.trim() },
      });
      if (user.email) {
        void fetch("/api/order-confirmation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: user.email, orderId, total: grandTotal }) });
      }
      clearCart();
      router.push(`/checkout/success?orderId=${encodeURIComponent(orderId)}`);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to place order."); }
    finally { setPlacing(false); }
  };

  if (items.length === 0 && !placing) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 pt-24">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-xl font-bold text-white">Your cart is empty</h1>
          <p className="mt-2 text-sm text-zinc-500">Add products before checking out.</p>
          <Link href="/products" className="mt-6 rounded-full bg-[var(--gold)] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[var(--gold-dim)] transition-colors">Browse products</Link>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 pt-24"><div className="flex items-center gap-3 text-sm text-zinc-500"><div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-[var(--gold)]" /> Loading...</div></div>;
  }

  const inputClass = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[var(--gold)]/50 focus:outline-none transition-colors";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pt-24">
      <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
        <Link href="/" className="hover:text-white transition-colors">Home</Link><span className="text-zinc-700">/</span>
        <Link href="/cart" className="hover:text-white transition-colors">Cart</Link><span className="text-zinc-700">/</span>
        <span className="text-white font-medium">Checkout</span>
      </nav>
      <h1 className="text-2xl font-bold tracking-tight text-white">Checkout</h1>
      <p className="mt-1 text-xs text-zinc-500">Demo — no payment processed</p>

      {/* Steps */}
      <div className="mt-8 flex items-center gap-6">
        {[{ key: "address" as const, n: "1", label: "Shipping" }, { key: "review" as const, n: "2", label: "Review" }].map((s, i) => (
          <div key={s.key} className="flex items-center gap-3">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step === s.key ? "bg-[var(--gold)] text-black" : i === 0 || step === "review" ? "bg-emerald-500/10 text-emerald-500" : "bg-white/5 text-zinc-500"}`}>
              {i === 0 && step === "review" ? "✓" : s.n}
            </span>
            <span className={`text-xs font-semibold ${step === s.key ? "text-white" : "text-zinc-500"}`}>{s.label}</span>
            {i === 0 && <div className="mx-2 h-px w-8 bg-white/10" />}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)] lg:items-start">
        <div>
          {step === "address" && (
            <div className="rounded-xl border border-white/5 bg-[var(--surface)] p-6 space-y-5">
              <h2 className="text-sm font-bold text-white">Shipping details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><label className="mb-1.5 block text-xs font-semibold text-zinc-400">Full name</label><input value={address.fullName} onChange={onChange("fullName")} placeholder="John Doe" className={inputClass} /></div>
                <div className="sm:col-span-2"><label className="mb-1.5 block text-xs font-semibold text-zinc-400">Phone</label><input value={address.phone} onChange={onChange("phone")} placeholder="+92 300 1234567" className={inputClass} /></div>
                <div className="sm:col-span-2"><label className="mb-1.5 block text-xs font-semibold text-zinc-400">Address</label><input value={address.addressLine1} onChange={onChange("addressLine1")} placeholder="House #, Street" className={inputClass} /></div>
                <div><label className="mb-1.5 block text-xs font-semibold text-zinc-400">City</label><input value={address.city} onChange={onChange("city")} placeholder="Lahore" className={inputClass} /></div>
                <div><label className="mb-1.5 block text-xs font-semibold text-zinc-400">Postal code</label><input value={address.postalCode} onChange={onChange("postalCode")} placeholder="54000" className={inputClass} /></div>
                <div className="sm:col-span-2"><label className="mb-1.5 block text-xs font-semibold text-zinc-400">Country</label><input value={address.country} onChange={onChange("country")} placeholder="Pakistan" className={inputClass} /></div>
              </div>
              {error && <p className="rounded-lg bg-red-500/10 px-4 py-3 text-xs text-red-500">{error}</p>}
              <button type="button" onClick={() => { const e = validateAddress(); if (e) { setError(e); return; } setError(null); setStep("review"); }}
                className="w-full rounded-full bg-[var(--gold)] py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[var(--gold-dim)] transition-colors">
                Review order
              </button>
            </div>
          )}
          {step === "review" && (
            <div className="rounded-xl border border-white/5 bg-[var(--surface)] p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white">Order review</h2>
                <button type="button" onClick={() => setStep("address")} className="text-xs font-semibold text-[var(--gold)] hover:underline">Edit shipping</button>
              </div>
              <div className="rounded-lg bg-white/5 p-4 text-xs text-zinc-400">
                <p className="font-semibold text-white">{address.fullName}</p>
                <p>{address.addressLine1}</p>
                <p>{address.city} {address.postalCode}</p>
                <p>{address.country} · {address.phone}</p>
              </div>
              <div className="divide-y divide-white/5">
                {items.map((it) => (
                  <div key={it.product.id} className="flex items-center gap-4 py-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[var(--surface-elevated)]">
                      {it.product.image ? <img src={it.product.image} alt={it.product.name} className="block" style={{ height: "100%", width: "100%", objectFit: "cover" }} /> : <div className="h-full w-full bg-[var(--surface)]" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{it.product.name}</p>
                      <p className="text-xs text-zinc-500">Qty: {it.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-[var(--gold)]">${(it.quantity * it.product.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              {error && <p className="rounded-lg bg-red-500/10 px-4 py-3 text-xs text-red-500">{error}</p>}
              <button type="button" onClick={placeOrder} disabled={placing}
                className="w-full rounded-full bg-[var(--gold)] py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[var(--gold-dim)] transition-colors disabled:opacity-50">
                {placing ? "Placing order..." : `Place order — $${grandTotal.toFixed(2)}`}
              </button>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-28">
          <div className="rounded-xl border border-white/5 bg-[var(--surface)] p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-zinc-400"><span>Subtotal</span><span className="font-semibold text-white">${totalPrice.toFixed(2)}</span></div>
              <div className="flex justify-between text-zinc-400"><span>Shipping</span><span className={`font-semibold ${shipping === 0 ? "text-emerald-500" : "text-white"}`}>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
            </div>
            <div className="border-t border-dashed border-white/10 pt-4">
              <div className="flex justify-between text-base font-bold text-white"><span>Total</span><span>${grandTotal.toFixed(2)}</span></div>
            </div>
            <Link href="/cart" className="block text-center text-xs font-semibold text-zinc-500 hover:text-white transition-colors">Back to cart</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
