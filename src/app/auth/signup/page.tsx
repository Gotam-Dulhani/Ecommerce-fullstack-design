"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

function AuthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_40%,rgba(236,72,153,0.5),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.5),transparent_50%),radial-gradient(circle_at_50%_20%,rgba(56,189,248,0.3),transparent_50%)] animate-gradient-shift" />
      <div className="absolute right-[10%] top-[20%] h-64 w-64 rounded-full bg-pink-500/20 blur-3xl animate-float-orb" />
      <div className="absolute left-[15%] top-[55%] h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl animate-float-orb-alt" />
      <div className="absolute right-[40%] bottom-[10%] h-48 w-48 rounded-full bg-sky-400/15 blur-3xl animate-float-orb-slow" />
      <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:60px_60px]" />
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-5 w-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
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

export default function SignupPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    const normalizedEmail = email.trim();
    const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!emailLooksValid) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await signUp(normalizedEmail, password, fullName);
      router.push("/auth/verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
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
            Start your
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
              shopping journey
            </span>
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {[
                { num: "25+", label: "Products" },
                { num: "100%", label: "Secure" },
                { num: "24/7", label: "Support" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <p className="text-lg font-extrabold text-white">{stat.num}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
            <ShieldIcon />
            <p className="text-xs leading-relaxed text-slate-300">
              Your data is encrypted and protected with enterprise-grade security.
            </p>
          </div>
        </div>
        <div className="relative z-10 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} ShopNest. All rights reserved.
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-sm font-extrabold text-white">
              SN
            </span>
            <span className="text-lg font-bold text-slate-900">ShopNest</span>
          </Link>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Join thousands of happy shoppers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-xs font-semibold text-slate-700">
                Full name
              </label>
              <div className="relative">
                <UserIcon />
                <input
                  id="fullName"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

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
                  minLength={8}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              {password.length > 0 && (
                <div className="mt-1.5 flex gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length >= (i + 1) * 3
                          ? password.length >= 12
                            ? "bg-emerald-500"
                            : password.length >= 8
                              ? "bg-amber-500"
                              : "bg-rose-400"
                          : "bg-slate-100"
                      }`}
                    />
                  ))}
                </div>
              )}
              {password.length > 0 && (
                <p className="mt-1 text-[11px] text-slate-400">
                  {password.length >= 12 ? "Strong" : password.length >= 8 ? "Fair" : "Weak"} — use 12+ characters for a stronger password
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-semibold text-slate-700">
                Confirm password
              </label>
              <div className="relative">
                <LockIcon />
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              {confirmPassword.length > 0 && (
                <p className={`mt-1 text-[11px] ${password === confirmPassword ? "text-emerald-600" : "text-rose-500"}`}>
                  {password === confirmPassword ? "Passwords match" : "Passwords don't match"}
                </p>
              )}
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
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
