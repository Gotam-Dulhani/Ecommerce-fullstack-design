"use client";

import Link from "next/link";
import { Shield, Truck, HeartHandshake, Star } from "lucide-react";

const values = [
  { icon: Shield, title: "Quality First", desc: "Every product is handpicked and tested before it earns a spot in our store." },
  { icon: Truck, title: "Fast Delivery", desc: "Free shipping on orders over Rs. 5,000. Most orders arrive within 3-5 business days." },
  { icon: HeartHandshake, title: "Customer Obsessed", desc: "Your satisfaction is our priority. Reach out anytime — we respond within 24 hours." },
  { icon: Star, title: "Curated Selection", desc: "We stock only what we'd use ourselves. No filler, no compromise." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 pt-24">
      {/* Hero */}
      <section className="max-w-3xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">About us</p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          We believe in quality over quantity.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-zinc-400">
          ShopNest was born from a simple idea: online shopping should feel premium, not overwhelming. We curate products that meet our high standards for design, durability, and value — so you never have to second-guess a purchase.
        </p>
      </section>

      {/* Story */}
      <section className="mt-20 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[var(--surface)] border border-white/5">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
            alt="Our store"
            className="block h-full w-full object-cover"
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">Our Story</h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            Founded in 2024, ShopNest started as a side project by two friends who were tired of scrolling through thousands of mediocre products online. We wanted a store where every item felt like a find.
          </p>
          <p className="text-sm leading-relaxed text-zinc-400">
            Today, we serve customers across Pakistan with a curated catalog of electronics, clothing, home goods, beauty products, and lifestyle essentials. Our mission: make premium accessible.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold tracking-tight text-white">What we stand for</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-xl border border-white/5 bg-[var(--surface)] p-6">
              <v.icon className="h-6 w-6 text-[var(--gold)]" />
              <h3 className="mt-4 text-sm font-bold text-white">{v.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 rounded-xl border border-white/5 bg-[var(--surface)] p-8 sm:p-12 text-center">
        <h2 className="text-xl font-bold tracking-tight text-white">Ready to explore?</h2>
        <p className="mt-2 text-sm text-zinc-400">Browse our curated collection of 100+ premium products.</p>
        <Link href="/products" className="mt-6 inline-flex items-center rounded-full bg-[var(--gold)] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[var(--gold-dim)] transition-colors">
          Shop now
        </Link>
      </section>
    </div>
  );
}
