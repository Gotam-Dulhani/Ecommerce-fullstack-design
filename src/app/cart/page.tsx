"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } =
    useCart();
  const router = useRouter();

  return (
    <div className="page-shell max-w-4xl">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
          Your cart
        </h1>
        <p className="mt-1 text-sm text-slate-600">
        {totalItems === 0
          ? "You don’t have any items in your cart yet."
          : `You have ${totalItems} item${totalItems === 1 ? "" : "s"} in your cart.`}
        </p>
      </div>

      {items.length === 0 ? (
        <Card className="mt-6 animate-fade-up p-6 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Your cart is empty.</p>
          <p className="mt-1">Browse products and add them to your cart.</p>
          <Button
            onClick={() => router.push("/products")}
            size="md"
            className="mt-4"
          >
            Continue shopping
          </Button>
        </Card>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1.6fr),minmax(0,1fr)]">
          <div className="space-y-4">
            {items.map((item) => (
              <Card
                key={item.product.id}
                className="flex gap-4 p-4"
              >
                <div className="hidden h-20 w-24 overflow-hidden rounded-xl bg-zinc-100 md:block">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-200" />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {item.product.name}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    {item.product.category}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-2 py-1 text-xs shadow-sm shadow-slate-900/5">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        className="px-2 text-slate-500 hover:text-slate-900"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-semibold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="px-2 text-slate-500 hover:text-slate-900"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-xs font-semibold text-slate-500 hover:text-rose-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="hidden text-right text-sm font-extrabold text-slate-900 md:block">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </Card>
            ))}
          </div>
          <Card className="space-y-3 p-5">
            <h2 className="text-sm font-semibold text-slate-900">
              Order summary
            </h2>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-dashed border-slate-200 pt-3 text-sm font-extrabold text-slate-900">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <Button
              onClick={() => router.push("/checkout")}
              className="mt-2 w-full"
            >
              Checkout (demo)
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}


