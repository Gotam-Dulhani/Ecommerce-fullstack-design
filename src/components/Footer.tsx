"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--gray-100)] bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-12 py-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-[28px] font-black tracking-[-0.03em] text-[var(--gray-900)]">
              SHOPNEST<span className="text-[var(--amber)]">.</span>
            </p>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-[var(--gray-400)]">
              Quality products for modern living. Clean design, honest materials, no compromises.
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--gray-900)]">Shop</p>
            <div className="mt-4 space-y-3 text-[14px] text-[var(--gray-400)]">
              <Link href="/products" className="block hover:text-[var(--gray-900)] transition-colors">All Products</Link>
              <Link href="/products" className="block hover:text-[var(--gray-900)] transition-colors">New Arrivals</Link>
              <Link href="/products" className="block hover:text-[var(--gray-900)] transition-colors">Best Sellers</Link>
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--gray-900)]">Account</p>
            <div className="mt-4 space-y-3 text-[14px] text-[var(--gray-400)]">
              <Link href="/auth/login" className="block hover:text-[var(--gray-900)] transition-colors">Sign in</Link>
              <Link href="/auth/signup" className="block hover:text-[var(--gray-900)] transition-colors">Create account</Link>
              <Link href="/cart" className="block hover:text-[var(--gray-900)] transition-colors">Cart</Link>
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--gray-900)]">Support</p>
            <div className="mt-4 space-y-3 text-[14px] text-[var(--gray-400)]">
              <span>help@shopnest.store</span>
              <span className="block">Mon–Fri, 9am–6pm</span>
            </div>
          </div>
        </div>
        <div className="border-t border-[var(--gray-100)] py-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-[12px] text-[var(--gray-400)]">
            &copy; {new Date().getFullYear()} ShopNest. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[12px] text-[var(--gray-400)]">
            <span className="cursor-pointer hover:text-[var(--gray-900)] transition-colors">Privacy</span>
            <span className="cursor-pointer hover:text-[var(--gray-900)] transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
