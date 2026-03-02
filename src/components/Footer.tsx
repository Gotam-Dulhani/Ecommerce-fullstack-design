"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-14 border-t border-slate-200/70 bg-white/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4 md:px-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-900 text-sm font-extrabold text-white">
              SN
            </span>
            <p className="text-base font-semibold text-slate-900">ShopNest</p>
          </div>
          <p className="text-sm text-slate-600">
            A modern eCommerce demo built with Next.js + Firebase.
          </p>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} ShopNest. All rights reserved.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">Shop</p>
          <div className="grid gap-1 text-sm text-slate-600">
            <Link href="/products" className="hover:text-slate-900">
              Products
            </Link>
            <Link href="/cart" className="hover:text-slate-900">
              Cart
            </Link>
            <Link href="/checkout" className="hover:text-slate-900">
              Checkout
            </Link>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">Account</p>
          <div className="grid gap-1 text-sm text-slate-600">
            <Link href="/auth/login" className="hover:text-slate-900">
              Login
            </Link>
            <Link href="/auth/signup" className="hover:text-slate-900">
              Sign up
            </Link>
            <Link href="/auth/verify" className="hover:text-slate-900">
              Verify email
            </Link>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">Support</p>
          <div className="grid gap-1 text-sm text-slate-600">
            <span>help@shopnest.test</span>
            <span>Mon–Fri · 9am–6pm</span>
            <span className="text-xs text-slate-500">
              (Demo links and email address)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}


