"use client";

import Link from "next/link";

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function VisaIcon() {
  return (
    <svg className="h-8 w-auto" viewBox="0 0 48 32" fill="none">
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <path d="M19.5 21H17L18.8 11H21.3L19.5 21ZM30 11.3C29.5 11.1 28.7 10.9 27.8 10.9C25.5 10.9 23.9 12.1 23.9 13.7C23.9 14.9 25 15.6 25.8 16C26.6 16.4 26.9 16.7 26.9 17.1C26.9 17.8 26 18.1 25.2 18.1C24.2 18.1 23.6 17.9 22.8 17.5L22.5 17.4L22.2 19.2C22.8 19.5 23.9 19.7 25.1 19.7C27.5 19.7 29 18.5 29 16.8C29 15.9 28.5 15.2 27.2 14.6C26.4 14.2 26 13.9 26 13.5C26 13.1 26.4 12.7 27.2 12.7C27.9 12.7 28.5 12.9 28.9 13.1L29.1 13.2L29.9 11.5L30 11.3ZM34.7 11H32.7C32 11 31.6 11.2 31.3 11.9L27.6 21H30.2L30.8 19.4H34.2L34.5 21H36.8L34.7 11ZM31.4 17.5L32.7 13.8L33.5 17.5H31.4ZM22.4 11L20 17.6L19.7 16.2C19.2 14.6 17.7 12.8 16 11.9L18.1 21H20.7L24.8 11H22.4Z" fill="white" />
    </svg>
  );
}

function MastercardIcon() {
  return (
    <svg className="h-8 w-auto" viewBox="0 0 48 32" fill="none">
      <rect width="48" height="32" rx="4" fill="#252525" />
      <circle cx="19" cy="16" r="8" fill="#EB001B" />
      <circle cx="29" cy="16" r="8" fill="#F79E1B" />
      <path d="M24 10.3a8 8 0 0 1 0 11.4 8 8 0 0 1 0-11.4z" fill="#FF5F00" />
    </svg>
  );
}

function AmexIcon() {
  return (
    <svg className="h-8 w-auto" viewBox="0 0 48 32" fill="none">
      <rect width="48" height="32" rx="4" fill="#2E77BC" />
      <path d="M7 21L9.5 11H12.5L15 21H13L12.5 19H9.5L9 21H7ZM10 17.5H12L11 14L10 17.5ZM17 11H22C23.5 11 24.5 11.8 24.5 13C24.5 14.2 23.5 15 22 15H19V11H17V21H22C23.5 21 24.5 21.8 24.5 23C24.5 24.2 23.5 25 22 25H17V11ZM26 11H29L31 15.5L33 11H36L33 16L36 21H33L31 16.5L29 21H26L29 16L26 11ZM37 11H42L44 15.5L46 11H48L45 16L48 21H45.5L43.5 16.5L42 21H37L40 16L37 11Z" fill="white" />
    </svg>
  );
}

function PayPalIcon() {
  return (
    <svg className="h-8 w-auto" viewBox="0 0 48 32" fill="none">
      <rect width="48" height="32" rx="4" fill="#FFFFFF" stroke="#E5E7EB" />
      <path d="M19.5 9H14.5C14 9 13.5 9.5 13.5 10L11 22C11 22.5 11.3 23 12 23H15.5C16 23 16.5 22.5 16.5 22L17.5 16H21C25 16 27 13 27.5 11C27.8 10 27.3 9 26.3 9H19.5Z" fill="#253B80" />
      <path d="M29.5 13H25.5C25 13 24.5 13.3 24.3 13.8L22 22C21.9 22.4 22.2 22.7 22.5 22.7H25.5C26 22.7 26.5 22.3 26.6 21.8L27.5 16.3C27.6 15.9 28 15.5 28.5 15.5H30C33 15.5 35 13.5 35.5 12C35.8 11 35.3 10 34.3 10H29.5V13Z" fill="#179BD7" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-900 text-slate-300">
      {/* Newsletter */}
      <div className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 text-center sm:flex-row sm:text-left md:px-6">
          <div className="flex-1">
            <h3 className="text-base font-bold text-white">Stay in the loop</h3>
            <p className="mt-0.5 text-sm text-slate-400">Get the latest on new arrivals, exclusive deals, and more.</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex w-full max-w-sm gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4 md:px-6">
        {/* Brand */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-sm font-extrabold text-white">
              SN
            </span>
            <p className="text-lg font-bold text-white">ShopNest</p>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            A premium shopping destination for modern lifestyles. Quality products, curated collections.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition hover:bg-slate-700 hover:text-white" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition hover:bg-slate-700 hover:text-white" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition hover:bg-slate-700 hover:text-white" aria-label="Twitter">
              <TwitterIcon />
            </a>
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition hover:bg-slate-700 hover:text-white" aria-label="YouTube">
              <YoutubeIcon />
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-white">Shop</p>
          <div className="grid gap-1.5 text-sm text-slate-400">
            <Link href="/products" className="transition hover:text-white">All Products</Link>
            <Link href="/products" className="transition hover:text-white">New Arrivals</Link>
            <Link href="/products" className="transition hover:text-white">Best Sellers</Link>
            <Link href="/products" className="transition hover:text-white">Sale</Link>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-bold text-white">Account</p>
          <div className="grid gap-1.5 text-sm text-slate-400">
            <Link href="/auth/login" className="transition hover:text-white">Login</Link>
            <Link href="/auth/signup" className="transition hover:text-white">Sign up</Link>
            <Link href="/cart" className="transition hover:text-white">Cart</Link>
            <Link href="/checkout" className="transition hover:text-white">Checkout</Link>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-bold text-white">Support</p>
          <div className="grid gap-1.5 text-sm text-slate-400">
            <span>help@shopnest.store</span>
            <span>Mon–Fri &middot; 9am–6pm</span>
            <Link href="#" className="transition hover:text-white">FAQ</Link>
            <Link href="#" className="transition hover:text-white">Shipping & Returns</Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row md:px-6">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} ShopNest. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <VisaIcon />
            <MastercardIcon />
            <AmexIcon />
            <PayPalIcon />
          </div>
        </div>
      </div>
    </footer>
  );
}
