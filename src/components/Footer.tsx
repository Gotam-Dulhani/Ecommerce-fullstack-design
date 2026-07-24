"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="text-lg font-bold text-gray-900">ShopNest</p>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Quality products for modern living.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Shop</p>
            <div className="mt-3 space-y-2 text-sm text-gray-500">
              <Link href="/products" className="block hover:text-gray-900 transition-colors">All Products</Link>
              <Link href="/products" className="block hover:text-gray-900 transition-colors">New Arrivals</Link>
              <Link href="/products" className="block hover:text-gray-900 transition-colors">Best Sellers</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Account</p>
            <div className="mt-3 space-y-2 text-sm text-gray-500">
              <Link href="/auth/login" className="block hover:text-gray-900 transition-colors">Sign in</Link>
              <Link href="/auth/signup" className="block hover:text-gray-900 transition-colors">Create account</Link>
              <Link href="/cart" className="block hover:text-gray-900 transition-colors">Cart</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Support</p>
            <div className="mt-3 space-y-2 text-sm text-gray-500">
              <span>help@shopnest.store</span>
              <span className="block">Mon–Fri, 9am–6pm</span>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-100 pt-6 text-xs text-gray-400">
          &copy; {new Date().getFullYear()} ShopNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
