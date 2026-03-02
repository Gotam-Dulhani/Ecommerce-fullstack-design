"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOutUser, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClasses = (path: string) =>
    `text-sm font-semibold transition ${
      pathname === path
        ? "text-slate-900"
        : "text-slate-600 hover:text-slate-900"
    }`;

  const displayName = useMemo(() => {
    const raw = user?.displayName?.trim();
    if (raw) return raw;
    const email = user?.email ?? "";
    return email ? email.split("@")[0] : "Account";
  }, [user?.displayName, user?.email]);

  const avatarLetter = (displayName?.trim()?.[0] ?? "U").toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:max-w-7xl md:px-6">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white/70 text-slate-700 shadow-sm shadow-slate-900/5 hover:bg-white md:hidden"
          aria-label="Open menu"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              fill="currentColor"
              d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z"
            />
          </svg>
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl bg-slate-900 text-white shadow-sm shadow-slate-900/20">
            <span className="absolute inset-0 opacity-90 [background:radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.9),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(129,140,248,0.85),transparent_55%)]" />
            <span className="relative text-sm font-extrabold">SN</span>
          </span>
          <span className="hidden text-base font-semibold tracking-tight text-slate-900 sm:block">
            ShopNest
          </span>
        </Link>

        {/* Tabs */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className={linkClasses("/")}>
            Home
          </Link>
          <Link href="/products" className={linkClasses("/products")}>
            Products
          </Link>
          <Link href="/cart" className={linkClasses("/cart")}>
            Cart
          </Link>
          {isAdmin && (
            <Link href="/admin" className={linkClasses("/admin")}>
              Admin
            </Link>
          )}
        </nav>

        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const query = q.trim();
            router.push(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
          }}
          className="ml-auto hidden w-full max-w-md md:block"
        >
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm shadow-slate-900/5 focus:border-indigo-400"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M10 18a8 8 0 1 1 5.293-14.01A8 8 0 0 1 10 18Zm0-2a6 6 0 1 0-4.243-10.243A6 6 0 0 0 10 16Zm8.707 3.293-4.11-4.11 1.414-1.415 4.11 4.11-1.414 1.415Z"
                />
              </svg>
            </span>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-3 text-sm font-semibold text-slate-900 shadow-sm shadow-slate-900/5 hover:bg-white"
          >
            <span className="hidden sm:block">Cart</span>
            <span className="sm:hidden" aria-hidden="true">
              🛒
            </span>
            {totalItems > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[11px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-2 py-1.5 text-xs font-semibold text-slate-900 shadow-sm shadow-slate-900/5 hover:bg-white"
              >
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-900 text-[12px] font-bold text-white">
                  {avatarLetter}
                </span>
                <span className="max-w-[140px] truncate">{displayName}</span>
              </button>
              {open && (
                <div
                  className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10"
                  onMouseLeave={() => setOpen(false)}
                >
                  <div className="px-4 py-3">
                    <p className="text-xs font-semibold text-slate-900">{displayName}</p>
                    {user.email && (
                      <p className="mt-0.5 truncate text-[11px] text-slate-500">
                        {user.email}
                      </p>
                    )}
                  </div>
                  <div className="border-t border-slate-200 p-2">
                    <button
                      type="button"
                      onClick={() => void signOutUser()}
                      className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="hidden rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm shadow-slate-900/20 hover:bg-slate-800 md:inline-block"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="md:hidden">
          <button
            type="button"
            className="fixed inset-0 z-40 bg-slate-900/30"
            aria-label="Close menu overlay"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-x-0 top-0 z-50 animate-fade-up rounded-b-3xl border-b border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Menu</p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
              >
                Close
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const query = q.trim();
                setMobileOpen(false);
                router.push(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
              }}
              className="mt-3"
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-indigo-400"
              />
            </form>

            <div className="mt-4 grid gap-2">
              <Link onClick={() => setMobileOpen(false)} href="/" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900">
                Home
              </Link>
              <Link onClick={() => setMobileOpen(false)} href="/products" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900">
                Products
              </Link>
              <Link onClick={() => setMobileOpen(false)} href="/cart" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900">
                Cart
              </Link>
              {isAdmin && (
                <Link onClick={() => setMobileOpen(false)} href="/admin" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900">
                  Admin
                </Link>
              )}
              {!user ? (
                <Link
                  onClick={() => setMobileOpen(false)}
                  href="/auth/login"
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                >
                  Login
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    void signOutUser();
                  }}
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-left text-sm font-semibold text-white"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


