"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { createOrder, type ShippingAddress } from "../../lib/orders";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const shipping = useMemo(() => (totalPrice > 150 ? 0 : totalItems > 0 ? 9.99 : 0), [
    totalItems,
    totalPrice,
  ]);
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

  const onChange =
    (key: keyof ShippingAddress) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setAddress((prev) => ({ ...prev, [key]: value }));
    };

  const placeOrder = async () => {
    setError(null);
    if (!user) {
      setError("Please sign in to place your order.");
      router.push("/auth/login");
      return;
    }
    if (!user.emailVerified) {
      setError("Please verify your email before placing an order.");
      router.push("/auth/verify");
      return;
    }

    const required: Array<[keyof ShippingAddress, string]> = [
      ["fullName", "Full name"],
      ["phone", "Phone"],
      ["addressLine1", "Address line 1"],
      ["city", "City"],
      ["postalCode", "Postal code"],
      ["country", "Country"],
    ];
    for (const [k, label] of required) {
      const v = String(address[k] ?? "").trim();
      if (!v) {
        setError(`${label} is required.`);
        return;
      }
    }

    setPlacing(true);
    // demo checkout: pretend to process
    await new Promise((r) => setTimeout(r, 700));

    // Save order to Firebase RTDB (demo)
    try {
      // Force refresh token so RTDB rules see email_verified = true
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

      // Best-effort: send confirmation email (server-side via /api)
      if (user.email) {
        void fetch("/api/order-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: user.email,
            orderId,
            total: grandTotal,
          }),
        });
      }

      clearCart();
      router.push(`/checkout/success?orderId=${encodeURIComponent(orderId)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page-shell max-w-4xl">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
          Checkout
        </h1>
        <p className="mt-2 text-sm text-zinc-600">Your cart is empty.</p>
        <Button className="mt-4" onClick={() => router.push("/products")}>
          Continue shopping
        </Button>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="page-shell max-w-4xl">
        <p className="text-sm text-zinc-500">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="page-shell max-w-4xl">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
        Checkout
      </h1>
      <p className="mt-1 text-sm text-zinc-600">
        Demo checkout: no payment will be processed.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1.6fr),minmax(0,1fr)]">
        <div className="space-y-6">
          <Card className="space-y-3 p-4 md:p-6">
            <h2 className="text-sm font-semibold text-zinc-900 md:text-base">
              Shipping details
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-zinc-700">Full name</label>
                <input
                  value={address.fullName}
                  onChange={onChange("fullName")}
                  className="mt-1 w-full rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-800"
                  placeholder="John Doe"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-zinc-700">Phone</label>
                <input
                  value={address.phone}
                  onChange={onChange("phone")}
                  className="mt-1 w-full rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-800"
                  placeholder="+92..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-zinc-700">Address line 1</label>
                <input
                  value={address.addressLine1}
                  onChange={onChange("addressLine1")}
                  className="mt-1 w-full rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-800"
                  placeholder="House #, Street, Area"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-zinc-700">Address line 2 (optional)</label>
                <input
                  value={address.addressLine2 ?? ""}
                  onChange={onChange("addressLine2")}
                  className="mt-1 w-full rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-800"
                  placeholder="Apartment, landmark, etc."
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-700">City</label>
                <input
                  value={address.city}
                  onChange={onChange("city")}
                  className="mt-1 w-full rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-800"
                  placeholder="Lahore"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-700">State (optional)</label>
                <input
                  value={address.state ?? ""}
                  onChange={onChange("state")}
                  className="mt-1 w-full rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-800"
                  placeholder="Punjab"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-700">Postal code</label>
                <input
                  value={address.postalCode}
                  onChange={onChange("postalCode")}
                  className="mt-1 w-full rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-800"
                  placeholder="54000"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-700">Country</label>
                <input
                  value={address.country}
                  onChange={onChange("country")}
                  className="mt-1 w-full rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-800"
                  placeholder="Pakistan"
                />
              </div>
            </div>
            {error && <p className="text-xs text-rose-500">{error}</p>}
          </Card>

          <Card className="space-y-3 p-4 md:p-6">
            <h2 className="text-sm font-semibold text-zinc-900 md:text-base">
              Items
            </h2>
            <div className="divide-y divide-zinc-100">
              {items.map((it) => (
                <div key={it.product.id} className="flex items-center gap-3 py-3">
                  <div className="h-12 w-14 overflow-hidden rounded-xl bg-zinc-100">
                    {it.product.image ? (
                      <img
                        src={it.product.image}
                        alt={it.product.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-zinc-200" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {it.product.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Qty {it.quantity} · ${it.product.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-zinc-900">
                    ${(it.quantity * it.product.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="space-y-3 p-4 md:p-6">
          <h2 className="text-sm font-semibold text-zinc-900 md:text-base">
            Summary
          </h2>
          <div className="flex justify-between text-sm text-zinc-600">
            <span>Items</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between text-sm text-zinc-600">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-zinc-600">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between border-t border-dashed border-zinc-200 pt-3 text-sm font-semibold text-zinc-900">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
          <Button
            onClick={() => void placeOrder()}
            disabled={placing}
            className="mt-2 w-full"
          >
            {placing ? "Placing order..." : "Place order (demo)"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/cart")}
          >
            Back to cart
          </Button>
        </Card>
      </div>
    </div>
  );
}


