import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 py-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="text-lg font-black tracking-widest text-white uppercase">
              SHOPNEST<span className="text-[var(--gold)]">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
              Curated premium products for the modern connoisseur. Quality craftsmanship, timeless design.
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Shop</p>
            <div className="mt-4 space-y-3 text-sm text-zinc-500">
              <Link href="/products" className="block hover:text-white transition-colors">All Products</Link>
              <Link href="/products" className="block hover:text-white transition-colors">New Arrivals</Link>
              <Link href="/products" className="block hover:text-white transition-colors">Best Sellers</Link>
              <Link href="/gift-cards" className="block hover:text-white transition-colors">Gift Cards</Link>
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Company</p>
            <div className="mt-4 space-y-3 text-sm text-zinc-500">
              <Link href="/about" className="block hover:text-white transition-colors">About us</Link>
              <Link href="/contact" className="block hover:text-white transition-colors">Contact</Link>
              <Link href="/wishlist" className="block hover:text-white transition-colors">Wishlist</Link>
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Support</p>
            <div className="mt-4 space-y-3 text-sm text-zinc-500">
              <span className="block">help@shopnest.store</span>
              <span className="block">Mon–Fri, 9am–6pm</span>
              <span className="block">Lahore, Pakistan</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 py-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-zinc-600">© {new Date().getFullYear()} ShopNest. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-zinc-600">
            <span className="cursor-pointer hover:text-zinc-400 transition-colors">Privacy</span>
            <span className="cursor-pointer hover:text-zinc-400 transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
