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
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[22px] font-bold text-[var(--gray-900)]">Your cart is empty</h1>
          <p className="mt-2 text-[14px] text-[var(--gray-400)]">Add products before checking out.</p>
          <Link href="/products" className="mt-6 rounded-full bg-[var(--gray-900)] px-8 py-3.5 text-[13px] font-bold uppercase tracking-[0.1em] text-white hover:bg-[var(--gray-700)] transition-colors">Browse products</Link>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10"><div className="flex items-center gap-3 text-[13px] text-[var(--gray-400)]"><div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--gray-200)] border-t-[var(--gray-600)]" /> Loading...</div></div>;
  }

  const inputClass = "w-full rounded-xl border border-[var(--gray-200)] bg-white px-4 py-3 text-[14px] focus:border-[var(--gray-900)] focus:outline-none transition-colors";

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
      <nav className="flex items-center gap-2 text-[12px] text-[var(--gray-400)] mb-6">
        <Link href="/" className="hover:text-[var(--gray-900)] transition-colors">Home</Link><span>/</span>
        <Link href="/cart" className="hover:text-[var(--gray-900)] transition-colors">Cart</Link><span>/</span>
        <span className="text-[var(--gray-900)] font-medium">Checkout</span>
      </nav>
      <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[var(--gray-900)]">Checkout</h1>
      <p className="mt-1 text-[13px] text-[var(--gray-400)]">Demo — no payment processed</p>

      {/* Steps */}
      <div className="mt-8 flex items-center gap-6">
        {[{ key: "address" as const, n: "1", label: "Shipping" }, { key: "review" as const, n: "2", label: "Review" }].map((s, i) => (
          <div key={s.key} className="flex items-center gap-3">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold ${step === s.key ? "bg-[var(--gray-900)] text-white" : i === 0 || step === "review" ? "bg-[var(--green-light)] text-[var(--green)]" : "bg-[var(--gray-100)] text-[var(--gray-400)]"}`}>
              {i === 0 && step === "review" ? "✓" : s.n}
            </span>
            <span className={`text-[13px] font-semibold ${step === s.key ? "text-[var(--gray-900)]" : "text-[var(--gray-400)]"}`}>{s.label}</span>
            {i === 0 && <div className="mx-2 h-px w-8 bg-[var(--gray-200)]" />}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)] lg:items-start">
        <div>
          {step === "address" && (
            <div className="rounded-2xl border border-[var(--gray-100)] bg-white p-6 space-y-5">
              <h2 className="text-[15px] font-bold text-[var(--gray-900)]">Shipping details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><label className="mb-1.5 block text-[12px] font-semibold text-[var(--gray-600)]">Full name</label><input value={address.fullName} onChange={onChange("fullName")} placeholder="John Doe" className={inputClass} /></div>
                <div className="sm:col-span-2"><label className="mb-1.5 block text-[12px] font-semibold text-[var(--gray-600)]">Phone</label><input value={address.phone} onChange={onChange("phone")} placeholder="+92 300 1234567" className={inputClass} /></div>
                <div className="sm:col-span-2"><label className="mb-1.5 block text-[12px] font-semibold text-[var(--gray-600)]">Address</label><input value={address.addressLine1} onChange={onChange("addressLine1")} placeholder="House #, Street" className={inputClass} /></div>
                <div><label className="mb-1.5 block text-[12px] font-semibold text-[var(--gray-600)]">City</label><input value={address.city} onChange={onChange("city")} placeholder="Lahore" className={inputClass} /></div>
                <div><label className="mb-1.5 block text-[12px] font-semibold text-[var(--gray-600)]">Postal code</label><input value={address.postalCode} onChange={onChange("postalCode")} placeholder="54000" className={inputClass} /></div>
                <div className="sm:col-span-2"><label className="mb-1.5 block text-[12px] font-semibold text-[var(--gray-600)]">Country</label><input value={address.country} onChange={onChange("country")} placeholder="Pakistan" className={inputClass} /></div>
              </div>
              {error && <p className="rounded-xl bg-[var(--red-light)] px-4 py-3 text-[13px] text-[var(--red)]">{error}</p>}
              <button type="button" onClick={() => { const e = validateAddress(); if (e) { setError(e); return; } setError(null); setStep("review"); }}
                className="w-full rounded-full bg-[var(--gray-900)] py-3.5 text-[13px] font-bold uppercase tracking-[0.1em] text-white hover:bg-[var(--gray-700)] transition-colors">
                Review order
              </button>
            </div>
          )}
          {step === "review" && (
            <div className="rounded-2xl border border-[var(--gray-100)] bg-white p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-[var(--gray-900)]">Order review</h2>
                <button type="button" onClick={() => setStep("address")} className="text-[12px] font-semibold text-[var(--amber)] hover:underline">Edit shipping</button>
              </div>
              <div className="rounded-xl bg-[var(--gray-50)] p-4 text-[13px] text-[var(--gray-600)]">
                <p className="font-semibold text-[var(--gray-900)]">{address.fullName}</p>
                <p>{address.addressLine1}</p>
                <p>{address.city} {address.postalCode}</p>
                <p>{address.country} · {address.phone}</p>
              </div>
              <div className="divide-y divide-[var(--gray-100)]">
                {items.map((it) => (
                  <div key={it.product.id} className="flex items-center gap-4 py-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden bg-[var(--gray-50)]">
                      {it.product.image ? <img src={it.product.image} alt={it.product.name} className="block" style={{ height: "100%", width: "100%", objectFit: "cover" }} /> : <div className="h-full w-full bg-[var(--gray-100)]" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-[var(--gray-900)]">{it.product.name}</p>
                      <p className="text-[12px] text-[var(--gray-400)]">Qty: {it.quantity}</p>
                    </div>
                    <p className="text-[14px] font-bold text-[var(--gray-900)]">${(it.quantity * it.product.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              {error && <p className="rounded-xl bg-[var(--red-light)] px-4 py-3 text-[13px] text-[var(--red)]">{error}</p>}
              <button type="button" onClick={placeOrder} disabled={placing}
                className="w-full rounded-full bg-[var(--gray-900)] py-3.5 text-[13px] font-bold uppercase tracking-[0.1em] text-white hover:bg-[var(--gray-700)] transition-colors disabled:opacity-50">
                {placing ? "Placing order..." : `Place order — $${grandTotal.toFixed(2)}`}
              </button>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-28">
          <div className="rounded-2xl border border-[var(--gray-100)] bg-white p-6 space-y-4">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.1em] text-[var(--gray-900)]">Summary</h2>
            <div className="space-y-3 text-[14px]">
              <div className="flex justify-between text-[var(--gray-500)]"><span>Subtotal</span><span className="font-semibold text-[var(--gray-900)]">${totalPrice.toFixed(2)}</span></div>
              <div className="flex justify-between text-[var(--gray-500)]"><span>Shipping</span><span className={`font-semibold ${shipping === 0 ? "text-[var(--green)]" : "text-[var(--gray-900)]"}`}>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
            </div>
            <div className="border-t border-dashed border-[var(--gray-200)] pt-4">
              <div className="flex justify-between text-[15px] font-bold text-[var(--gray-900)]"><span>Total</span><span>${grandTotal.toFixed(2)}</span></div>
            </div>
            <Link href="/cart" className="block text-center text-[12px] font-semibold text-[var(--gray-400)] hover:text-[var(--gray-900)] transition-colors">Back to cart</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
