"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

function AuthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      {/* Gradient mesh */}
      <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.6),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.4),transparent_50%),radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.3),transparent_60%)] animate-gradient-shift" />

      {/* Floating orbs */}
      <div className="absolute left-[10%] top-[15%] h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl animate-float-orb" />
      <div className="absolute right-[15%] top-[60%] h-72 w-72 rounded-full bg-pink-500/15 blur-3xl animate-float-orb-alt" />
      <div className="absolute left-[50%] top-[10%] h-48 w-48 rounded-full bg-sky-400/15 blur-3xl animate-float-orb-slow" />
      <div className="absolute bottom-[10%] left-[30%] h-56 w-56 rounded-full bg-violet-500/10 blur-3xl animate-float-orb" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:60px_60px]" />
    </div>
  );
}

function StarIcon() {
  return (
    <svg className="h-4 w-4 fill-amber-400 text-amber-400" viewBox="0 0 24 24">
      <path d="M10 15.27 16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand + imagery */}
      <div className="relative hidden w-1/2 lg:flex lg:flex-col lg:justify-between lg:p-10">
        <AuthBackground />
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-sm font-extrabold text-white backdrop-blur-sm">
              SN
            </span>
            <span className="text-lg font-bold text-white">ShopNest</span>
          </Link>
        </div>
        <div className="relative z-10 space-y-8">
          <h2 className="text-3xl font-extrabold leading-snug text-white xl:text-4xl">
            Welcome back to
            <br />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
              a better shopping experience
            </span>
          </h2>
          <div className="space-y-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-300">
              &ldquo;ShopNest makes online shopping effortless. The curated collections and fast checkout keep me coming back.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white backdrop-blur-sm">
                S
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Sarah M.</p>
                <p className="text-xs text-slate-400">Verified buyer</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} ShopNest. All rights reserved.
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <Link href="/" className="inline-flex items-center gap-2 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-sm font-extrabold text-white">
              SN
            </span>
            <span className="text-lg font-bold text-slate-900">ShopNest</span>
          </Link>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter your credentials to access your account
            </p>
          </div>

          {verifyNotice && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              <p className="text-xs leading-relaxed text-emerald-800">
                Check your inbox for a verification email. After verifying, sign in here.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-700">
                Email address
              </label>
              <div className="relative">
                <MailIcon />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <LockIcon />
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                <p className="text-xs text-rose-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
