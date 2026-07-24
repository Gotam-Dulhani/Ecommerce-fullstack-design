"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Search, ShoppingBag, User, Menu, X, LogOut, LayoutDashboard, Heart } from "lucide-react";

export function Navbar() {
  const { user, isAdmin, signOutUser } = useAuth();
  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenus = () => {
    setMobileOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  };

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) { router.push(`/products?q=${encodeURIComponent(search.trim())}`); setSearch(""); setSearchOpen(false); }
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass border-b border-white/5" : "bg-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <button type="button" onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-1 text-zinc-400 hover:text-white transition-colors" aria-label="Menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/" className="text-lg font-black tracking-widest text-white uppercase">
            SHOPNEST<span className="text-[var(--gold)]">.</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={closeMenus} className={`relative px-3 py-2 text-xs font-medium uppercase tracking-widest transition-colors ${pathname === l.href ? "text-white" : "text-zinc-400 hover:text-zinc-200"}`}>
                {l.label}
                {pathname === l.href && <span className="absolute bottom-0 left-3 right-3 h-px bg-[var(--gold)]" />}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" onClick={closeMenus} className={`relative px-3 py-2 text-xs font-medium uppercase tracking-widest transition-colors ${pathname === "/admin" ? "text-white" : "text-zinc-400 hover:text-zinc-200"}`}>
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setSearchOpen(!searchOpen)} className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-all" aria-label="Search">
            <Search className="h-4 w-4" />
          </button>
          {user ? (
            <div ref={userMenuRef} className="relative">
              <button type="button" onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-bold uppercase transition-all hover:bg-[var(--gold)]/20">
                {user.email?.[0]}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-[var(--surface)] p-1.5 shadow-2xl animate-scale-in">
                  <div className="px-3 py-2 text-xs text-zinc-500 truncate border-b border-white/5 mb-1">{user.email}</div>
                  <Link href="/cart" onClick={closeMenus} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors">
                    <ShoppingBag className="h-4 w-4" /> Cart
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={closeMenus} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                  )}
                  <button type="button" onClick={() => void signOutUser()} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors">
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="flex h-9 items-center gap-2 rounded-full bg-[var(--gold)] px-4 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-[var(--gold-dim)]">
              <User className="h-3.5 w-3.5" /> Sign in
            </Link>
          )}
          <Link href="/wishlist" className="relative flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-all" aria-label="Wishlist">
            <Heart className="h-4 w-4" />
            {wishlistItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">{wishlistItems}</span>
            )}
          </Link>
          <Link href="/cart" className="relative flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-all" aria-label="Cart">
            <ShoppingBag className="h-4 w-4" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--gold)] text-[9px] font-bold text-black">{totalItems}</span>
            )}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="glass border-t border-white/5">
          <form onSubmit={handleSearch} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input ref={searchInputRef} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-[var(--gold)]/50 focus:outline-none transition-colors" />
            </div>
          </form>
        </div>
      )}

      {mobileOpen && (
        <div className="glass border-t border-white/5 lg:hidden">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={closeMenus} className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${pathname === l.href ? "bg-white/5 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}>{l.label}</Link>
            ))}
            {isAdmin && <Link href="/admin" onClick={closeMenus} className="rounded-lg px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">Dashboard</Link>}
          </nav>
        </div>
      )}
    </header>
  );
}
