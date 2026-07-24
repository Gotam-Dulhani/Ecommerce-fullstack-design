"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Mail, Lock, ArrowRight, ShoppingBag } from "lucide-react";

function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const verifyNotice = searchParams.get("verify");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await signIn(email.trim(), password);
      router.push(res.requiresEmailVerification ? "/auth/verify" : "/");
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to sign in."); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left — Branding */}
      <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden bg-[var(--background)]">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[var(--gold)]/8 blur-[120px] animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[var(--gold)]/5 blur-[100px] animate-[pulse_8s_ease-in-out_infinite_1s]" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-amber-500/5 blur-[80px] animate-[pulse_7s_ease-in-out_infinite_2s] -translate-x-1/2 -translate-y-1/2" />
        </div>
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(212,168,83,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-10 text-center px-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--gold)]/10 border border-[var(--gold)]/20">
            <ShoppingBag className="h-9 w-9 text-[var(--gold)]" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">Welcome to ShopNest</h2>
          <p className="mt-3 text-sm text-zinc-400 max-w-xs mx-auto leading-relaxed">
            Premium curated products for the modern connoisseur. Quality craftsmanship, timeless design.
          </p>
          <div className="mt-8 flex items-center justify-center gap-8 text-xs text-zinc-500">
            <div className="text-center">
              <p className="text-lg font-bold text-white">148+</p>
              <p>Products</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <p className="text-lg font-bold text-white">8</p>
              <p>Categories</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <p className="text-lg font-bold text-white">4.5+</p>
              <p>Avg Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2 bg-[var(--background)]">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="lg:hidden text-center">
            <Link href="/" className="text-2xl font-black tracking-widest text-white uppercase">
              SHOPNEST<span className="text-[var(--gold)]">.</span>
            </Link>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Sign in</h1>
            <p className="mt-2 text-sm text-zinc-400">Enter your credentials to access your account.</p>
          </div>

          {verifyNotice && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-500">
              Check your inbox for a verification email. After verifying, sign in here.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                <input id="email" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-[var(--gold)]/50 focus:outline-none transition-colors" />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                <input id="password" type="password" required placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-[var(--gold)]/50 focus:outline-none transition-colors" />
              </div>
            </div>
            {error && <p className="rounded-lg bg-red-500/10 px-4 py-3 text-xs text-red-500">{error}</p>}
            <button type="submit" disabled={submitting}
              className="group w-full rounded-full bg-[var(--gold)] py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[var(--gold-dim)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? "Signing in..." : <>Sign in <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-semibold text-[var(--gold)] hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[var(--background)]"><div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-[var(--gold)]" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
