"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function SearchIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function CartIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function UserIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MenuIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function XIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOutUser, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [userMenuOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    { href: "/cart", label: "Cart" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const displayName = useMemo(() => {
    const raw = user?.displayName?.trim();
    if (raw) return raw;
    const email = user?.email ?? "";
    return email ? email.split("@")[0] : "Account";
  }, [user?.displayName, user?.email]);

  const avatarLetter = (displayName?.trim()?.[0] ?? "U").toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>

        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-slate-900 text-white shadow-md shadow-slate-900/20">
            <span className="absolute inset-0 bg-gradient-to-br from-sky-500 via-indigo-500 to-pink-500 opacity-90" />
            <span className="relative text-sm font-extrabold tracking-tight">SN</span>
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Shop<span className="text-indigo-600">Nest</span>
          </span>
        </Link>

        <nav className="ml-8 hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive(link.href)
                  ? "text-slate-900"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute inset-x-1 -bottom-[13px] h-0.5 rounded-full bg-slate-900" />
              )}
            </Link>
          ))}
        </nav>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const query = q.trim();
            router.push(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
          }}
          className="ml-auto hidden w-full max-w-sm md:block"
        >
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </form>

        <div className="flex items-center gap-1">
          <Link
            href="/cart"
            className="relative inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <CartIcon className="h-5 w-5" />
            <span className="hidden sm:block">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white shadow-sm">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-sm">
                  {avatarLetter}
                </span>
                <span className="hidden max-w-[120px] truncate lg:block">{displayName}</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 animate-fade-in">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                    {user.email && (
                      <p className="mt-0.5 truncate text-xs text-slate-500">{user.email}</p>
                    )}
                  </div>
                  <div className="p-1.5">
                    <button
                      type="button"
                      onClick={() => { setUserMenuOpen(false); void signOutUser(); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" x2="9" y1="12" y2="12" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-slate-900/20 transition hover:-translate-y-px hover:bg-slate-800 hover:shadow-md active:translate-y-0"
            >
              <UserIcon className="h-4 w-4" />
              <span className="hidden sm:block">Sign in</span>
            </Link>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-2xl animate-slide-in-right">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <span className="text-sm font-bold text-slate-900">Menu</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const query = q.trim();
                setMobileOpen(false);
                router.push(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
              }}
              className="px-4 pt-4"
            >
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </form>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    onClick={() => setMobileOpen(false)}
                    href={link.href}
                    className={`flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive(link.href)
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="border-t border-slate-100 p-4">
              {!user ? (
                <Link
                  onClick={() => setMobileOpen(false)}
                  href="/auth/login"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  <UserIcon className="h-4 w-4" />
                  Sign in
                </Link>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                      {avatarLetter}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
                      {user.email && <p className="truncate text-xs text-slate-500">{user.email}</p>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setMobileOpen(false); void signOutUser(); }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
