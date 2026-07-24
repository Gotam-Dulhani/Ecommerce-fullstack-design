"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOutUser, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [q, setQ] = useState("");
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

  const closeMobileMenu = useCallback(() => setMenuOpen(false), []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path) && path !== "/";

  const displayName = user?.displayName?.trim() || user?.email?.split("@")[0] || "Account";
  const avatarLetter = (displayName?.trim()?.[0] ?? "U").toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-[var(--off-white)]/80 backdrop-blur-xl border-b border-[var(--gray-100)]">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 lg:px-10">
        {/* Left */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col gap-[5px]"
            aria-label="Menu"
          >
            <span className={`block h-[1.5px] w-5 bg-[var(--gray-900)] transition-all duration-300 ${menuOpen ? "translate-y-[6.5px] rotate-45" : ""}`} />
            <span className={`block h-[1.5px] w-5 bg-[var(--gray-900)] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-[1.5px] w-5 bg-[var(--gray-900)] transition-all duration-300 ${menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
          </button>
          <Link href="/" className="text-[22px] font-black tracking-[-0.03em] text-[var(--gray-900)]">
            SHOPNEST<span className="text-[var(--amber)]">.</span>
          </Link>
        </div>

        {/* Center */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ${
                isActive(link.href) ? "text-[var(--gray-900)]" : "text-[var(--gray-400)] hover:text-[var(--gray-900)]"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute -bottom-1 left-0 h-[1.5px] w-full bg-[var(--gray-900)]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const query = q.trim();
              router.push(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
            }}
            className="hidden lg:block"
          >
            <div className="relative">
              <svg className="absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[var(--gray-400)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search"
                className="w-48 rounded-full border border-[var(--gray-200)] bg-transparent py-2 pl-9 pr-4 text-[13px] placeholder:text-[var(--gray-300)] focus:border-[var(--gray-900)] focus:outline-none transition-colors"
              />
            </div>
          </form>

          {/* Cart */}
          <Link href="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full text-[var(--gray-600)] hover:bg-[var(--gray-100)] transition-colors">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -right-0 -top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--gray-900)] px-1 text-[10px] font-bold text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gray-900)] text-[11px] font-bold text-white hover:bg-[var(--gray-700)] transition-colors"
              >
                {avatarLetter}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-[var(--gray-100)] bg-white shadow-[0_20px_60px_-12px_rgba(0,0,0,0.12)] animate-scale-in">
                  <div className="border-b border-[var(--gray-100)] px-5 py-4">
                    <p className="text-sm font-semibold text-[var(--gray-900)]">{displayName}</p>
                    {user.email && <p className="mt-0.5 truncate text-xs text-[var(--gray-400)]">{user.email}</p>}
                  </div>
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => { setUserMenuOpen(false); void signOutUser(); }}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--gray-600)] hover:bg-[var(--gray-50)] hover:text-[var(--gray-900)] transition-colors"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
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
              className="rounded-full bg-[var(--gray-900)] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[var(--gray-700)] transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-[var(--gray-100)] bg-[var(--off-white)] lg:hidden animate-fade-in">
          <div className="px-6 py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const query = q.trim();
                closeMobileMenu();
                router.push(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
              }}
            >
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gray-400)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search"
                  className="w-full rounded-full border border-[var(--gray-200)] bg-transparent py-3 pl-10 pr-4 text-sm placeholder:text-[var(--gray-300)] focus:border-[var(--gray-900)] focus:outline-none"
                />
              </div>
            </form>
          </div>
          <nav className="px-6 pb-8 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] ${
                  isActive(link.href)
                    ? "bg-[var(--gray-900)] text-white"
                    : "text-[var(--gray-600)] hover:bg-[var(--gray-100)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link
                href="/auth/login"
                onClick={closeMobileMenu}
                className="mt-2 block rounded-xl bg-[var(--gray-900)] px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
