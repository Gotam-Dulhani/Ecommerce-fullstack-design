"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

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
    <div className="relative flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-fade-up rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-lg shadow-slate-900/10 md:p-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
          Sign in to continue
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Access your orders, saved details, and a faster checkout.
        </p>
        {verifyNotice && (
          <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            Check your inbox for a verification email. After verifying, sign in here.
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="text-xs font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-xs font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>
          {error && <p className="text-xs text-rose-500">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-slate-900/30 hover:bg-slate-800 disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-slate-900 underline-offset-2 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[70vh] items-center justify-center"><p className="text-sm text-slate-500">Loading...</p></div>}>
      <LoginForm />
    </Suspense>
  );
}


